// ============================================================
// TaskCompleteModal.jsx — Task Completion Verification Modal
// ============================================================
import { useState } from 'react';
import { CheckCircle2, X, Star, Zap, BookOpen, AlertCircle } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', emoji: '😊', color: '#10b981' },
  { value: 'medium', label: 'Medium', emoji: '🤔', color: '#f59e0b' },
  { value: 'hard', label: 'Hard', emoji: '💪', color: '#ef4444' },
];

const TYPE_COLORS = {
  Setup: '#818cf8', Learning: '#22d3ee', Practice: '#f59e0b',
  Build: '#10b981', Compliance: '#ef4444', Certification: '#f59e0b',
  Shadow: '#a855f7', Analysis: '#06b6d4', Collaboration: '#22d3ee',
  Leadership: '#f59e0b', Research: '#818cf8', Milestone: '#fbbf24',
  Growth: '#10b981', Business: '#06b6d4', Improvement: '#a855f7',
};

export default function TaskCompleteModal({ day, weekColor, onConfirm, onClose }) {
  const [reflection, setReflection] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [error, setError] = useState('');
  const color = weekColor || TYPE_COLORS[day?.type] || '#6366f1';

  const handleConfirm = () => {
    if (!reflection.trim()) {
      setError('Please share what you accomplished — even one sentence!');
      return;
    }
    if (!difficulty) {
      setError('Please rate the difficulty of this task.');
      return;
    }
    setError('');
    onConfirm({ reflection: reflection.trim(), difficulty });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,6,15,0.85)', backdropFilter: 'blur(12px)',
      padding: '20px', animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '460px',
        background: 'rgba(13,17,40,0.98)',
        border: `1px solid ${color}40`,
        borderRadius: '20px', padding: '28px',
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${color}20`,
        animation: 'fadeInUp 0.3s cubic-bezier(0.34,1.2,0.64,1)',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }} onClick={e => e.stopPropagation()}>

        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, borderRadius: '20px 20px 0 0' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                DAY {day?.day} · {day?.type}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {day?.title}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
            <X size={13} />
          </button>
        </div>

        {/* Task summary */}
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {day?.desc}
        </div>

        {/* Reflection input */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            📝 What did you accomplish or learn? *
          </label>
          <textarea
            value={reflection}
            onChange={e => { setReflection(e.target.value); setError(''); }}
            placeholder="e.g. Set up my dev environment and met the team lead. Got access to all required tools..."
            rows={3}
            style={{
              width: '100%', padding: '12px 14px',
              borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${reflection ? color + '50' : 'rgba(255,255,255,0.08)'}`,
              color: 'var(--text-primary)', fontSize: '13px',
              fontFamily: 'var(--font-display)', outline: 'none',
              resize: 'none', lineHeight: 1.6, boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = color + '60'}
            onBlur={e => e.target.style.borderColor = reflection ? color + '50' : 'rgba(255,255,255,0.08)'}
          />
        </div>

        {/* Difficulty rating */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            ⚡ How difficult was this task? *
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {DIFFICULTY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setDifficulty(opt.value); setError(''); }}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: '10px',
                  background: difficulty === opt.value ? `${opt.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${difficulty === opt.value ? opt.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  color: difficulty === opt.value ? opt.color : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-display)', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  boxShadow: difficulty === opt.value ? `0 0 12px ${opt.color}25` : 'none',
                }}
              >
                <span style={{ fontSize: '18px' }}>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', color: '#f87171' }}>
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            Not Yet
          </button>
          <button
            onClick={handleConfirm}
            style={{ flex: 2, padding: '12px', borderRadius: '10px', background: `linear-gradient(135deg, ${color}, ${color}cc)`, border: 'none', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 0 16px ${color}40` }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <CheckCircle2 size={14} />
            Mark as Complete ✓
          </button>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Your reflection is saved to your session and counts toward your completion certificate
        </div>
      </div>
    </div>
  );
}
