// ============================================================
// CurriculumTimeline.jsx — Interactive 30-Day Roadmap
// ============================================================
import { useState } from 'react';
import { updateSessionProgress } from './supabase';
import { exportCurriculumToPDF } from './exportPDF';
import TaskCompleteModal from './TaskCompleteModal';
import {
  Calendar, Clock, Target, Zap, CheckCircle2,
  Download,
  ChevronRight, BookOpen, Award, Users, Shield,
  BarChart2, Wrench, Rocket, Star, ArrowLeft
} from 'lucide-react';

// ── Icon Map ──────────────────────────────────────────────
const TYPE_ICONS = {
  Setup: Wrench,
  Learning: BookOpen,
  Practice: Zap,
  Build: Rocket,
  Compliance: Shield,
  Certification: Award,
  Shadow: Users,
  Analysis: BarChart2,
  Collaboration: Users,
  Leadership: Star,
  Research: BookOpen,
  Milestone: Star,
  Growth: Target,
  Business: BarChart2,
  Improvement: Zap,
};

// Week color config
const WEEK_CONFIG = [
  { cls: 'week-1', color: '#818cf8', glow: 'rgba(99,102,241,0.3)', label: 'Week 1' },
  { cls: 'week-2', color: '#22d3ee', glow: 'rgba(6,182,212,0.3)', label: 'Week 2' },
  { cls: 'week-3', color: '#c084fc', glow: 'rgba(168,85,247,0.3)', label: 'Week 3' },
  { cls: 'week-4', color: '#fbbf24', glow: 'rgba(245,158,11,0.3)', label: 'Week 4' },
];

// ── Day Card ──────────────────────────────────────────────
function DayCard({ day, weekIndex, globalIndex, onToggle, completed }) {
  const wc = WEEK_CONFIG[weekIndex];
  const IconComponent = TYPE_ICONS[day.type] || BookOpen;
  const animDelay = `${(globalIndex % 5) * 80}ms`;

  return (
    <div
      className={`day-card ${WEEK_CONFIG[weekIndex].cls} ${completed ? 'completed' : ''}`}
      style={{ animationDelay: animDelay }}
      onClick={() => onToggle(day.day)}
    >
      <div className="day-card-top">
        <span className="day-number-badge">DAY {day.day}</span>
        <span className="day-type-tag">{day.type}</span>
      </div>

      <div className="day-card-icon">
        <IconComponent size={20} />
      </div>

      <h4 className="day-title">{day.title}</h4>
      <p className="day-desc">{day.desc}</p>

      <div className="day-card-footer">
        <div className="day-duration">
          <Clock size={10} />
          <span>{day.duration}</span>
        </div>
        <div className="day-tags">
          {day.tags.slice(0, 2).map(tag => (
            <span key={tag} className="day-tag">{tag}</span>
          ))}
        </div>
        {completed && (
          <CheckCircle2 size={16} color="var(--accent-success)" style={{ marginLeft: 'auto' }} />
        )}
      </div>
    </div>
  );
}

// ── Day Detail Panel ──────────────────────────────────────
function DayDetailPanel({ day, weekIndex, onClose }) {
  if (!day) return null;
  const wc = WEEK_CONFIG[weekIndex];
  const IconComponent = TYPE_ICONS[day.type] || BookOpen;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 6, 15, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'rgba(13, 17, 40, 0.95)',
          border: `1px solid ${wc.color}40`,
          borderRadius: '20px',
          padding: '32px',
          boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${wc.glow}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: wc.color, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              DAY {day.day} · {day.type}
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{day.title}</h3>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${wc.color}20`, color: wc.color, boxShadow: `0 0 16px ${wc.glow}`
          }}>
            <IconComponent size={22} />
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{day.desc}</p>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            <span>{day.duration} estimated</span>
          </div>
          {day.tags.map(tag => (
            <span key={tag} style={{ padding: '6px 14px', borderRadius: '999px', background: `${wc.color}12`, border: `1px solid ${wc.color}30`, fontSize: '11px', color: wc.color, fontFamily: 'var(--font-mono)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Objectives */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Learning Objectives</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Complete all primary tasks and document your learnings',
              'Share key takeaways with your buddy or team lead',
              'Log completion in your onboarding tracker',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <ChevronRight size={14} color={wc.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            padding: '12px', borderRadius: '12px', background: `${wc.color}15`,
            border: `1px solid ${wc.color}30`, color: wc.color,
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Main CurriculumTimeline ───────────────────────────────
export default function CurriculumTimeline({ curriculum, onBack, completedDays: externalDays, setCompletedDays: setExternalDays, sessionId, userId }) {
  const [activeWeek, setActiveWeek] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [localDays, setLocalDays] = useState(new Set());
  const completedDays = externalDays || localDays;
  const setCompletedDays = setExternalDays || setLocalDays;
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayWeekIndex, setSelectedDayWeekIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [pendingDay, setPendingDay] = useState(null);
  const [pendingWeekColor, setPendingWeekColor] = useState(null);
  const [taskReflections, setTaskReflections] = useState({});

  // Toggle a day complete/incomplete directly (used by DayCard's onToggle)
  const toggleDay = (dayNum) => {
    const next = new Set(completedDays);
    if (next.has(dayNum)) next.delete(dayNum); else next.add(dayNum);
    setCompletedDays(next);
    if (sessionId && userId) updateSessionProgress(sessionId, Array.from(next));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportCurriculumToPDF(curriculum);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDayClick = (day, weekColor) => {
    if (completedDays.has(day.day)) {
      // If already complete, allow unchecking directly
      const next = new Set(completedDays);
      next.delete(day.day);
      setCompletedDays(next);
      if (sessionId && userId) updateSessionProgress(sessionId, Array.from(next));
    } else {
      // Open confirmation modal
      setPendingDay(day);
      setPendingWeekColor(weekColor);
    }
  };

  const handleConfirmComplete = async ({ reflection, difficulty }) => {
    if (!pendingDay) return;
    const next = new Set(completedDays);
    next.add(pendingDay.day);
    setCompletedDays(next);
    if (reflection || difficulty) {
      setTaskReflections(prev => ({ ...prev, [pendingDay.day]: { reflection, difficulty } }));
    }
    if (sessionId && userId) await updateSessionProgress(sessionId, Array.from(next));
    setPendingDay(null);
    setPendingWeekColor(null);
  };

  const openDay = (day, weekIndex) => {
    setSelectedDay(day);
    setSelectedDayWeekIndex(weekIndex);
  };

  const totalDays = curriculum.weeks.reduce((acc, w) => acc + w.days.length, 0);
  const totalHours = curriculum.weeks.reduce((acc, w) =>
    acc + w.days.reduce((a, d) => a + parseInt(d.duration), 0), 0
  );

  const filteredWeeks = activeWeek === 'all'
    ? curriculum.weeks
    : curriculum.weeks.filter((_, i) => i === parseInt(activeWeek));

  let globalCardIndex = 0;

  return (
    <div className="timeline-container view-transition-enter">

      {/* Header */}
      <div className="timeline-header">
        <div className="timeline-header-left">
          <span className="timeline-eyebrow">
            30-DAY ONBOARDING ROADMAP
          </span>
          <h1 className="timeline-main-title">{curriculum.role}</h1>
          <div className="timeline-meta">
            <div className="meta-pill">
              <Calendar size={10} />
              <span>{curriculum.experience || 'All experience levels'}</span>
            </div>
            {curriculum.focus && (
              <div className="meta-pill">
                <Target size={10} />
                <span>Focus: {curriculum.focus}</span>
              </div>
            )}
            <button
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', borderRadius: '999px',
                background: 'transparent', border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ArrowLeft size={10} />
              New Session
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '999px',
                background: isExporting ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none',
                color: 'white', fontSize: '12px', cursor: isExporting ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600,
                boxShadow: isExporting ? 'none' : '0 0 20px rgba(99,102,241,0.5)',
                transition: 'all 0.2s', opacity: isExporting ? 0.7 : 1,
              }}
            >
              <Download size={11} />
              {isExporting ? 'Exporting…' : 'Export PDF'}
            </button>
          </div>
        </div>

        <div className="timeline-stats">
          <div className="stat-card">
            <span className="stat-number">30</span>
            <span className="stat-label">Days</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalDays}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalHours}</span>
            <span className="stat-label">Hours</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completedDays.size}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>
      </div>

      {/* Week Tabs */}
      <div className="week-tabs">
        <button
          className={`week-tab ${activeWeek === 'all' ? 'active' : ''}`}
          onClick={() => setActiveWeek('all')}
        >
          All Weeks
        </button>
        {curriculum.weeks.map((week, i) => (
          <button
            key={i}
            className={`week-tab ${activeWeek === String(i) ? 'active' : ''}`}
            onClick={() => setActiveWeek(String(i))}
          >
            <div className="week-tab-dot" style={{ background: WEEK_CONFIG[i].color, boxShadow: `0 0 6px ${WEEK_CONFIG[i].color}` }} />
            Week {week.week}: {week.title}
          </button>
        ))}
      </div>


      {/* Task Type Filter */}
      <div style={{ display: 'flex', gap: '6px', padding: '8px 32px', background: 'rgba(5,6,15,0.2)', flexShrink: 0, overflowX: 'auto', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: '4px' }}>Filter:</span>
        {['all', ...new Set(curriculum.weeks?.flatMap(w => w.days?.map(d => d.type)) || [])].map(type => (
          <button key={type} onClick={() => setActiveFilter(type)} style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${activeFilter === type ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: activeFilter === type ? 'rgba(99,102,241,0.15)' : 'transparent', color: activeFilter === type ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', transition: 'all 0.2s', textTransform: type === 'all' ? 'none' : 'capitalize' }}>
            {type === 'all' ? 'All Tasks' : type}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="timeline-scroll">
        {filteredWeeks.map((week, weekIdx) => {
          const trueWeekIdx = activeWeek === 'all' ? weekIdx : parseInt(activeWeek);
          const wc = WEEK_CONFIG[trueWeekIdx];

          return (
            <div key={week.week} className={`week-section ${wc.cls}`}>
              <div className="week-section-header">
                <span
                  className="week-badge"
                  style={{ boxShadow: `0 0 12px ${wc.glow}` }}
                >
                  Week {week.week}
                </span>
                <span className="week-title">{week.title}</span>
                <div className="week-line" />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                  {week.theme}
                </span>
              </div>

              <div className="days-grid">
                {week.days.map((day) => {
                  const idx = globalCardIndex++;
                  return (
                    <div key={day.day} onClick={() => !completedDays.has(day.day) ? handleDayClick(day, WEEK_CONFIG[trueWeekIdx].color) : openDay(day, trueWeekIdx)}>
                      <DayCard
                        day={day}
                        weekIndex={trueWeekIdx}
                        globalIndex={idx}
                        onToggle={toggleDay}
                        completed={completedDays.has(day.day)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bottom Spacer */}
        <div style={{ height: '32px' }} />
      </div>

      {/* Task Complete Modal */}
      {pendingDay && (
        <TaskCompleteModal
          day={pendingDay}
          weekColor={pendingWeekColor}
          onConfirm={handleConfirmComplete}
          onClose={() => { setPendingDay(null); setPendingWeekColor(null); }}
        />
      )}

      {/* Detail Panel */}
      {selectedDay && (
        <DayDetailPanel
          day={selectedDay}
          weekIndex={selectedDayWeekIndex}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
