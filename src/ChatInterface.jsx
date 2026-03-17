import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { WORKFLOW_STATES, getInitialMessages, getNextMessages, generateCurriculumAI, generateCurriculum } from './workflowMock';

function useTypingText(text, speed = 14, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [done, setDone] = useState(!enabled);
  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return; }
    setDisplayed(''); setDone(false);
    let i = 0;
    const id = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) { clearInterval(id); setDone(true); } }, speed);
    return () => clearInterval(id);
  }, [text, speed, enabled]);
  return { displayed, done };
}

function renderText(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>;
    return part.split('\n').map((line, j, arr) => <span key={`${i}-${j}`}>{line}{j < arr.length-1 && <br/>}</span>);
  });
}

function Message({ message, isLatest, onOptionSelect, optionsEnabled }) {
  const isAI = message.role === 'ai';
  const { displayed, done } = useTypingText(message.text, 14, isAI && isLatest);
  const timeStr = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`message-row ${isAI ? 'ai' : 'user'}`}>
      <div className={`message-avatar ${isAI ? 'ai' : 'user'}`}>{isAI ? <Sparkles size={14}/> : 'Y'}</div>
      <div className="message-content">
        <div className={`message-bubble ${isAI ? 'ai' : 'user'}`}>{renderText(isAI ? displayed : message.text)}</div>
        {done && message.options && optionsEnabled && (
          <div className="option-chips">
            {message.options.map(opt => (
              <button key={opt.value} className="option-chip" onClick={() => onOptionSelect(opt.value, opt.label)} style={opt.color ? { borderColor: `${opt.color}60`, color: opt.color } : {}}>{opt.label}</button>
            ))}
          </div>
        )}
        <span className="message-time">{timeStr}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="message-row ai">
      <div className="message-avatar ai"><Sparkles size={14}/></div>
      <div className="message-content">
        <div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
      </div>
    </div>
  );
}

const STEP_LABELS = {
  [WORKFLOW_STATES.ASK_NAME]: 'Step 1 of 5 — Your Name',
  [WORKFLOW_STATES.ASK_ROLE]: 'Step 2 of 5 — Role',
  [WORKFLOW_STATES.ASK_EXPERIENCE]: 'Step 3 of 5 — Experience',
  [WORKFLOW_STATES.ASK_FOCUS]: 'Step 4 of 5 — Focus Area',
  [WORKFLOW_STATES.ASK_GOALS]: 'Step 5 of 5 — Goals',
};
const STEP_PROGRESS = {
  [WORKFLOW_STATES.ASK_NAME]: 5,
  [WORKFLOW_STATES.ASK_ROLE]: 25,
  [WORKFLOW_STATES.ASK_EXPERIENCE]: 50,
  [WORKFLOW_STATES.ASK_FOCUS]: 72,
  [WORKFLOW_STATES.ASK_GOALS]: 90,
};
const CHIPS = ['Junior Backend Engineer','Factory Floor Manager','Senior Data Scientist','Product Manager','Frontend Developer'];

export default function ChatInterface({ onCurriculumGenerated }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [optionsEnabled, setOptionsEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STATES.ASK_NAME);
  const [collectedData, setCollectedData] = useState({});
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const endRef = useRef(null);
  const fired = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping, generating]);

  const processQueue = useCallback((queue) => {
    if (!queue.length) return;
    const [first, ...rest] = queue;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { ...first, isLatest: true }]);
      setOptionsEnabled(true);
      if (rest.length > 0) setTimeout(() => { setIsTyping(true); setOptionsEnabled(false); processQueue(rest); }, 400);
    }, first.delay || 0);
  }, []);

  const startConvo = useCallback(() => {
    if (started) return;
    setStarted(true);
    setIsTyping(true);
    setTimeout(() => processQueue(getInitialMessages()), 500);
  }, [started, processQueue]);

  // Animate generating steps
  useEffect(() => {
    if (!generating) return;
    const steps = [0,1,2,3,4];
    let i = 0;
    const iv = setInterval(() => {
      setGenStep(steps[i] || 0);
      i++;
      if (i >= steps.length) clearInterval(iv);
    }, 600);
    return () => clearInterval(iv);
  }, [generating]);

  const handleInput = useCallback(async (rawText, displayLabel) => {
    if (!started || generating || fired.current) return;
    const displayText = displayLabel || rawText;
    setMessages(prev => [...prev.map(m => ({...m, isLatest: false})), {
      id: `u-${Date.now()}`, role: 'user', text: displayText, timestamp: new Date().toISOString(),
    }]);
    setOptionsEnabled(false);
    setInputValue('');

    const result = getNextMessages({ currentStep, collectedData }, rawText);
    const newData = { ...collectedData, ...result.newData };
    setCollectedData(newData);
    setCurrentStep(result.nextStep);

    if (result.triggerGeneration) {
      fired.current = true;
      // Show the last AI message briefly then show generating
      setIsTyping(true);
      setTimeout(() => {
        processQueue(result.messages);
      }, 400);
      setTimeout(async () => {
        setGenerating(true);
        let curriculum;
        try {
          curriculum = await generateCurriculumAI(newData);
          if (!curriculum?.weeks?.length) throw new Error('bad');
        } catch(e) {
          console.log('Using fallback curriculum');
          curriculum = generateCurriculum(newData);
        }
        // Pass to parent — this triggers page switch in App.jsx
        onCurriculumGenerated(curriculum);
      }, 2000);
    } else {
      setIsTyping(true);
      setTimeout(() => processQueue(result.messages), 400);
    }
  }, [started, generating, currentStep, collectedData, processQueue, onCurriculumGenerated]);

  const handleSend = useCallback(() => { const t = inputValue.trim(); if (t) handleInput(t); }, [inputValue, handleInput]);
  const handleKey = useCallback((e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }, [handleSend]);

  const genSteps = ['Analyzing your profile…','Mapping competencies…','Building 30-day plan…','Calibrating milestones…','Finalizing curriculum…'];

  if (generating) {
    return (
      <div className="chat-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div className="generating-ring"/>
        <div className="generating-title">Building Your Roadmap</div>
        <div className="generating-steps">
          {genSteps.map((s, i) => (
            <div key={i} className={`generating-step ${i === genStep ? 'active' : ''} ${i < genStep ? 'done' : ''}`}>
              <span>{i < genStep ? '✓' : i === genStep ? '▶' : '○'}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="chat-container">
        <div className="welcome-screen">
          <div className="welcome-orb"><Sparkles size={28} color="white"/></div>
          <h2 className="welcome-title">Your Personalized<br/>Onboarding Copilot</h2>
          <p className="welcome-sub">Tell me your role and I'll generate a 30-day roadmap built around your goals.</p>
          <div className="welcome-chips">
            {CHIPS.map(chip => <button key={chip} className="welcome-chip" onClick={() => { startConvo(); setTimeout(() => handleInput(chip), 2200); }}>{chip}</button>)}
          </div>
        </div>
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea className="chat-input" placeholder="Type your role, or click a suggestion above…" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKey} rows={1} onFocus={startConvo}/>
            <button className="chat-send-btn" onClick={() => { startConvo(); setTimeout(handleSend, 100); }}><Send size={16}/></button>
          </div>
          <div className="input-hint">Press Enter to send</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {STEP_LABELS[currentStep] && (
        <div style={{ padding: '12px 32px 0', flexShrink: 0 }}>
          <div className="progress-pill">
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${STEP_PROGRESS[currentStep]||0}%` }}/></div>
            <span className="progress-label">{STEP_LABELS[currentStep]}</span>
          </div>
        </div>
      )}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <Message key={msg.id} message={msg} isLatest={idx===messages.length-1 && msg.role==='ai'} onOptionSelect={handleInput} optionsEnabled={optionsEnabled && idx===messages.length-1}/>
        ))}
        {isTyping && <TypingIndicator/>}
        <div ref={endRef}/>
      </div>
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea className="chat-input" placeholder={isTyping ? 'Copilot is typing…' : 'Type your answer…'} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKey} disabled={isTyping} rows={1}/>
          <button className="chat-send-btn" onClick={handleSend} disabled={!inputValue.trim() || isTyping}><Send size={16}/></button>
        </div>
        <div className="input-hint">Press Enter to send · Shift+Enter for newline</div>
      </div>
    </div>
  );
}
