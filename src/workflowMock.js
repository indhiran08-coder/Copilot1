// ============================================================
// workflowMock.js — Dual AI Integration: Groq + Gemini
// Priority: Groq (llama3-8b-8192) → Gemini (gemini-pro) → Offline Fallback
// ============================================================

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const WORKFLOW_STATES = {
  WELCOME: 'WELCOME',
  ASK_NAME: 'ASK_NAME',
  ASK_ROLE: 'ASK_ROLE',
  ASK_EXPERIENCE: 'ASK_EXPERIENCE',
  ASK_FOCUS: 'ASK_FOCUS',
  ASK_GOALS: 'ASK_GOALS',
  GENERATING: 'GENERATING',
  COMPLETE: 'COMPLETE',
};

const ROLES = {
  'junior_backend': { label: 'Junior Backend Engineer', color: '#818cf8', icon: '⚙️', focusAreas: ['Microservices', 'API Design', 'Databases', 'Cloud/DevOps', 'Security'], goalOptions: ['Ace my first code review', 'Deploy to production solo', 'Understand system architecture', 'Contribute to the core platform'] },
  'senior_backend': { label: 'Senior Backend Engineer', color: '#22d3ee', icon: '🏗️', focusAreas: ['System Design', 'Team Leadership', 'Performance Optimization', 'Architecture Reviews', 'Mentorship'], goalOptions: ['Lead my first major feature', 'Reduce system latency', 'Mentor junior devs', 'Define architecture standards'] },
  'frontend_dev': { label: 'Frontend Developer', color: '#c084fc', icon: '🎨', focusAreas: ['Component Systems', 'Performance', 'Accessibility', 'State Management', 'Design Collaboration'], goalOptions: ['Ship the new design system', 'Improve Core Web Vitals', 'Lead a feature end-to-end', 'Master our tech stack'] },
  'product_manager': { label: 'Product Manager', color: '#fbbf24', icon: '🧭', focusAreas: ['Roadmap Planning', 'Stakeholder Alignment', 'Data & Analytics', 'User Research', 'Go-to-Market'], goalOptions: ['Ship first product release', 'Build cross-team relationships', 'Define product KPIs', 'Run my first sprint'] },
  'factory_manager': { label: 'Factory Floor Manager', color: '#f87171', icon: '🏭', focusAreas: ['Safety Protocols', 'Shift Management', 'Quality Control', 'Compliance', 'Equipment Operations'], goalOptions: ['Zero safety incidents in week 1', 'Run a full shift independently', 'Complete all certifications', 'Optimize production targets'] },
  'data_scientist': { label: 'Data Scientist', color: '#34d399', icon: '📊', focusAreas: ['Data Pipelines', 'ML Model Deployment', 'Business Intelligence', 'Data Governance', 'Experimentation'], goalOptions: ['Deploy first ML model', 'Build an automated dashboard', 'Align models to business goals', 'Establish data quality baselines'] },
};

async function callGroq(prompt) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(`Groq error: ${data.error.message}`);
  if (!data.choices?.[0]) throw new Error('No response from Groq');
  return data.choices[0].message.content;
}

async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');
  return text;
}

function buildPrompt(roleName, experience, focus, goal) {
  return `You are a corporate onboarding specialist. Generate a 30-day onboarding curriculum as a JSON object.

Employee: Role=${roleName}, Experience=${experience}, Focus=${focus}, Goal=${goal}

Return ONLY a valid JSON object, no markdown, no explanation, no extra text. Exactly this structure:
{"role":"${roleName}","experience":"${experience}","focus":"${focus}","goal":"${goal}","totalDays":30,"totalTasks":20,"weeks":[{"week":1,"title":"Week Title","theme":"One sentence theme","days":[{"day":1,"title":"Short Task Title","desc":"2 sentence description of what to do.","icon":"📋","type":"Setup","duration":"4h","tags":["tag1","tag2"]},{"day":2,"title":"Short Task Title","desc":"2 sentence description.","icon":"📚","type":"Learning","duration":"5h","tags":["tag1","tag2"]},{"day":3,"title":"Short Task Title","desc":"2 sentence description.","icon":"⚡","type":"Practice","duration":"6h","tags":["tag1","tag2"]},{"day":4,"title":"Short Task Title","desc":"2 sentence description.","icon":"🔨","type":"Build","duration":"5h","tags":["tag1","tag2"]},{"day":5,"title":"Short Task Title","desc":"2 sentence description.","icon":"✅","type":"Growth","duration":"3h","tags":["tag1","tag2"]}]},{"week":2,"title":"Week Title","theme":"One sentence theme","days":[{"day":8,"title":"Short Task Title","desc":"2 sentence description.","icon":"📊","type":"Analysis","duration":"6h","tags":["tag1","tag2"]},{"day":9,"title":"Short Task Title","desc":"2 sentence description.","icon":"👥","type":"Collaboration","duration":"4h","tags":["tag1","tag2"]},{"day":10,"title":"Short Task Title","desc":"2 sentence description.","icon":"🎯","type":"Practice","duration":"5h","tags":["tag1","tag2"]},{"day":11,"title":"Short Task Title","desc":"2 sentence description.","icon":"📝","type":"Learning","duration":"5h","tags":["tag1","tag2"]},{"day":12,"title":"Short Task Title","desc":"2 sentence description.","icon":"🔒","type":"Compliance","duration":"4h","tags":["tag1","tag2"]}]},{"week":3,"title":"Week Title","theme":"One sentence theme","days":[{"day":15,"title":"Short Task Title","desc":"2 sentence description.","icon":"🚀","type":"Build","duration":"7h","tags":["tag1","tag2"]},{"day":16,"title":"Short Task Title","desc":"2 sentence description.","icon":"🎤","type":"Milestone","duration":"3h","tags":["tag1","tag2"]},{"day":17,"title":"Short Task Title","desc":"2 sentence description.","icon":"🧩","type":"Practice","duration":"6h","tags":["tag1","tag2"]},{"day":18,"title":"Short Task Title","desc":"2 sentence description.","icon":"💬","type":"Collaboration","duration":"3h","tags":["tag1","tag2"]},{"day":19,"title":"Short Task Title","desc":"2 sentence description.","icon":"♻️","type":"Improvement","duration":"4h","tags":["tag1","tag2"]}]},{"week":4,"title":"Week Title","theme":"One sentence theme","days":[{"day":22,"title":"Short Task Title","desc":"2 sentence description.","icon":"🌟","type":"Milestone","duration":"6h","tags":["tag1","tag2"]},{"day":24,"title":"Short Task Title","desc":"2 sentence description.","icon":"📖","type":"Leadership","duration":"3h","tags":["tag1","tag2"]},{"day":26,"title":"Short Task Title","desc":"2 sentence description.","icon":"🎯","type":"Growth","duration":"2h","tags":["tag1","tag2"]},{"day":28,"title":"Short Task Title","desc":"2 sentence description.","icon":"🏆","type":"Milestone","duration":"7h","tags":["tag1","tag2"]},{"day":30,"title":"Short Task Title","desc":"2 sentence description.","icon":"✨","type":"Milestone","duration":"3h","tags":["tag1","tag2"]}]}]}

Make all titles, descriptions and themes SPECIFIC to the role ${roleName} and focus area ${focus}. Replace all placeholder text with real content. Return ONLY the JSON.`;
}

function parseJSON(raw) {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.weeks || parsed.weeks.length === 0) throw new Error('Invalid curriculum structure');
  return parsed;
}

export async function generateCurriculumAI(collectedData) {
  const { roleName, experience, focus, goal, userName } = collectedData;
  const prompt = buildPrompt(roleName, experience, focus, goal);

  // 1️⃣ Try Groq first (fast, free tier)
  if (GROQ_API_KEY) {
    try {
      console.log('🤖 Trying Groq...');
      const raw = await callGroq(prompt);
      const parsed = parseJSON(raw);
      console.log('✅ Groq succeeded');
      return { ...parsed, userName: userName || '' };
    } catch (err) {
      console.warn('⚠️ Groq failed:', err.message);
    }
  }

  // 2️⃣ Fallback to Gemini
  if (GEMINI_API_KEY) {
    try {
      console.log('🤖 Trying Gemini...');
      const raw = await callGemini(prompt);
      const parsed = parseJSON(raw);
      console.log('✅ Gemini succeeded');
      return { ...parsed, userName: userName || '' };
    } catch (err) {
      console.warn('⚠️ Gemini failed:', err.message);
    }
  }

  // 3️⃣ Offline fallback
  console.log('📦 Using offline fallback curriculum');
  return { ...generateFallbackCurriculum(collectedData), userName: userName || '' };
}

function generateFallbackCurriculum(context) {
  return {
    role: context.roleName || 'Professional',
    experience: context.experience || 'Mid-level',
    focus: context.focus || 'General',
    goal: context.goal || 'Excel in the role',
    totalDays: 30,
    totalTasks: 20,
    weeks: [
      { week: 1, title: 'Foundation & Orientation', theme: 'Getting your bearings and setting up for success', days: [
        { day: 1, title: 'Environment Setup', desc: 'Configure all tools, access credentials, and meet your team. Complete all required system access requests.', icon: '🛠️', type: 'Setup', duration: '4h', tags: ['env', 'tools'] },
        { day: 2, title: 'Team & Culture Deep Dive', desc: 'Meet all key stakeholders and understand team dynamics. Learn communication norms and decision-making processes.', icon: '👥', type: 'Learning', duration: '5h', tags: ['team', 'culture'] },
        { day: 3, title: 'Core Systems Training', desc: `Learn the primary tools and systems used in ${context.focus}. Complete all required onboarding documentation.`, icon: '📚', type: 'Learning', duration: '6h', tags: ['systems', 'training'] },
        { day: 4, title: 'First Contribution', desc: 'Complete a small, well-defined task in your area. Get familiar with the review and approval process.', icon: '⚡', type: 'Practice', duration: '6h', tags: ['practice', 'first'] },
        { day: 5, title: 'Week 1 Reflection', desc: 'Document your learnings and open questions. Meet with your manager for a week 1 check-in.', icon: '📝', type: 'Growth', duration: '3h', tags: ['retro', '1:1'] },
      ]},
      { week: 2, title: 'Core Skills Development', theme: 'Building depth in your primary responsibilities', days: [
        { day: 8, title: 'Deep Skill Training', desc: `Intensive training on core competencies required for ${context.focus}. Work through real examples from your team.`, icon: '🎯', type: 'Learning', duration: '7h', tags: ['skills', 'depth'] },
        { day: 9, title: 'Shadow Senior Colleague', desc: 'Shadow an experienced team member through a full work cycle. Document key observations and questions.', icon: '👀', type: 'Shadow', duration: '8h', tags: ['shadow', 'learn'] },
        { day: 10, title: 'Independent Practice Task', desc: 'Complete a medium-complexity task independently. Apply learnings from shadowing and training sessions.', icon: '🔨', type: 'Practice', duration: '6h', tags: ['practice', 'solo'] },
        { day: 11, title: 'Cross-Team Collaboration', desc: 'Attend cross-functional meetings and understand how your role interfaces with other departments.', icon: '🤝', type: 'Collaboration', duration: '4h', tags: ['collab', 'cross'] },
        { day: 12, title: 'Compliance Review', desc: 'Complete required compliance training and review standard operating procedures for your role.', icon: '✅', type: 'Compliance', duration: '5h', tags: ['compliance', 'sop'] },
      ]},
      { week: 3, title: 'Independent Ownership', theme: 'Taking ownership of real work with growing autonomy', days: [
        { day: 15, title: 'Lead Your First Project', desc: `Own a complete deliverable in ${context.focus} from start to finish with minimal supervision.`, icon: '🚀', type: 'Build', duration: '8h', tags: ['lead', 'own'] },
        { day: 16, title: 'Stakeholder Presentation', desc: 'Present your work and findings to a small group of stakeholders. Practice clear and concise communication.', icon: '🎤', type: 'Milestone', duration: '3h', tags: ['present', 'comms'] },
        { day: 17, title: 'Problem Solving Challenge', desc: 'Tackle an open-ended problem in your domain. Research solutions, propose a plan, and get feedback.', icon: '🧩', type: 'Practice', duration: '7h', tags: ['problem', 'solve'] },
        { day: 18, title: 'Peer Feedback Session', desc: 'Exchange structured feedback with peers. Identify 3 strengths and 2 development areas to focus on.', icon: '💬', type: 'Growth', duration: '3h', tags: ['feedback', 'peer'] },
        { day: 19, title: 'Process Improvement Idea', desc: 'Identify one process that could be improved. Document the current state and propose a solution.', icon: '♻️', type: 'Improvement', duration: '4h', tags: ['improve', 'process'] },
      ]},
      { week: 4, title: 'Impact & Integration', theme: 'Cementing your place on the team and planning the future', days: [
        { day: 22, title: 'Major Deliverable Launch', desc: 'Complete and ship your most significant piece of work to date. Ensure quality, documentation, and handover are complete.', icon: '🌟', type: 'Milestone', duration: '8h', tags: ['ship', 'milestone'] },
        { day: 24, title: 'Knowledge Share', desc: 'Share what you have learned with a newer colleague or document insights for the team wiki.', icon: '📖', type: 'Leadership', duration: '3h', tags: ['mentor', 'share'] },
        { day: 26, title: '90-Day Goal Planning', desc: 'Work with your manager to define clear OKRs and development goals for your next 60 days.', icon: '🎯', type: 'Growth', duration: '2h', tags: ['goals', 'okr'] },
        { day: 28, title: 'Full Independence Milestone', desc: 'Complete a full work cycle entirely independently. Demonstrate readiness for unsupervised ownership.', icon: '🏆', type: 'Milestone', duration: '8h', tags: ['solo', 'milestone'] },
        { day: 30, title: '30-Day Impact Report', desc: 'Write and present your 30-day retrospective covering achievements, lessons learned, and your 90-day vision.', icon: '✨', type: 'Milestone', duration: '3h', tags: ['retro', 'report'] },
      ]},
    ],
  };
}

export function getInitialMessages() {
  return [
    { id: 'ai-1', role: 'ai', text: 'Welcome to **Copilot Onboard** 👋\n\nI\'m your AI onboarding assistant. I\'ll craft a fully personalized 30-day curriculum tailored precisely to you.', timestamp: new Date().toISOString(), delay: 0 },
    { id: 'ai-2', role: 'ai', text: 'First — **what\'s your name?** I\'ll use this to personalize your curriculum and completion certificate.', timestamp: new Date().toISOString(), delay: 1200 },
  ];
}

export function getNextMessages(state, userInput) {
  const { currentStep, collectedData } = state;
  switch (currentStep) {
    case WORKFLOW_STATES.ASK_NAME: {
      const firstName = userInput.trim().split(' ')[0] || 'there';
      return {
        messages: [{ id: `ai-${Date.now()}`, role: 'ai', text: `Great to meet you, **${firstName}**! 👋\n\nNow let's build your personalized roadmap. **What role are you joining in?**`, timestamp: new Date().toISOString(), delay: 600, options: Object.entries(ROLES).map(([key, val]) => ({ value: key, label: `${val.icon} ${val.label}`, color: val.color })) }],
        nextStep: WORKFLOW_STATES.ASK_ROLE,
        newData: { userName: userInput.trim() },
      };
    }
    case WORKFLOW_STATES.ASK_ROLE: {
      const input = userInput.toLowerCase();
      const roleKey = Object.keys(ROLES).find(k => input === k || input.includes(k.replace(/_/g, ' ')) || input.includes(ROLES[k].label.toLowerCase())) || 'junior_backend';
      const role = ROLES[roleKey] || ROLES['junior_backend'];
      return {
        messages: [{ id: `ai-${Date.now()}`, role: 'ai', text: `${role.icon} Great — **${role.label}** it is.\n\n**How many years of experience are you bringing?**`, timestamp: new Date().toISOString(), delay: 800, options: [{ value: 'new_grad', label: '🌱 New grad / 0–1 yr' }, { value: 'junior', label: '⚡ Junior / 1–3 yrs' }, { value: 'mid', label: '🔥 Mid-level / 3–6 yrs' }, { value: 'senior', label: '🚀 Senior / 6+ yrs' }] }],
        nextStep: WORKFLOW_STATES.ASK_EXPERIENCE,
        newData: { roleKey, roleName: role.label },
      };
    }
    case WORKFLOW_STATES.ASK_EXPERIENCE: {
      const role = ROLES[collectedData.roleKey] || ROLES['junior_backend'];
      return {
        messages: [{ id: `ai-${Date.now()}`, role: 'ai', text: `Perfect. **Which area would you most like to focus on in your first 30 days?**`, timestamp: new Date().toISOString(), delay: 700, options: role.focusAreas.map(area => ({ value: area, label: `→ ${area}` })) }],
        nextStep: WORKFLOW_STATES.ASK_FOCUS,
        newData: { experience: userInput },
      };
    }
    case WORKFLOW_STATES.ASK_FOCUS: {
      const role = ROLES[collectedData.roleKey] || ROLES['junior_backend'];
      return {
        messages: [{ id: `ai-${Date.now()}`, role: 'ai', text: `Excellent. Last one — **what's your single most important goal for your first 30 days?**`, timestamp: new Date().toISOString(), delay: 600, options: role.goalOptions.map(goal => ({ value: goal, label: `🎯 ${goal}` })) }],
        nextStep: WORKFLOW_STATES.ASK_GOALS,
        newData: { focus: userInput },
      };
    }
    case WORKFLOW_STATES.ASK_GOALS: {
      return {
        messages: [{ id: `ai-${Date.now()}`, role: 'ai', text: `🔥 All set! **AI is now generating your personalized 30-day roadmap** — building tasks and milestones specifically for your profile.`, timestamp: new Date().toISOString(), delay: 500 }],
        nextStep: WORKFLOW_STATES.GENERATING,
        newData: { goal: userInput },
        triggerGeneration: true,
      };
    }
    default:
      return { messages: [], nextStep: currentStep, newData: {} };
  }
}

export function generateCurriculum(collectedData) {
  return generateFallbackCurriculum(collectedData);
}

export function getRoleInfo(roleKey) {
  return ROLES[roleKey] || ROLES['junior_backend'];
}

export { ROLES };
