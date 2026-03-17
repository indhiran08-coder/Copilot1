# ✦ Copilot Onboard — Dynamic Corporate Onboarding Copilot

A futuristic, glassmorphism-themed AI onboarding app that generates personalized 30-day curricula based on employee role and experience.

## 🚀 Quick Start

```bash
# 1. Navigate to this directory
cd onboarding-copilot

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
src/
├── index.css           # Full design system (CSS variables, glassmorphism, animations)
├── main.jsx            # Vite/React entry point
├── App.jsx             # Root layout: Sidebar + TopBar + Content routing
├── ChatInterface.jsx   # Conversational AI UI with typing effects & option chips
├── CurriculumTimeline.jsx  # Interactive 30-day roadmap with week tabs & day cards
└── workflowMock.js     # State machine simulating the AI agent workflow
```

---

## 🎭 Supported Roles

| Role | Theme Color | Curriculum Focus |
|------|------------|------------------|
| Junior Backend Engineer | Indigo | Microservices, APIs, CI/CD, PRs |
| Senior Backend Engineer | Cyan | Architecture, mentorship, system design |
| Frontend Developer | Violet | Components, perf, accessibility |
| Product Manager | Amber | Roadmaps, PRDs, experiments |
| Factory Floor Manager | Red | Safety, LOTO, shift management, compliance |
| Data Scientist | Emerald | EDA, A/B testing, ML deployment |

---

## 🎨 Design System Highlights

- **Glassmorphism**: `backdrop-filter: blur(16px) saturate(180%)` across all panels
- **Color System**: Deep purple/indigo primary, cyan secondary, violet tertiary, amber accent
- **Typography**: Outfit (display) + JetBrains Mono (code/labels)
- **Animations**: Message-in bounce, orb pulse rings, card stagger entrance, typing dots
- **Dark ambient**: Radial gradient mesh background + subtle grid overlay

---

## 🔄 Conversation Flow

```
Welcome → ASK_ROLE → ASK_EXPERIENCE → ASK_FOCUS → ASK_GOALS → GENERATING → TIMELINE
```

Each step collects context that shapes the curriculum template output.

---

## 🛠️ Extending

**Add a new role**: In `workflowMock.js`, add an entry to `ROLES` and a matching template in `CURRICULUM_TEMPLATES`.

**Connect a real LLM**: Replace `getNextMessages()` and `generateCurriculum()` in `workflowMock.js` with actual API calls. The state machine interface stays the same.

**Add persistence**: Wrap `collectedData` / `curriculum` state with `localStorage` or a backend API call in `App.jsx`.
