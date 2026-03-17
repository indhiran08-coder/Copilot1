// ============================================================
// exportPDF.js — Premium Branded PDF Export (No Emoji)
// ============================================================
import jsPDF from 'jspdf';

const WEEK_COLORS = ['#818cf8', '#22d3ee', '#c084fc', '#fbbf24'];

const TYPE_COLORS = {
  Setup:         '#818cf8',
  Learning:      '#22d3ee',
  Practice:      '#f59e0b',
  Build:         '#10b981',
  Compliance:    '#ef4444',
  Certification: '#f59e0b',
  Shadow:        '#a855f7',
  Analysis:      '#06b6d4',
  Collaboration: '#22d3ee',
  Leadership:    '#f59e0b',
  Research:      '#818cf8',
  Milestone:     '#fbbf24',
  Growth:        '#10b981',
  Business:      '#06b6d4',
  Improvement:   '#a855f7',
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

export async function exportCurriculumToPDF(curriculum) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Helpers ────────────────────────────────────────────
  function rgb(hex) { return hexToRgb(hex); }

  function fill(hex) {
    const [r, g, b] = rgb(hex);
    doc.setFillColor(r, g, b);
  }

  function textColor(hex) {
    const [r, g, b] = rgb(hex);
    doc.setTextColor(r, g, b);
  }

  function drawColor(hex) {
    const [r, g, b] = rgb(hex);
    doc.setDrawColor(r, g, b);
  }

  function checkPage(needed) {
    if (y + needed > pageH - 18) {
      doc.addPage();
      drawBackground();
      drawFooter();
      y = 22;
    }
  }

  function drawBackground() {
    fill('#05060f');
    doc.rect(0, 0, pageW, pageH, 'F');
    // Subtle grid lines
    doc.setLineWidth(0.05);
    drawColor('#1a1f3a');
    for (let gx = 0; gx < pageW; gx += 10) {
      doc.line(gx, 0, gx, pageH);
    }
    for (let gy = 0; gy < pageH; gy += 10) {
      doc.line(0, gy, pageW, gy);
    }
  }

  function drawFooter() {
    const pg = doc.internal.getNumberOfPages();
    doc.setLineWidth(0.2);
    drawColor('#1e293b');
    doc.line(margin, pageH - 10, pageW - margin, pageH - 10);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    textColor('#475569');
    doc.text(`Copilot Onboard  |  ${curriculum.role}  |  30-Day AI Roadmap`, margin, pageH - 6);
    doc.text(`${pg}`, pageW - margin, pageH - 6, { align: 'right' });
  }

  function roundRect(x, y, w, h, r, color) {
    fill(color);
    doc.roundedRect(x, y, w, h, r, r, 'F');
  }

  function label(text, x, y, size, color, style = 'normal', align = 'left') {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    textColor(color);
    doc.text(String(text), x, y, { align });
  }

  function typeIcon(type, x, y, size = 8) {
    const color = TYPE_COLORS[type] || '#818cf8';
    const [r, g, b] = rgb(color);
    // Draw colored square icon
    doc.setFillColor(r, g, b, 0.2);
    fill(blendDark(color));
    doc.roundedRect(x, y - size * 0.7, size, size, 1.5, 1.5, 'F');
    // Draw colored border
    doc.setLineWidth(0.4);
    doc.setDrawColor(r, g, b);
    doc.roundedRect(x, y - size * 0.7, size, size, 1.5, 1.5, 'S');
    // First letter of type
    doc.setFontSize(size * 0.6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text(type.charAt(0), x + size / 2, y - size * 0.7 + size * 0.65, { align: 'center' });
  }

  function blendDark(hex) {
    const [r, g, b] = rgb(hex);
    return `#${Math.floor(r * 0.15 + 10).toString(16).padStart(2, '0')}${Math.floor(g * 0.15 + 10).toString(16).padStart(2, '0')}${Math.floor(b * 0.15 + 13).toString(16).padStart(2, '0')}`;
  }

  function accentBar(x, y, h, color) {
    fill(color);
    doc.roundedRect(x, y, 2.5, h, 1, 1, 'F');
  }

  // ── COVER PAGE ─────────────────────────────────────────
  drawBackground();
  drawFooter();

  // Top gradient bar
  fill('#6366f1');
  doc.rect(0, 0, pageW * 0.6, 4, 'F');
  fill('#a855f7');
  doc.rect(pageW * 0.6, 0, pageW * 0.4, 4, 'F');

  // Logo pill
  y = 32;
  roundRect(margin, y, 46, 11, 2, '#0f1229');
  doc.setLineWidth(0.3);
  drawColor('#6366f1');
  doc.roundedRect(margin, y, 46, 11, 2, 2, 'S');
  fill('#6366f1');
  doc.roundedRect(margin + 2, y + 2, 7, 7, 1.5, 1.5, 'F');
  label('C', margin + 5.5, y + 7.2, 6, '#ffffff', 'bold');
  label('COPILOT ONBOARD', margin + 12, y + 7.5, 7, '#818cf8', 'bold');

  // Generated badge (top right)
  const genDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  roundRect(pageW - margin - 44, y, 44, 11, 2, '#0f1229');
  label(`AI Generated  ${genDate}`, pageW - margin - 42, y + 7.2, 6, '#475569');

  // Main Title Area
  y = 62;
  label('30-DAY ONBOARDING ROADMAP', margin, y, 8, '#6366f1', 'bold');

  y += 9;
  const roleLines = doc.setFont('helvetica', 'bold') && doc.splitTextToSize(curriculum.role, contentW - 10);
  doc.setFontSize(26);
  textColor('#e2e8f0');
  doc.text(roleLines, margin, y);
  y += roleLines.length * 11 + 4;

  // Accent line
  fill('#6366f1');
  doc.rect(margin, y, 50, 2, 'F');
  fill('#a855f7');
  doc.rect(margin + 50, y, 25, 2, 'F');
  y += 10;

  // Profile cards row
  const profileItems = [
    { label: 'EXPERIENCE', value: curriculum.experience || 'All Levels', color: '#818cf8' },
    { label: 'FOCUS AREA', value: curriculum.focus || 'General', color: '#22d3ee' },
    { label: 'PRIMARY GOAL', value: curriculum.goal || 'Excellence', color: '#a855f7' },
  ];
  const cardW = (contentW - 6) / 3;
  profileItems.forEach((item, i) => {
    const cx = margin + i * (cardW + 3);
    roundRect(cx, y, cardW, 22, 2.5, '#0d1128');
    doc.setLineWidth(0.3);
    doc.setDrawColor(...rgb(item.color));
    doc.roundedRect(cx, y, cardW, 22, 2.5, 2.5, 'S');
    fill(item.color);
    doc.rect(cx, y, cardW, 1.5, 'F');

    label(item.label, cx + 5, y + 8, 6, item.color, 'bold');
    const valLines = doc.setFont('helvetica', 'normal') && doc.splitTextToSize(item.value, cardW - 10);
    doc.setFontSize(8.5);
    textColor('#c7d2fe');
    doc.text(valLines[0] || item.value, cx + 5, y + 16);
  });
  y += 30;

  // Stats row
  const stats = [
    { n: '30',  l: 'DAYS',  c: '#818cf8' },
    { n: String(curriculum.totalTasks || 20), l: 'TASKS', c: '#22d3ee' },
    { n: '4',   l: 'WEEKS', c: '#a855f7' },
    { n: '100+',l: 'HOURS', c: '#fbbf24' },
  ];
  const sW = (contentW - 9) / 4;
  stats.forEach((s, i) => {
    const sx = margin + i * (sW + 3);
    roundRect(sx, y, sW, 26, 2.5, '#0d1128');
    doc.setLineWidth(0.3);
    doc.setDrawColor(...rgb(s.c));
    doc.roundedRect(sx, y, sW, 26, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...rgb(s.c));
    label(s.n, sx + sW / 2, y + 14, 18, s.c, 'bold', 'center');

    label(s.l, sx + sW / 2, y + 21, 6, '#64748b', 'bold', 'center');
  });
  y += 34;

  // Week overview strips
  label('CURRICULUM OVERVIEW', margin, y, 7.5, '#475569', 'bold');
  y += 7;
  curriculum.weeks?.forEach((week, wi) => {
    const wc = WEEK_COLORS[wi] || '#818cf8';
    roundRect(margin, y, contentW, 14, 2, '#0d1128');
    accentBar(margin, y, 14, wc);
    label(`WK ${week.week}`, margin + 6, y + 9, 7, wc, 'bold');
    label(week.title || `Week ${week.week}`, margin + 20, y + 9, 8.5, '#c7d2fe', 'bold');
    const taskCount = `${week.days?.length || 0} tasks`;
    label(taskCount, pageW - margin - 2, y + 9, 7, wc, 'bold', 'right');
    doc.text(taskCount, pageW - margin - 2, y + 9, { align: 'right' });

    const themeText = doc.splitTextToSize(week.theme || '', contentW - 80);
    label(themeText[0] || '', margin + 80, y + 9, 7, '#64748b');
    y += 17;
  });

  // Bottom CTA box
  y += 6;
  roundRect(margin, y, contentW, 20, 3, '#0f172a');
  doc.setLineWidth(0.4);
  drawColor('#6366f1');
  doc.roundedRect(margin, y, contentW, 20, 3, 3, 'S');
  label('Your personalized AI-generated onboarding roadmap.', margin + contentW / 2, y + 9, 7.5, '#94a3b8', 'normal', 'center');
  label('Powered by Google Gemini AI  x  Copilot Onboard', margin + contentW / 2, y + 16, 7, '#6366f1', 'bold', 'center');

  // ── WEEK PAGES ─────────────────────────────────────────
  curriculum.weeks?.forEach((week, weekIdx) => {
    doc.addPage();
    drawBackground();
    y = 0;

    const wColor = WEEK_COLORS[weekIdx] || '#818cf8';

    // Top bar
    fill(wColor);
    doc.rect(0, 0, pageW, 3, 'F');

    drawFooter();
    y = 14;

    // Week header card
    roundRect(margin, y, contentW, 28, 3, '#0d1128');
    doc.setLineWidth(0.4);
    doc.setDrawColor(...rgb(wColor));
    doc.roundedRect(margin, y, contentW, 28, 3, 3, 'S');
    fill(wColor);
    doc.rect(margin, y, contentW, 2.5, 'F');

    // Week badge
    fill(blendDark(wColor));
    doc.roundedRect(margin + 6, y + 8, 20, 8, 1.5, 1.5, 'F');
    doc.setLineWidth(0.3);
    doc.setDrawColor(...rgb(wColor));
    doc.roundedRect(margin + 6, y + 8, 20, 8, 1.5, 1.5, 'S');
    label(`WEEK ${week.week}`, margin + 16, y + 13.5, 6.5, wColor, 'bold', 'center');

    // Week title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...rgb('#e2e8f0'));
    doc.text(week.title || '', margin + 32, y + 14);

    // Theme
    const themeLines = doc.splitTextToSize(week.theme || '', contentW - 36);
    label(themeLines[0] || '', margin + 32, y + 22, 7.5, '#64748b');

    y += 36;

    // Day cards
    week.days?.forEach((day) => {
      checkPage(40);

      const typeColor = TYPE_COLORS[day.type] || wColor;

      // Card
      roundRect(margin, y, contentW, 34, 2.5, '#0d1128');
      accentBar(margin, y, 34, wColor);

      // Day number
      label(`DAY ${day.day}`, margin + 6, y + 7, 6.5, wColor, 'bold');

      // Type badge
      const tbW = Math.min((day.type || 'Task').length * 1.8 + 8, 28);
      roundRect(pageW - margin - tbW - 2, y + 4, tbW, 7, 1.5, blendDark(typeColor));
      doc.setLineWidth(0.3);
      doc.setDrawColor(...rgb(typeColor));
      doc.roundedRect(pageW - margin - tbW - 2, y + 4, tbW, 7, 1.5, 1.5, 'S');
      label((day.type || '').toUpperCase(), pageW - margin - tbW / 2 - 2, y + 9, 5.5, typeColor, 'bold', 'center');

      // Type icon square
      typeIcon(day.type || 'Learning', margin + 6, y + 21, 9);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...rgb('#e2e8f0'));
      const titleLines = doc.splitTextToSize(day.title || '', contentW - 32);
      doc.text(titleLines[0], margin + 18, y + 18);

      // Description
      const descLines = doc.splitTextToSize(day.desc || '', contentW - 18);
      label(descLines.slice(0, 2).join(' '), margin + 6, y + 25, 7.5, '#94a3b8');
      doc.text(descLines.slice(0, 2).join(' '), margin + 6, y + 25);

      // Duration
      label(`Duration: ${day.duration || '4h'}`, margin + 6, y + 31, 6.5, wColor, 'bold');

      // Tags
      let tagX = margin + 35;
      (day.tags || []).slice(0, 3).forEach(tag => {
        const tw = tag.length * 2.2 + 6;
        roundRect(tagX, y + 27, tw, 5.5, 1, '#1e293b');
        label(tag, tagX + tw / 2, y + 31.2, 5.5, '#64748b', 'normal', 'center');
        tagX += tw + 3;
      });

      y += 38;
    });
  });

  // ── FINAL SUMMARY PAGE ────────────────────────────────
  doc.addPage();
  drawBackground();
  drawFooter();

  // Top gradient bar
  fill('#6366f1');
  doc.rect(0, 0, pageW / 2, 3, 'F');
  fill('#a855f7');
  doc.rect(pageW / 2, 0, pageW / 2, 3, 'F');

  y = 22;
  label('COMPLETE TASK SUMMARY', margin, y, 8, '#6366f1', 'bold');
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  textColor('#e2e8f0');
  doc.text('All 30 Days at a Glance', margin, y);
  y += 6;

  doc.setLineWidth(0.3);
  drawColor('#1e293b');
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // All tasks compact list
  curriculum.weeks?.forEach((week, wi) => {
    checkPage(14);
    const wc = WEEK_COLORS[wi] || '#818cf8';

    // Week row
    roundRect(margin, y, contentW, 10, 1.5, '#0d1128');
    fill(wc);
    doc.rect(margin, y, contentW, 1.5, 'F');
    label(`WEEK ${week.week}  —  ${week.title || ''}`, margin + 5, y + 7.5, 7.5, '#c7d2fe', 'bold');
    label(`${week.days?.length || 0} tasks`, pageW - margin - 3, y + 7.5, 6.5, wc, 'bold');
    y += 13;

    week.days?.forEach((day) => {
      checkPage(9);
      const tc = TYPE_COLORS[day.type] || wc;

      // Compact day row
      fill('#080b1a');
      doc.roundedRect(margin + 3, y, contentW - 3, 8, 1, 1, 'F');
      accentBar(margin + 3, y, 8, wc);

      // Checkbox circle
      doc.setLineWidth(0.3);
      doc.setDrawColor(...rgb(wc));
      doc.circle(margin + 9, y + 4, 2, 'S');

      label(`Day ${day.day}`, margin + 13, y + 5.5, 6.5, tc, 'bold');

      const titleClip = doc.splitTextToSize(day.title || '', 80);
      label(titleClip[0], margin + 28, y + 5.5, 7.5, '#c7d2fe');

      label(day.duration || '4h', pageW - margin - 3, y + 5.5, 6, '#64748b', 'normal', 'right');

      y += 10;
    });
    y += 4;
  });

  // Motivational close box
  checkPage(30);
  y += 6;
  roundRect(margin, y, contentW, 28, 3, '#0d1128');
  doc.setLineWidth(0.5);
  drawColor('#6366f1');
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'S');

  fill('#6366f1');
  doc.rect(margin, y, contentW, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  textColor('#ffffff');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  textColor('#94a3b8');

  // ── Save ───────────────────────────────────────────────
  const filename = `${(curriculum.role || 'Onboarding').replace(/\s+/g, '_')}_30Day_Roadmap.pdf`;
  doc.save(filename);
}
