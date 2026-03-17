// ============================================================
// Dashboard.jsx — Progress Tracker & Analytics View
// ============================================================
import { useState, useEffect } from 'react';
import {
  CheckCircle2, Clock, Target, TrendingUp,
  Award, Zap, BookOpen, Users, BarChart2,
  Calendar, ArrowRight, Star
} from 'lucide-react';

const WEEK_COLORS = ['#818cf8', '#22d3ee', '#c084fc', '#fbbf24'];
const TYPE_COLORS = {
  Setup: '#818cf8', Learning: '#22d3ee', Practice: '#f59e0b',
  Build: '#10b981', Compliance: '#ef4444', Certification: '#f59e0b',
  Shadow: '#a855f7', Analysis: '#06b6d4', Collaboration: '#22d3ee',
  Leadership: '#f59e0b', Research: '#818cf8', Milestone: '#fbbf24',
  Growth: '#10b981', Business: '#06b6d4', Improvement: '#a855f7',
};
const TYPE_ICONS = {
  Setup: Zap, Learning: BookOpen, Practice: Target, Build: TrendingUp,
  Compliance: CheckCircle2, Certification: Award, Shadow: Users,
  Analysis: BarChart2, Collaboration: Users, Leadership: Star,
  Research: BookOpen, Milestone: Star, Growth: TrendingUp,
  Business: BarChart2, Improvement: Zap,
};

function ProgressRing({ percent, size = 110, stroke = 9, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animOffset, setAnimOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setAnimOffset(circ - (percent / 100) * circ), 100);
    return () => clearTimeout(t);
  }, [percent, circ]);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={animOffset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

function useCountUp(target, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target) || 0;
    if (num === 0) { setCount(target); return; }
    const t = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(num / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= num) { setCount(typeof target === 'string' ? target : num); clearInterval(timer); }
        else setCount(typeof target === 'string' ? String(start) + target.replace(/[0-9]/g,'') : start);
      }, 16);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const animatedValue = useCountUp(value, 1000, delay + 200);
  return (
    <div style={{
      padding: '20px', borderRadius: '14px',
      background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column', gap: '10px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '26px', fontWeight: 800, color, fontFamily: 'var(--font-mono)', lineHeight: 1, transition: 'all 0.1s' }}>{animatedValue}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

function WeekProgressBar({ week, weekIndex, completedDays, totalDays }) {
  const color = WEEK_COLORS[weekIndex];
  const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 200 + weekIndex * 100); return () => clearTimeout(t); }, [pct, weekIndex]);
  return (
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '3px 10px', borderRadius: '999px', background: `${color}15`, border: `1px solid ${color}30`, fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            WEEK {week.week}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{week.title}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{pct}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(to right, ${color}, ${color}99)`, width: `${width}%`, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 8px ${color}80` }} />
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {week.days?.map((day, i) => {
          const done = completedDays > i;
          return (
            <div key={day.day} title={`Day ${day.day}: ${day.title}`} style={{ width: '28px', height: '28px', borderRadius: '6px', background: done ? `${color}25` : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? color + '50' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: done ? color : 'var(--text-muted)', fontFamily: 'var(--font-mono)', cursor: 'default' }}>
              {day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypeBreakdown({ curriculum }) {
  const typeCounts = {};
  curriculum.weeks?.forEach(w => w.days?.forEach(d => { typeCounts[d.type] = (typeCounts[d.type] || 0) + 1; }));
  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  return (
    <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Activity Breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map(([type, count]) => {
          const color = TYPE_COLORS[type] || '#818cf8';
          const pct = Math.round((count / total) * 100);
          const Icon = TYPE_ICONS[type] || BookOpen;
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={12} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{type}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{count} · {pct}%</span>
                </div>
                <div style={{ height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: '999px', background: color, width: `${pct}%`, boxShadow: `0 0 6px ${color}60`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingTasks({ curriculum, completedCount }) {
  const allDays = curriculum.weeks?.flatMap(w => w.days) || [];
  const upcoming = allDays.slice(completedCount, completedCount + 4);
  return (
    <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Up Next</div>
      {upcoming.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>All tasks complete! 🎉</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {upcoming.map((day, i) => {
            const color = TYPE_COLORS[day.type] || '#818cf8';
            return (
              <div key={day.day} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: i === 0 ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
                  {day.day}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.title}</div>
                  <div style={{ fontSize: '10px', color, fontWeight: 500, marginTop: '2px' }}>{day.type} · {day.duration}</div>
                </div>
                {i === 0 && <ArrowRight size={12} color="var(--accent-primary)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ curriculum, completedDays }) {
  const allDays = curriculum?.weeks?.flatMap(w => w.days) || [];
  const totalTasks = allDays.length;
  const completedCount = completedDays?.size || 0;
  const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const totalHours = allDays.reduce((acc, d) => acc + parseInt(d.duration || 4), 0);
  const completedHours = allDays.filter(d => completedDays?.has(d.day)).reduce((acc, d) => acc + parseInt(d.duration || 4), 0);
  const currentWeekIdx = Math.max(0, curriculum?.weeks?.findIndex(w => w.days?.some(d => !completedDays?.has(d.day))) ?? 0);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);
  if (!curriculum) return null;

  const motivationText = pct === 0 ? "Ready to start? Complete your first task today! 🚀"
    : pct < 25 ? "Great start! You're building momentum. Keep going! ⚡"
    : pct < 50 ? "Solid progress! You're a quarter of the way through. 🔥"
    : pct < 75 ? "Halfway there! You're absolutely crushing this. 💪"
    : pct < 100 ? "Almost done! The finish line is in sight. 🏁"
    : "Onboarding complete! You're officially integrated. 🏆";

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>PROGRESS DASHBOARD</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{curriculum.role}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Track your onboarding progress · Week {currentWeekIdx + 1} of 4</p>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProgressRing percent={pct} size={110} stroke={9} color="#6366f1" />
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>Done</span>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--border-glass), transparent)' }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
        <StatCard icon={CheckCircle2} label="Tasks Completed" value={completedCount} sub={`of ${totalTasks} total`} color="#10b981" delay={0} />
        <StatCard icon={Clock} label="Hours Logged" value={`${completedHours}h`} sub={`of ${totalHours}h total`} color="#6366f1" delay={80} />
        <StatCard icon={Calendar} label="Current Week" value={`Wk ${currentWeekIdx + 1}`} sub={curriculum.weeks?.[currentWeekIdx]?.title} color="#22d3ee" delay={160} />
        <StatCard icon={Target} label="Primary Goal" value="Active" sub={curriculum.goal || 'On Track'} color="#a855f7" delay={240} />
      </div>

      {/* Week breakdown + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Weekly Progress</div>
          {curriculum.weeks?.map((week, i) => {
            const weekCompleted = (week.days || []).filter(d => completedDays?.has(d.day)).length;
            return <WeekProgressBar key={week.week} week={week} weekIndex={i} completedDays={weekCompleted} totalDays={(week.days || []).length} />;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <TypeBreakdown curriculum={curriculum} />
          <UpcomingTasks curriculum={curriculum} completedCount={completedCount} />
        </div>
      </div>

      {/* Motivational banner */}
      <div style={{ padding: '18px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{motivationText}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{completedCount} of {totalTasks} tasks · {totalHours - completedHours}h remaining</div>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: '999px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontSize: '12px', fontWeight: 700, color: 'white', boxShadow: '0 0 16px rgba(99,102,241,0.4)', whiteSpace: 'nowrap' }}>
          {pct}% Complete
        </div>
      </div>
    </div>
  );
}
