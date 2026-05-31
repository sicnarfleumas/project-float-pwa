/* =========================================================
   WORKOUT SCREEN — Core training UI with warm-up flow
   ========================================================= */

import { store } from '../state/store.js';
import { MESOS, weekLabel, isDeloadWeek, computeDeloadRx } from '../data/program.js';
import { BASE_WARMUP, getFinisherForDay, WARMUP_RULES } from '../data/warmup.js';
import { getCurrentTrainingDay, isPlaceholder, hasShoulderFlag, cleanCue, calculateWeights } from '../utils/helpers.js';
import { toast } from '../components/toast.js';
import { navigate } from '../utils/router.js';

export function renderWorkout(container) {
  container.classList.add('workout');
  const state = store.get();
  const pos = getCurrentTrainingDay(state.athlete.startDate);

  // Check if we have a target day from sessionStorage (from dashboard click)
  let mesoIdx, weekIdx, dayIdx;
  const target = sessionStorage.getItem('targetDay');
  if (target) {
    const t = JSON.parse(target);
    mesoIdx = t.mesoIdx;
    weekIdx = t.weekIdx;
    dayIdx = t.dayIdx;
    sessionStorage.removeItem('targetDay');
  } else if (pos) {
    mesoIdx = pos.mesoIdx;
    weekIdx = pos.weekIdx;
    dayIdx = pos.isRestDay ? 0 : pos.dayIdx;
  } else {
    mesoIdx = 0;
    weekIdx = 0;
    dayIdx = 0;
  }

  function render() {
    const meso = MESOS[mesoIdx];
    const day = meso.days[dayIdx];
    const wk = weekLabel(mesoIdx, weekIdx);
    const deload = isDeloadWeek(weekIdx);
    const dayDone = store.isDayCompleted(mesoIdx, weekIdx, dayIdx);
    const warmupState = store.getWarmup(mesoIdx, weekIdx, dayIdx);
    const warmupComplete = warmupState && warmupState.complete;

    container.innerHTML = '';

    // --- Header ---
    container.innerHTML = `
      <div class="wk-header">
        <div class="wk-header__top">
          <span class="wk-header__tag">${day.tag} · ${meso.title}</span>
          <span class="wk-header__week">${wk.label}</span>
        </div>
        <div class="wk-header__title">${day.name}</div>
        <div class="wk-header__note">${day.note}${deload ? ' — DELOAD: ~60% volume, keep movements crisp.' : ''}</div>
      </div>
    `;

    // --- Day tabs ---
    let tabsHTML = '<div class="wk-day-tabs">';
    for (let d = 0; d < 5; d++) {
      const done = store.isDayCompleted(mesoIdx, weekIdx, d);
      const active = d === dayIdx;
      let cls = 'wk-day-tab';
      if (active) cls += ' wk-day-tab--active';
      if (done) cls += ' wk-day-tab--done';
      tabsHTML += `<button class="${cls}" data-day="${d}">D${d + 1}${done ? ' ✓' : ''}</button>`;
    }
    tabsHTML += '</div>';
    container.insertAdjacentHTML('beforeend', tabsHTML);

    // Wire day tabs
    container.querySelectorAll('.wk-day-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        dayIdx = parseInt(btn.dataset.day);
        render();
      });
    });

    // --- Deload banner ---
    if (deload) {
      container.insertAdjacentHTML('beforeend', `
        <div class="deload-banner">⚡ Deload Week — Drop a set, keep the bar moving, prioritise sleep</div>
      `);
    }

    // --- Warm-up section ---
    renderWarmup(container, dayIdx, mesoIdx, weekIdx, warmupComplete);

    // --- Exercise cards ---
    const exContainer = document.createElement('div');
    exContainer.className = 'stagger';
    day.ex.forEach((ex, ei) => {
      if (isPlaceholder(ex)) {
        exContainer.insertAdjacentHTML('beforeend', `
          <div class="ex-card anim-fade" style="opacity:0.5;border-style:dashed">
            <div class="ex-card__header">
              <span class="ex-card__name" style="color:var(--muted);font-style:italic">${cleanCue(ex)}</span>
            </div>
          </div>
        `);
        return;
      }

      const shld = hasShoulderFlag(ex);
      let cue = cleanCue(ex);
      let rx = ex[2];
      
      // Calculate weights dynamically if 1RM is set
      const squat1rm = state.athlete.squat1rm;
      if (squat1rm) {
        cue = calculateWeights(cue, squat1rm);
        rx = calculateWeights(rx, squat1rm);
      }

      if (deload) rx = computeDeloadRx(rx);

      const kW = store.key(mesoIdx, weekIdx, dayIdx, ei, 'w');
      const kR = store.key(mesoIdx, weekIdx, dayIdx, ei, 'rpe');
      const kC = store.key(mesoIdx, weekIdx, dayIdx, ei, 'done');
      const exDone = !!state.logs[kC];

      exContainer.insertAdjacentHTML('beforeend', `
        <div class="ex-card anim-fade ${exDone ? 'ex-card--done' : ''} ${deload ? 'ex-card--deload' : ''}" data-ex="${ei}">
          <div class="ex-card__header">
            <div class="ex-card__name">
              ${ex[0]}
              ${shld ? '<span class="badge badge--shld">SHLD</span>' : ''}
              <span class="ex-card__cue">${cue}</span>
            </div>
            <div class="ex-card__rx">${rx}</div>
          </div>
          <div class="ex-card__body">
            <div class="ex-card__field">
              <span class="ex-card__field-label">Load × Reps</span>
              <input class="ex-card__field-input" data-k="${kW}" value="${state.logs[kW] || ''}" placeholder="e.g. 80×6" inputmode="text">
            </div>
            <div class="ex-card__field">
              <span class="ex-card__field-label">RPE</span>
              <div class="rpe-select" data-k="${kR}">
                ${[6,7,8,9,10].map(r => `
                  <button class="rpe-option ${state.logs[kR] == r ? 'rpe-option--active' : ''}" data-rpe="${r}">${r}</button>
                `).join('')}
              </div>
            </div>
            <div class="ex-card__check-wrap">
              <input type="checkbox" class="chk" data-k="${kC}" ${exDone ? 'checked' : ''}>
            </div>
          </div>
        </div>
      `);
    });
    container.appendChild(exContainer);

    // Wire exercise inputs
    exContainer.querySelectorAll('input[data-k]').forEach(inp => {
      if (inp.type === 'checkbox') {
        inp.addEventListener('change', e => {
          store.setLog(e.target.dataset.k, e.target.checked ? 1 : 0);
          const card = e.target.closest('.ex-card');
          if (card) card.classList.toggle('ex-card--done', e.target.checked);
        });
      } else {
        inp.addEventListener('input', e => {
          store.setLog(e.target.dataset.k, e.target.value);
        });
      }
    });

    // RPE buttons
    exContainer.querySelectorAll('.rpe-select').forEach(sel => {
      sel.querySelectorAll('.rpe-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const k = sel.dataset.k;
          const rpe = btn.dataset.rpe;
          store.setLog(k, rpe);
          sel.querySelectorAll('.rpe-option').forEach(b => b.classList.remove('rpe-option--active'));
          btn.classList.add('rpe-option--active');
        });
      });
    });

    // --- Complete day button ---
    if (!dayDone) {
      container.insertAdjacentHTML('beforeend', `
        <div class="wk-complete">
          <button class="btn btn--go btn--full btn--lg" id="wk-complete-day">
            <span>✓ Complete ${day.tag}</span>
          </button>
        </div>
      `);

      container.querySelector('#wk-complete-day')?.addEventListener('click', () => {
        store.completeDay(mesoIdx, weekIdx, dayIdx);
        toast(`${day.tag} logged! Nice work. 💪`, 'success');
        render();
      });
    } else {
      container.insertAdjacentHTML('beforeend', `
        <div class="wk-complete">
          <div class="btn btn--full" style="background:var(--accent2);color:white;cursor:default;text-align:center">
            ✓ Day Completed
          </div>
        </div>
      `);
    }

    // --- Legend ---
    container.insertAdjacentHTML('beforeend', `
      <div class="wk-legend">
        <b>%</b> = % of squat 1RM &nbsp;·&nbsp; <b>RPE</b> = rate of perceived exertion (6–10)
        &nbsp;·&nbsp; <b>@X0X1</b> = tempo (ecc / pause / con / pause)<br>
        <span class="badge badge--shld">SHLD</span> = shoulder-conscious — stop anything that pinches, regress as needed.
      </div>
    `);
  }

  function renderWarmup(parent, di, mi, wi, isComplete) {
    const finisher = getFinisherForDay(di);
    const warmupKey = `${mi}.${wi}.${di}`;
    const collapsed = isComplete;

    const section = document.createElement('div');
    section.className = `warmup ${collapsed ? 'warmup--collapsed' : ''} ${isComplete ? 'warmup--complete' : ''}`;

    // Header
    section.innerHTML = `
      <div class="warmup__header">
        <span class="warmup__title">${isComplete ? '✓ Warm-up Complete' : '🔥 Warm-up Protocol'}</span>
        <span class="warmup__toggle">
          ${isComplete ? 'Show' : 'Hide'}
          <span class="warmup__toggle-arrow">▼</span>
        </span>
      </div>
      <div class="warmup__body">
        <div class="warmup__section-label">Base Sequence · ~8 min</div>
        ${BASE_WARMUP.map((block, bi) => `
          ${block.items.map((item, ii) => `
            <div class="warmup-item" data-warmup="${bi}-${ii}">
              <div class="warmup-item__check">
                <span style="font-size:12px;display:none">✓</span>
              </div>
              <div class="warmup-item__content">
                <div class="warmup-item__name">
                  ${item.name}
                  ${block.badge ? `<span class="badge badge--shld">${block.badge}</span>` : ''}
                </div>
                <div class="warmup-item__detail">${item.cue}</div>
              </div>
              <div class="warmup-item__rx">${item.rx}</div>
            </div>
          `).join('')}
        `).join('')}

        ${finisher.items.length > 0 ? `
          <div class="warmup__section-label">${finisher.name}</div>
          ${finisher.items.map((item, fi) => `
            <div class="warmup-item" data-finisher="${fi}">
              <div class="warmup-item__check">
                <span style="font-size:12px;display:none">✓</span>
              </div>
              <div class="warmup-item__content">
                <div class="warmup-item__name">${item.name}</div>
                <div class="warmup-item__detail">${item.cue}</div>
              </div>
              <div class="warmup-item__rx">${item.rx}</div>
            </div>
          `).join('')}
        ` : ''}

        <div class="warmup__coach-tip">${WARMUP_RULES[0]}</div>

        ${!isComplete ? `
          <button class="btn btn--gold btn--full warmup__done-btn" id="warmup-done">
            ✓ Warm-up Complete — Start Training
          </button>
        ` : ''}
      </div>
    `;

    parent.appendChild(section);

    // Toggle collapse
    const header = section.querySelector('.warmup__header');
    header.addEventListener('click', () => {
      section.classList.toggle('warmup--collapsed');
      const toggleText = section.querySelector('.warmup__toggle');
      if (toggleText) {
        toggleText.childNodes[0].textContent = section.classList.contains('warmup--collapsed') ? 'Show ' : 'Hide ';
      }
    });

    // Warmup item tap to toggle done
    section.querySelectorAll('.warmup-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('warmup-item--done');
        const check = item.querySelector('.warmup-item__check span');
        if (check) check.style.display = item.classList.contains('warmup-item--done') ? 'block' : 'none';
      });
    });

    // Complete warm-up
    const doneBtn = section.querySelector('#warmup-done');
    if (doneBtn) {
      doneBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.setWarmup(mi, wi, di, { complete: true });
        section.classList.add('warmup--complete', 'warmup--collapsed');
        const titleEl = section.querySelector('.warmup__title');
        if (titleEl) titleEl.textContent = '✓ Warm-up Complete';
        doneBtn.remove();
        toast('Warm-up done — let\'s work! 🔥', 'success');
      });
    }
  }

  render();
}
