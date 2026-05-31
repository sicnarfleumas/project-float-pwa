/* =========================================================
   HELPERS — Date, progress, and calculation utilities
   ========================================================= */

import { MESOS } from '../data/program.js';

/**
 * Get the current training position based on start date.
 * Returns { mesoIdx, weekIdx, dayIdx, globalWeek, globalDay, isRestDay }
 */
export function getCurrentTrainingDay(startDateStr) {
  if (!startDateStr) return null;

  const start = new Date(startDateStr);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffMs = now - start;
  if (diffMs < 0) return { mesoIdx: 0, weekIdx: 0, dayIdx: 0, globalWeek: 1, globalDay: 0, isRestDay: false };

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(totalDays / 7); // 0-based week
  const dayOfWeek = totalDays % 7; // 0=Mon, 1=Tue, ..., 6=Sun

  // Program is 24 weeks (0-23)
  if (weekNum >= 24) {
    return { mesoIdx: 5, weekIdx: 3, dayIdx: 4, globalWeek: 24, globalDay: totalDays, isRestDay: false, completed: true };
  }

  const mesoIdx = Math.floor(weekNum / 4);
  const weekIdx = weekNum % 4;

  // Training days: Mon-Fri (dayOfWeek 0-4), rest: Sat-Sun (5-6)
  const isRestDay = dayOfWeek >= 5;
  const dayIdx = isRestDay ? Math.min(dayOfWeek, 4) : dayOfWeek;

  return {
    mesoIdx,
    weekIdx,
    dayIdx: Math.min(dayIdx, 4),
    globalWeek: weekNum + 1,
    globalDay: totalDays,
    isRestDay,
    completed: false
  };
}

/** Format a date string nicely */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Format a date to short format */
export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format relative time */
export function timeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDateShort(new Date(timestamp).toISOString());
}

/** Get the next Monday from today */
export function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/** Calculate overall program completion percentage */
export function programCompletion(completedDays) {
  const total = 120; // 24 weeks × 5 days
  const done = Object.keys(completedDays || {}).length;
  return {
    done,
    total,
    pct: Math.round((done / total) * 100)
  };
}

/** Get day name labels */
export const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

/** Get meso phase name with number */
export function mesoLabel(mesoIdx) {
  const m = MESOS[mesoIdx];
  return m ? `Meso ${m.n} — ${m.title}` : '';
}

/** Check if an exercise row is a placeholder (—) */
export function isPlaceholder(ex) {
  return ex[0] === '—';
}

/** Check if an exercise has the shoulder-safe flag */
export function hasShoulderFlag(ex) {
  return ex[1] && ex[1].includes('SHLD');
}

/** Get clean cue text (without SHLD prefix) */
export function cleanCue(ex) {
  if (!ex[1]) return '';
  return ex[1].replace('SHLD · ', '').replace('SHLD', '').trim();
}

/** Calculate absolute weights from percentages based on 1RM */
export function calculateWeights(text, squat1rm) {
  if (!squat1rm || typeof text !== 'string') return text;
  const rm = parseFloat(squat1rm);
  if (isNaN(rm) || rm <= 0) return text;

  // Replace @XX% -> @XXkg
  let out = text.replace(/@(\d{2,3})%/g, (match, pct) => {
    return `@${Math.round(rm * (parseInt(pct, 10) / 100))}kg`;
  });

  // Replace XX–YY% -> XX–YYkg (handles dashes and hyphens)
  out = out.replace(/(\d{2,3})[–-](\d{2,3})%/g, (match, p1, p2) => {
    const w1 = Math.round(rm * (parseInt(p1, 10) / 100));
    const w2 = Math.round(rm * (parseInt(p2, 10) / 100));
    return `${w1}–${w2}kg`;
  });

  return out;
}

/** Create an HTML element with classes and attributes */
export function el(tag, className, attrs = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'text') element.textContent = v;
    else if (k === 'html') element.innerHTML = v;
    else element.setAttribute(k, v);
  });
  return element;
}
