/* =========================================================
   TOAST — Notification component
   ========================================================= */

let container = null;

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms
 */
export function toast(message, type = 'info', duration = 3000) {
  ensureContainer();

  const t = document.createElement('div');
  t.style.cssText = `
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.5px;
    padding: 12px 16px;
    border: 3px solid var(--ink);
    box-shadow: 3px 3px 0 var(--ink);
    pointer-events: auto;
    animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const colors = {
    success: { bg: 'var(--accent2)', color: '#fff', icon: '✓' },
    error:   { bg: 'var(--accent)', color: '#fff', icon: '✕' },
    info:    { bg: 'var(--gold)', color: 'var(--ink)', icon: '●' },
  };

  const c = colors[type] || colors.info;
  t.style.background = c.bg;
  t.style.color = c.color;
  t.innerHTML = `<span style="font-weight:700;font-size:14px">${c.icon}</span> ${message}`;

  container.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-8px)';
    t.style.transition = 'all 0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, duration);
}
