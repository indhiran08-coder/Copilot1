// ============================================================
// App.jsx — FINAL STABLE VERSION
// ============================================================
import { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Settings, Bell, LayoutDashboard,
  MessageSquare, BookOpen, HelpCircle, ExternalLink,
  Zap, ChevronRight, LogIn
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import CurriculumTimeline from './CurriculumTimeline';
import Dashboard from './Dashboard';
import AuthModal from './AuthModal';
import ProfileSettings from './ProfileSettings';
import CompletionCelebration from './CompletionCelebration';
import { supabase, saveCurriculumSession, getUserSessions, updateSessionProgress } from './supabase';

const SAMPLE_HISTORY = [
  { id: 1, label: 'Junior Backend Engineer', color: '#818cf8' },
  { id: 2, label: 'Product Manager - SaaS', color: '#fbbf24' },
  { id: 3, label: 'Factory Floor Manager', color: '#f87171' },
];

// ── Resources Panel ───────────────────────────────────────
function ResourcesPanel() {
  const resources = [
    { category: 'Onboarding Guides', color: '#818cf8', items: [
      { title: 'Engineering Onboarding Handbook', desc: 'Best practices for technical roles', link: 'https://github.com/raylene/eng-handbook' },
      { title: 'Manager Onboarding Checklist', desc: '30-60-90 day framework', link: 'https://www.notion.so/templates/manager-onboarding' },
      { title: 'GitLab Remote Onboarding', desc: 'For distributed teams', link: 'https://about.gitlab.com/handbook/people-group/general-onboarding/' },
    ]},
    { category: 'Learning Platforms', color: '#22d3ee', items: [
      { title: 'Coursera for Business', desc: 'Role-specific learning paths', link: 'https://www.coursera.org/business' },
      { title: 'LinkedIn Learning', desc: 'Professional skill development', link: 'https://learning.linkedin.com' },
      { title: 'Google Skillshop', desc: 'Google certifications', link: 'https://skillshop.withgoogle.com' },
    ]},
    { category: 'HR & Compliance', color: '#10b981', items: [
      { title: 'OSHA Training Resources', desc: 'Safety & compliance courses', link: 'https://www.osha.gov/training' },
      { title: 'SHRM Onboarding Guide', desc: 'HR best practices', link: 'https://www.shrm.org/topics-tools/topics/onboarding' },
      { title: 'BambooHR Templates', desc: 'Free onboarding templates', link: 'https://www.bamboohr.com/resources' },
    ]},
    { category: 'Productivity Tools', color: '#f59e0b', items: [
      { title: 'Notion Onboarding Template', desc: 'Ready-to-use workspace', link: 'https://www.notion.so/templates/category/hr' },
      { title: 'Asana New Employee Template', desc: 'Task management for onboarding', link: 'https://asana.com/templates/employee-onboarding' },
      { title: 'Loom Video Guides', desc: 'Async video onboarding', link: 'https://www.loom.com/use-cases/onboarding' },
    ]},
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>RESOURCE LIBRARY</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Onboarding Resources</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Curated tools, guides, and platforms to accelerate your onboarding journey</p>
      </div>
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--border-glass), transparent)' }} />
      {resources.map(cat => (
        <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '3px 12px', borderRadius: '999px', background: `${cat.color}15`, border: `1px solid ${cat.color}30`, fontSize: '10px', fontWeight: 700, color: cat.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat.category}</div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--border-subtle), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {cat.items.map(item => (
              <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer"
                style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${cat.color}40`; e.currentTarget.style.background = `${cat.color}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${cat.color}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.title}</span>
                  <ExternalLink size={12} color={cat.color} style={{ flexShrink: 0 }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</span>
                <span style={{ fontSize: '10px', color: cat.color, fontWeight: 600 }}>Open →</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────
function Sidebar({ onNew, currentSession, page, setPage, hasCurriculum, user, onAuthClick, savedSessions, onLoadSession }) {
  const navItems = [
    { icon: MessageSquare, label: 'Chat & Curriculum', id: 'chat' },
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', requiresCurriculum: true },
    { icon: BookOpen, label: 'Resources', id: 'resources' },
    { icon: Settings, label: 'Profile & Settings', id: 'profile', requiresAuth: true },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Sparkles size={16} color="white" /></div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">Copilot</span>
          <span className="sidebar-logo-sub">Onboard · v2.0</span>
        </div>
      </div>
      <div className="sidebar-divider" />
      <button className="sidebar-new-btn" onClick={onNew}>
        <Plus size={14} /><span>New Onboarding Session</span>
      </button>
      <div className="sidebar-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span className="sidebar-section-label">Navigation</span>
        {navItems.map(({ icon: Icon, label, id, requiresCurriculum, requiresAuth }) => {
          const locked = (requiresCurriculum && !hasCurriculum) || (requiresAuth && !user);
          const isActive = page === id || (id === 'chat' && (page === 'timeline' || page === 'roadmap-dashboard'));
          return (
            <div key={id}
              className={`history-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (requiresAuth && !user) { onAuthClick(); return; }
                if (locked) return;
                if (id === 'chat') setPage(hasCurriculum ? 'timeline' : 'chat');
                else setPage(id);
              }}
              style={{ cursor: locked && !requiresAuth ? 'not-allowed' : 'pointer', opacity: locked && !requiresAuth ? 0.35 : 1 }}
            >
              <Icon size={13} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              <span className="history-item-text">{label}</span>
              {locked && requiresAuth && !user && <span style={{ fontSize: '9px', color: 'var(--accent-primary)', marginLeft: 'auto', fontWeight: 600 }}>Login</span>}
              {locked && requiresCurriculum && <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: 'auto' }}>locked</span>}
              {!locked && !isActive && <ChevronRight size={10} color="var(--text-muted)" style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </div>
          );
        })}
      </div>
      <div className="sidebar-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <span className="sidebar-section-label">Recent Sessions</span>
        <div className="sidebar-history">
          {(savedSessions.length > 0 ? savedSessions.slice(0, 5) : SAMPLE_HISTORY).map((item, idx) => (
            <div key={item.id || idx}
              className="history-item"
              onClick={() => item.curriculum && onLoadSession && onLoadSession(item)}
              style={{ cursor: item.curriculum ? 'pointer' : 'default' }}
            >
              <div className="history-dot" style={{ background: item.color || ['#818cf8','#22d3ee','#c084fc','#fbbf24','#f87171'][idx % 5], boxShadow: `0 0 6px ${item.color || '#818cf8'}` }} />
              <span className="history-item-text">{item.label || item.role_name}</span>
            </div>
          ))}
          {currentSession && (
            <div className="history-item active">
              <div className="history-dot" style={{ background: 'var(--accent-secondary)', boxShadow: '0 0 6px var(--glow-secondary)' }} />
              <span className="history-item-text">{currentSession}</span>
            </div>
          )}
        </div>
      </div>
      <div className="sidebar-footer">
        {!user ? (
          <button onClick={onAuthClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', width: '100%', marginBottom: '8px' }}>
            <LogIn size={13} /><span>Sign in to save sessions</span>
          </button>
        ) : (
          <div className="sidebar-user" onClick={() => setPage('profile')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-avatar">{(user.email || 'U').charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.email?.split('@')[0]}</div>
              <div className="sidebar-user-role">Signed in · Click for profile</div>
            </div>
            <Settings size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </div>
        )}
        {!user && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={12} color="var(--accent-primary)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>Select a role chip or type freely to start</span>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Top Bar ───────────────────────────────────────────────
function TopBar({ page, setPage, curriculumRole, curriculumUserName, hasCurriculum }) {
  const titles = {
    chat:     { title: 'Onboarding Copilot', sub: curriculumUserName ? `Welcome, ${curriculumUserName}` : 'AI-powered curriculum generation' },
    timeline: { title: `Roadmap — ${curriculumRole || '30-Day Plan'}`, sub: 'Click any card to view details · Click to mark complete' },
    'roadmap-dashboard': { title: `Dashboard — ${curriculumRole || ''}`, sub: 'Live progress tracking' },
    dashboard: { title: `Dashboard — ${curriculumRole || ''}`, sub: 'Live progress tracking' },
    resources: { title: 'Resource Library', sub: 'Curated guides, tools, and learning platforms' },
    profile:   { title: 'Profile & Settings', sub: 'Manage your account and saved sessions' },
  };
  const current = titles[page] || titles.chat;
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span className="topbar-title">{current.title}</span>
          <span className="topbar-subtitle">{current.sub}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {hasCurriculum && (page === 'timeline' || page === 'roadmap-dashboard') && (
          <div style={{ display: 'flex', gap: '6px' }}>
            {[{ id: 'timeline', label: 'Roadmap' }, { id: 'roadmap-dashboard', label: '📊 Dashboard' }].map(tab => (
              <button key={tab.id} onClick={() => setPage(tab.id)}
                style={{ padding: '6px 14px', borderRadius: '999px', border: `1px solid ${page === tab.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: page === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent', color: page === tab.id ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}
        <div className="topbar-status"><div className="status-dot" /><span className="status-text">AI ONLINE</span></div>
        <div className="topbar-actions">
          <button className="icon-btn"><Bell size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────
export default function App() {
  // Single source of truth: page controls exactly what's shown
  // pages: 'chat' | 'timeline' | 'roadmap-dashboard' | 'dashboard' | 'resources' | 'profile'
  const [page, setPage] = useState('chat');
  const [curriculum, setCurriculum] = useState(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadSessions(session.user.id); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) loadSessions(u.id);
      else setSavedSessions([]);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentSessionId && user && completedDays.size > 0) {
      updateSessionProgress(currentSessionId, Array.from(completedDays));
    }
    if (curriculum) {
      const total = curriculum.weeks?.reduce((acc, w) => acc + (w.days?.length || 0), 0) || 0;
      if (total > 0 && completedDays.size >= total) {
        setTimeout(() => setShowCelebration(true), 600);
      }
    }
  }, [completedDays]);

  async function loadSessions(userId) {
    const { data } = await getUserSessions(userId);
    if (data) setSavedSessions(data);
  }

  const handleCurriculumGenerated = async (data) => {
    if (!data || !data.weeks) return;
    setCurriculum(data);
    setPage('timeline');
    if (user) {
      try {
        const { data: session } = await saveCurriculumSession(user.id, data);
        if (session) { setCurrentSessionId(session.id); loadSessions(user.id); }
      } catch (e) { console.error('Save failed:', e); }
    }
  };

  const handleNewSession = () => {
    setCurriculum(null);
    setPage('chat');
    setSessionKey(k => k + 1);
    setCompletedDays(new Set());
    setCurrentSessionId(null);
    setShowCelebration(false);
  };

  const handleLoadSession = (session) => {
    setCurriculum(session.curriculum);
    setCompletedDays(new Set(session.completed_days || []));
    setCurrentSessionId(session.id);
    setPage('timeline');
  };

  return (
    <div className="app-layout">
      <Sidebar
        onNew={handleNewSession}
        currentSession={curriculum?.role}
        page={page}
        setPage={setPage}
        hasCurriculum={!!curriculum}
        user={user}
        onAuthClick={() => setShowAuth(true)}
        savedSessions={savedSessions}
        onLoadSession={handleLoadSession}
      />

      <div className="main-content">
        <TopBar
          page={page}
          setPage={setPage}
          curriculumRole={curriculum?.role}
          curriculumUserName={curriculum?.userName}
          hasCurriculum={!!curriculum}
        />

        {/* Each page is a completely independent render — no overlap possible */}
        {page === 'chat' && (
          <ChatInterface
            key={sessionKey}
            onCurriculumGenerated={handleCurriculumGenerated}
          />
        )}

        {page === 'timeline' && curriculum && (
          <CurriculumTimeline
            curriculum={curriculum}
            onBack={handleNewSession}
            completedDays={completedDays}
            setCompletedDays={setCompletedDays}
            sessionId={currentSessionId}
            userId={user?.id}
          />
        )}

        {page === 'roadmap-dashboard' && curriculum && (
          <Dashboard curriculum={curriculum} completedDays={completedDays} />
        )}

        {page === 'dashboard' && curriculum && (
          <Dashboard curriculum={curriculum} completedDays={completedDays} />
        )}

        {page === 'resources' && <ResourcesPanel />}

        {page === 'profile' && user && (
          <ProfileSettings
            user={user}
            onSignOut={() => { setUser(null); setPage('chat'); }}
            onLoadSession={(s) => { handleLoadSession(s); }}
          />
        )}
      </div>

      {showCelebration && curriculum && (
        <CompletionCelebration
          curriculum={curriculum}
          userName={curriculum?.userName || user?.email?.split('@')[0] || 'New Employee'}
          onContinue={() => setShowCelebration(false)}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(u) => { setUser(u); setShowAuth(false); loadSessions(u.id); }}
        />
      )}
    </div>
  );
}
