/* =========================================================
   BOTTOM NAV — Tab navigation component
   ========================================================= */

import { currentPath, navigate } from '../utils/router.js';

const TABS = [
  { path: '/',         icon: '⌂', label: 'Home' },
  { path: '/train',    icon: '🏋', label: 'Train' },
  { path: '/program',  icon: '☰', label: 'Program' },
  { path: '/settings', icon: '⚙', label: 'Settings' },
];

let navEl = null;

export function renderNav() {
  if (navEl) navEl.remove();

  navEl = document.createElement('nav');
  navEl.className = 'bottom-nav';
  navEl.setAttribute('id', 'bottom-nav');

  const inner = document.createElement('div');
  inner.className = 'bottom-nav__inner';

  const current = currentPath();

  TABS.forEach(tab => {
    const btn = document.createElement('button');
    const isActive = current === tab.path || (tab.path === '/train' && current.startsWith('/train'));
    btn.className = `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`;
    btn.innerHTML = `
      <span class="bottom-nav__icon">${tab.icon}</span>
      <span class="bottom-nav__label">${tab.label}</span>
    `;
    btn.addEventListener('click', () => navigate(tab.path));
    inner.appendChild(btn);
  });

  navEl.appendChild(inner);
  document.body.appendChild(navEl);
}

export function destroyNav() {
  if (navEl) {
    navEl.remove();
    navEl = null;
  }
}
