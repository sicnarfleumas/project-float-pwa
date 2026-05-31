/* =========================================================
   PROGRAM BROWSER SCREEN — Full macrocycle overview
   ========================================================= */

import { MESOS, weekLabel, isDeloadWeek, computeDeloadRx } from '../data/program.js';
import { store } from '../state/store.js';
import { hasShoulderFlag, cleanCue, calculateWeights } from '../utils/helpers.js';

export function renderProgram(container) {
  container.classList.add('pgm');
  let curMeso = 0;
  let openWeek = -1;

  function render() {
    const meso = MESOS[curMeso];
    container.innerHTML = '';

    // --- Header ---
    container.innerHTML = `
      <div class="pgm-header">
        <h2>Program Overview</h2>
        <div class="pgm-header__sub">1 Macro · 6 Mesocycles · 24 Weeks · 120 Sessions</div>
      </div>
    `;

    // --- Meso scroll strip ---
    let mesoStripHTML = '<div class="pgm-mesos">';
    MESOS.forEach((m, i) => {
      mesoStripHTML += `
        <button class="pgm-meso-btn ${i === curMeso ? 'pgm-meso-btn--active' : ''}" data-meso="${i}">
          <span class="pgm-meso-btn__num">MESO ${m.big}</span>
          <span class="pgm-meso-btn__title">${m.title}</span>
          <span class="pgm-meso-btn__weeks">${m.weeks}</span>
        </button>
      `;
    });
    mesoStripHTML += '</div>';
    container.insertAdjacentHTML('beforeend', mesoStripHTML);

    // Wire meso buttons
    container.querySelectorAll('.pgm-meso-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        curMeso = parseInt(btn.dataset.meso);
        openWeek = -1;
        render();

        // Scroll active button into view
        setTimeout(() => {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 50);
      });
    });

    // --- Meso detail card ---
    container.insertAdjacentHTML('beforeend', `
      <div class="pgm-detail" data-big="${meso.big}">
        <div class="pgm-detail__title">Mesocycle ${meso.n} — ${meso.title}</div>
        <div class="pgm-detail__weeks">${meso.weeks} · 3 build weeks + 1 deload</div>
        <p class="pgm-detail__desc">${meso.desc}</p>
        <div class="pgm-detail__pills">
          ${meso.pills.map(p => `<span class="pill">${p}</span>`).join('')}
        </div>
      </div>
    `);

    // --- Week accordions ---
    const weeksContainer = document.createElement('div');
    weeksContainer.className = 'pgm-weeks';

    for (let w = 0; w < 4; w++) {
      const wk = weekLabel(curMeso, w);
      const deload = isDeloadWeek(w);
      const isOpen = openWeek === w;

      // Check completion
      let completedCount = 0;
      for (let d = 0; d < 5; d++) {
        if (store.isDayCompleted(curMeso, w, d)) completedCount++;
      }

      const weekEl = document.createElement('div');
      weekEl.className = `pgm-week ${deload ? 'pgm-week--deload' : ''} ${isOpen ? 'pgm-week--open' : ''}`;

      let weekBodyHTML = '';
      meso.days.forEach((day, di) => {
        const exercises = day.ex.map(ex => {
          if (ex[0] === '—') return '';
          const shld = hasShoulderFlag(ex) ? ' <span class="badge badge--shld">SHLD</span>' : '';
          let rx = ex[2];
          
          const state = store.get();
          if (state.athlete.squat1rm) {
            rx = calculateWeights(rx, state.athlete.squat1rm);
          }
          
          if (deload) rx = computeDeloadRx(rx);
          return `
            <li class="pgm-day__ex">
              <span class="pgm-day__ex-name">${ex[0]}${shld}</span>
              <span class="pgm-day__ex-rx">${rx}</span>
            </li>
          `;
        }).join('');

        weekBodyHTML += `
          <div class="pgm-day">
            <div class="pgm-day__head">
              <span class="pgm-day__name">${day.name}</span>
              <span class="pgm-day__tag">${day.tag}</span>
            </div>
            <div class="pgm-day__note">${day.note}${deload ? ' — DELOAD' : ''}</div>
            <ul class="pgm-day__exercises">${exercises}</ul>
          </div>
        `;
      });

      weekEl.innerHTML = `
        <div class="pgm-week__header" data-week="${w}">
          <span class="pgm-week__label">
            ${wk.label}
            ${completedCount > 0 ? `<span style="font-family:'Space Mono',monospace;font-size:10px;color:var(--accent2);margin-left:8px">${completedCount}/5 done</span>` : ''}
          </span>
          <span class="pgm-week__arrow">▶</span>
        </div>
        <div class="pgm-week__body">${weekBodyHTML}</div>
      `;

      weeksContainer.appendChild(weekEl);
    }

    container.appendChild(weeksContainer);

    // Wire week accordion
    container.querySelectorAll('.pgm-week__header').forEach(header => {
      header.addEventListener('click', () => {
        const w = parseInt(header.dataset.week);
        openWeek = openWeek === w ? -1 : w;
        // Toggle open class
        container.querySelectorAll('.pgm-week').forEach((wEl, wi) => {
          wEl.classList.toggle('pgm-week--open', wi === openWeek);
        });
      });
    });

    // Scroll active meso into view
    const activeBtn = container.querySelector('.pgm-meso-btn--active');
    if (activeBtn) {
      setTimeout(() => {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }

  render();
}
