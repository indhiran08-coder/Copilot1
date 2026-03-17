// ============================================================
// ProfileSettings.jsx — User Profile & Settings Panel
// ============================================================
import { useState, useEffect } from 'react';
import { User, Building, Briefcase, Save, LogOut, Trash2, CheckCircle2, Award, Clock, Target } from 'lucide-react';
import { getProfile, updateProfile, signOut, getUserSessions, deleteSession } from './supabase';

export default function ProfileSettings({ user, onSignOut, onLoadSession }) {
  const [profile, setProfile] = useState({ full_name: '', company: '', job_title: '' });
  const [sessions, setSessions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    const { data: profileData } = await getProfile(user.id);
    if (profileData) setProfile(profileData);
    const { data: sessionData } = await getUserSessions(user.id);
    if (sessionData) setSessions(sessionData);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    await updateProfile(user.id, profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDeleteSession(sessionId) {
    await deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }

  async function handleSignOut() {
    await signOut();
    onSignOut();
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 36px',
    borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)', fontSize: '13px',
    fontFamily: 'var(--font-display)', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  const tabs = ['profile', 'sessions', 'settings'];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeInUp 0.4s ease forwards' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.4)', flexShrink: 0 }}>
          {(profile.full_name || user?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {profile.full_name || 'Your Profile'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</p>
        </div>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--border-glass), transparent)' }} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '7px 18px', borderRadius: '999px', border: `1px solid ${activeTab === tab ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: activeTab === tab ? 'rgba(99,102,241,0.15)' : 'transparent', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', textTransform: 'capitalize', transition: 'all 0.2s' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Personal Information</div>

          {[
            { icon: User, label: 'Full Name', key: 'full_name', placeholder: 'Your full name', type: 'text' },
            { icon: Building, label: 'Company', key: 'company', placeholder: 'Your company name', type: 'text' },
            { icon: Briefcase, label: 'Job Title', key: 'job_title', placeholder: 'Your job title', type: 'text' },
          ].map(({ icon: Icon, label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={type} placeholder={placeholder}
                  value={profile[key] || ''}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #6366f1, #a855f7)', border: saved ? '1px solid rgba(16,185,129,0.4)' : 'none', color: 'white', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.3s', boxShadow: saved ? 'none' : '0 0 16px rgba(99,102,241,0.35)', marginTop: '4px' }}
          >
            {saved ? <><CheckCircle2 size={14} /> Saved!</> : saving ? 'Saving...' : <><Save size={14} /> Save Profile</>}
          </button>
        </div>
      )}

      {/* ── Sessions Tab ── */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Saved Sessions ({sessions.length})
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No saved sessions yet. Generate a curriculum to save your first session!
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{session.role_name}</div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {session.focus && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {session.focus}</span>}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>✓ {(session.completed_days || []).length} tasks done</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🗓 {new Date(session.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onLoadSession(session)}
                    style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Settings Tab ── */}
      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Account Settings</div>

          {/* Account Info */}
          <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Email</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { icon: Award, label: 'Sessions Created', value: sessions.length, color: '#818cf8' },
              { icon: CheckCircle2, label: 'Tasks Completed', value: sessions.reduce((acc, s) => acc + (s.completed_days || []).length, 0), color: '#10b981' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Icon size={16} color={color} />
                <div style={{ fontSize: '22px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s', marginTop: '4px' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
