/* =========================================================
   DASHBOARD SCREEN — Athlete's home command center
   ========================================================= */

import { store } from '../state/store.js';
import { MESOS, weekLabel } from '../data/program.js';
import { getCurrentTrainingDay, DAY_LABELS, programCompletion, timeAgo } from '../utils/helpers.js';
import { progressRing } from '../components/progress-ring.js';
import { navigate } from '../utils/router.js';

export function renderDashboard(container) {
  container.classList.add('dash');
  const state = store.get();
  const athlete = state.athlete;
  const pos = getCurrentTrainingDay(athlete.startDate);

  // --- Header ---
  const mesoData = pos ? MESOS[pos.mesoIdx] : MESOS[0];
  const wkLabel = pos ? weekLabel(pos.mesoIdx, pos.weekIdx) : { label: 'Wk 1', isDeload: false };

  container.innerHTML = `
    <div class="dash-header">
      <div class="dash-header__top">
        <div>
          <div class="dash-header__name">${athlete.name || 'Athlete'}</div>
          <div class="dash-header__week">${wkLabel.label}${wkLabel.isDeload ? ' · DELOAD' : ''}</div>
        </div>
        <div style="text-align:right">
          <div class="dash-header__phase">${mesoData.title}</div>
          <div style="margin-top:6px">
            ${mesoData.pills.slice(0, 2).map(p => `<span class="pill" style="border-color:var(--gold);color:var(--gold);font-size:8px">${p}</span>`).join(' ')}
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Stats row ---
  const comp = programCompletion(state.completedDays);
  const vertDelta = athlete.currentVert && athlete.startVert
    ? (parseFloat(athlete.currentVert) - parseFloat(athlete.startVert))
    : null;

  const statsHTML = `
    <div class="dash-stats stagger">
      <div class="dash-stat anim-fade">
        <div class="dash-stat__value">${athlete.startVert || '—'}</div>
        <div class="dash-stat__label">Start Vert (cm)</div>
      </div>
      <div class="dash-stat anim-fade">
        <div class="dash-stat__value">${athlete.currentVert || '—'}</div>
        <div class="dash-stat__label">Current Vert</div>
        ${vertDelta !== null ? `<div class="dash-stat__delta ${vertDelta >= 0 ? 'dash-stat__delta--up' : 'dash-stat__delta--down'}">${vertDelta >= 0 ? '+' : ''}${vertDelta} cm</div>` : ''}
      </div>
      <div class="dash-stat anim-fade">
        <div class="dash-stat__value">${athlete.squat1rm || '—'}</div>
        <div class="dash-stat__label">Squat 1RM</div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', statsHTML);

  // --- Today's workout card ---
  if (pos && !pos.completed) {
    const day = mesoData.days[pos.dayIdx];
    const isDone = store.isDayCompleted(pos.mesoIdx, pos.weekIdx, pos.dayIdx);

    const exerciseList = day.ex
      .filter(ex => ex[0] !== '—')
      .slice(0, 5)
      .map(ex => `
        <li>
          <span>${ex[0]}</span>
          <span class="prescr">${ex[2]}</span>
        </li>
      `).join('');

    const todayHTML = `
      <div class="dash-today anim-slide">
        <div class="dash-today__header">
          <div>
            <div class="dash-today__tag">${pos.isRestDay ? 'REST DAY' : day.tag}</div>
            <div class="dash-today__title">${pos.isRestDay ? 'Recovery Day' : day.name}</div>
          </div>
          ${isDone ? '<span class="badge badge--deload">✓ DONE</span>' : ''}
        </div>
        <div class="dash-today__body">
          ${pos.isRestDay ? '<p style="color:var(--muted);font-family:Space Mono,monospace;font-size:12px">Rest and recover. Back at it Monday.</p>' : `
            <ul class="dash-today__exercises">${exerciseList}</ul>
            <button class="btn btn--primary btn--full" id="dash-start-workout">
              ${isDone ? 'Review Workout' : 'Start Workout →'}
            </button>
          `}
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', todayHTML);

    const startBtn = container.querySelector('#dash-start-workout');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        navigate(`/train`);
      });
    }
  }

  // --- Week strip ---
  if (pos) {
    let weekDaysHTML = '';
    for (let d = 0; d < 5; d++) {
      const isDone = store.isDayCompleted(pos.mesoIdx, pos.weekIdx, d);
      const isCurrent = d === pos.dayIdx && !pos.isRestDay;
      let cls = 'dash-day-dot';
      if (isDone) cls += ' dash-day-dot--done';
      else if (isCurrent) cls += ' dash-day-dot--current';

      weekDaysHTML += `
        <div class="${cls}" data-day="${d}">
          <div class="dash-day-dot__label">${DAY_LABELS[d]}</div>
          <div class="dash-day-dot__num">${isDone ? '✓' : d + 1}</div>
        </div>
      `;
    }

    container.insertAdjacentHTML('beforeend', `
      <div class="dash-week anim-fade" style="animation-delay:0.1s">
        <div class="dash-week__title">This Week</div>
        <div class="dash-week__days">${weekDaysHTML}</div>
      </div>
    `);

    // Click to navigate to specific day
    container.querySelectorAll('.dash-day-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const dayIdx = parseInt(dot.dataset.day);
        navigate(`/train`);
        // Store target day for workout screen to pick up
        sessionStorage.setItem('targetDay', JSON.stringify({
          mesoIdx: pos.mesoIdx,
          weekIdx: pos.weekIdx,
          dayIdx: dayIdx,
        }));
      });
    });
  }

  // --- Progress section ---
  const progressHTML = `
    <div class="dash-progress anim-fade" style="animation-delay:0.15s">
      <div id="dash-ring"></div>
      <div class="dash-progress__text">
        <div class="dash-progress__title">Program Progress</div>
        <div class="dash-progress__detail">${comp.done} of ${comp.total} training days completed</div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', progressHTML);

  const ringContainer = container.querySelector('#dash-ring');
  if (ringContainer) {
    ringContainer.appendChild(progressRing(comp.pct, 56, 'var(--accent)'));
  }

  // --- Recent activity ---
  const recentDays = Object.entries(state.completedDays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (recentDays.length > 0) {
    let recentHTML = '<div class="dash-recent__title">Recent Activity</div>';
    recentDays.forEach(([key, ts]) => {
      const [mi, wi, di] = key.split('.').map(Number);
      const meso = MESOS[mi];
      if (!meso) return;
      const day = meso.days[di];
      if (!day) return;
      recentHTML += `
        <div class="dash-recent-item anim-fade">
          <div>
            <div class="dash-recent-item__name">${day.name}</div>
            <div class="dash-recent-item__meta">${meso.title} · ${weekLabel(mi, wi).label}</div>
          </div>
          <div class="dash-recent-item__meta">${timeAgo(ts)}</div>
        </div>
      `;
    });
    container.insertAdjacentHTML('beforeend', `<div style="animation-delay:0.2s" class="anim-fade">${recentHTML}</div>`);
  }
}
