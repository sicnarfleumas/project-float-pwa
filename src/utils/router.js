/* =========================================================
   ROUTER — Simple hash-based SPA router
   ========================================================= */

import { store } from '../state/store.js';

const routes = {};
let currentRoute = null;
let currentCleanup = null;

/**
 * Register a route.
 * @param {string} path - e.g. '/', '/train', '/program', '/settings', '/onboarding'
 * @param {Function} handler - (container: HTMLElement, params: object) => cleanup?
 */
export function route(path, handler) {
  routes[path] = handler;
}

/** Navigate to a route */
export function navigate(path) {
  if (path !== window.location.hash.slice(1)) {
    window.location.hash = path;
  } else {
    // Same route, re-render
    render(path);
  }
}

/** Get current route path */
export function currentPath() {
  return window.location.hash.slice(1) || '/';
}

/** Render the current route */
function render(path) {
  // Guard: if not onboarded, redirect to onboarding
  const state = store.get();
  if (!state.onboarded && path !== '/onboarding') {
    navigate('/onboarding');
    return;
  }

  // If onboarded but trying to access onboarding, redirect to home
  if (state.onboarded && path === '/onboarding') {
    navigate('/');
    return;
  }

  const handler = routes[path] || routes['/'];
  if (!handler) return;

  // Cleanup previous route
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
  }

  currentRoute = path;
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Show/hide nav
  if (path === '/onboarding') {
    document.body.classList.add('no-nav');
  } else {
    document.body.classList.remove('no-nav');
  }

  const container = document.createElement('div');
  container.className = 'screen';
  app.appendChild(container);

  // Execute handler
  currentCleanup = handler(container);
}

/** Initialize the router */
export function initRouter() {
  window.addEventListener('hashchange', () => {
    const path = currentPath();
    render(path);
  });

  // Initial render
  const path = currentPath();
  render(path);
}
