/* =========================================================
   MAIN — Entry point for Project: Float
   ========================================================= */

// --- Styles ---
import './styles/index.css';
import './styles/onboarding.css';
import './styles/dashboard.css';
import './styles/workout.css';
import './styles/program.css';
import './styles/nav.css';

// --- State ---
import { store } from './state/store.js';

// --- Router ---
import { route, initRouter, navigate } from './utils/router.js';

// --- Screens ---
import { renderOnboarding } from './screens/onboarding.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderWorkout } from './screens/workout.js';
import { renderProgram } from './screens/program.js';
import { renderSettings } from './screens/settings.js';

// --- Components ---
import { renderNav, destroyNav } from './components/nav.js';

// --- Initialize ---
store.init();

// --- Register routes ---
route('/onboarding', (container) => {
  destroyNav();
  renderOnboarding(container);
});

route('/', (container) => {
  renderNav();
  renderDashboard(container);
});

route('/train', (container) => {
  renderNav();
  renderWorkout(container);
});

route('/program', (container) => {
  renderNav();
  renderProgram(container);
});

route('/settings', (container) => {
  renderNav();
  renderSettings(container);
});

// --- Start ---
initRouter();

// --- Register service worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works
    });
  });
}
