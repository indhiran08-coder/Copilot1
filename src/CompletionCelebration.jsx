// ============================================================
// CompletionCelebration.jsx — 30-Day Completion Screen
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Award, Download, Star, CheckCircle2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';

function random(min, max) { return Math.random() * (max - min) + min; }

// ── Confetti Particle ─────────────────────────────────────
function useConfetti(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#6366f1','#a855f7','#22d3ee','#fbbf24','#10b981','#f59e0b','#ec4899'];
    const particles = Array.from({ length: 120 }, () => ({
      x: random(0, canvas.width),
      y: random(-canvas.height, 0),
      w: random(6, 14), h: random(8, 18),
      color: colors[Math.floor(random(0, colors.length))],
      rotation: random(0, 360),
      rotSpeed: random(-3, 3),
      speedY: random(2, 5),
      speedX: random(-1.5, 1.5),
      opacity: 1,
    }));

    let frame;
    let running = true;

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height) { p.y = -20; p.x = random(0, canvas.width); }
      });
      frame = requestAnimationFrame(draw);
    }

    draw();
    const timeout = setTimeout(() => { running = false; cancelAnimationFrame(frame); }, 6000);
    return () => { running = false; cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [active, canvasRef]);
}

// ── Certificate PDF ───────────────────────────────────────
function downloadCertificate(curriculum, userName) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;

  // Background
  doc.setFillColor(5, 6, 15);
  doc.rect(0, 0, W, H, 'F');

  // Border
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.4);
  doc.rect(11, 11, W - 22, H - 22);

  // Corner accents
  const corners = [[8,8],[W-8,8],[8,H-8],[W-8,H-8]];
  corners.forEach(([cx, cy]) => {
    doc.setFillColor(99, 102, 241);
    doc.circle(cx, cy, 3, 'F');
  });

  // Top accent bar
  doc.setFillColor(99, 102, 241);
  doc.rect(8, 8, (W-16)/2, 3, 'F');
  doc.setFillColor(168, 85, 247);
  doc.rect(8 + (W-16)/2, 8, (W-16)/2, 3, 'F');

  // Header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text('COPILOT ONBOARD', W/2, 28, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('AI-POWERED ONBOARDING PLATFORM', W/2, 34, { align: 'center' });

  // Divider
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  doc.line(40, 38, W-40, 38);

  // Main text
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('This certifies that', W/2, 52, { align: 'center' });

  // Name box
  const displayName = userName && userName !== 'New Employee' ? userName : 'Onboarding Graduate';
  doc.setFillColor(20, 25, 55);
  doc.roundedRect(W/2 - 80, 60, 160, 22, 3, 3, 'F');
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.6);
  doc.roundedRect(W/2 - 80, 60, 160, 22, 3, 3, 'S');

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(displayName, W/2, 75, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('has successfully completed the 30-Day Onboarding Program for', W/2, 90, { align: 'center' });

  // Role
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(129, 140, 248);
  doc.text(curriculum.role || 'Professional Role', W/2, 104, { align: 'center' });

  // Stats row
  const stats = [
    { label: '30 Days', sub: 'Completed' },
    { label: `${curriculum.weeks?.reduce((a,w) => a + w.days.length, 0) || 20} Tasks`, sub: 'Accomplished' },
    { label: curriculum.focus || 'Full Stack', sub: 'Focus Area' },
  ];
  const statW = 50;
  const startX = W/2 - statW;
  stats.forEach((s, i) => {
    const sx = startX + i * statW;
    doc.setFillColor(13, 17, 40);
    doc.roundedRect(sx - 18, 112, 38, 22, 2, 2, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(129, 140, 248);
    doc.text(s.label, sx + 1, 122, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(s.sub.toUpperCase(), sx + 1, 129, { align: 'center' });
  });

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Issued on ${date}`, W/2, 148, { align: 'center' });

  // Bottom line
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  doc.line(40, 153, W-40, 153);

  doc.setFontSize(8);
  doc.setTextColor(99, 102, 241);
  doc.text('Powered by Google Gemini AI  ×  Copilot Onboard', W/2, 160, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.text('This certificate was generated automatically upon completion of all onboarding tasks.', W/2, 166, { align: 'center' });

  doc.save(`${(curriculum.role||'Onboarding').replace(/\s+/g,'_')}_Certificate.pdf`);
}

// ── Main Component ────────────────────────────────────────
export default function CompletionCelebration({ curriculum, onContinue, userName }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowCert(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useConfetti(canvasRef, visible);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,6,15,0.96)',
      backdropFilter: 'blur(16px)',
      flexDirection: 'column', gap: '24px', padding: '24px',
    }}>
      {/* Confetti Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: 'all 0.7s cubic-bezier(0.34,1.2,0.64,1)',
        position: 'relative', zIndex: 1, maxWidth: '560px', textAlign: 'center',
      }}>

        {/* Trophy Icon */}
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.3)',
          animation: 'orb-pulse 2s ease-in-out infinite',
        }}>
          <Award size={40} color="white" />
        </div>

        {/* Title */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fbbf24', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            🎉 ONBOARDING COMPLETE
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '8px' }}>
            {userName && userName !== 'New Employee' ? `Congratulations, ${userName}!` : 'You Did It!'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            You've successfully completed your <strong style={{ color: 'var(--text-primary)' }}>30-Day Onboarding</strong> for <strong style={{ color: '#818cf8' }}>{curriculum.role}</strong>. You're officially integrated and ready to make an impact!
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: CheckCircle2, label: 'All Tasks', value: `${curriculum.weeks?.reduce((a,w) => a + w.days.length, 0) || 20} Done`, color: '#10b981' },
            { icon: Star, label: '30 Days', value: 'Completed', color: '#fbbf24' },
            { icon: Sparkles, label: 'AI Powered', value: 'Gemini Pro', color: '#818cf8' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ padding: '12px 20px', borderRadius: '12px', background: `${color}12`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={16} color={color} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Card */}
        <div style={{
          width: '100%', padding: '20px 24px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
          border: '1px solid rgba(99,102,241,0.3)',
          opacity: showCert ? 1 : 0, transform: showCert ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Your completion certificate is ready to download
          </div>
          <button
            onClick={() => downloadCertificate(curriculum, userName)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: 'none', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', boxShadow: '0 0 20px rgba(245,158,11,0.4)', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Download size={16} />
            Download Completion Certificate
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          style={{ padding: '10px 28px', borderRadius: '999px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
