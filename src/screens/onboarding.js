/* =========================================================
   ONBOARDING SCREEN — 4-step setup flow
   ========================================================= */

import { store } from '../state/store.js';
import { navigate } from '../utils/router.js';
import { getNextMonday } from '../utils/helpers.js';

export function renderOnboarding(container) {
  container.className = 'onboarding';
  container.classList.remove('screen');

  let step = 0;
  const data = {
    name: '',
    height: '',
    bodyweight: '',
    squat1rm: '',
    startVert: '',
    approachVert: '',
    broadJump: '',
    startDate: getNextMonday(),
  };

  function render() {
    container.innerHTML = `
      <div class="onb-progress">
        <div class="onb-progress__bar" style="width: ${((step + 1) / 4) * 100}%"></div>
      </div>

      <div class="onb-steps">
        ${renderStep0()}
        ${renderStep1()}
        ${renderStep2()}
        ${renderStep3()}
      </div>

      <div class="onb-nav">
        ${step > 0 ? '<button class="btn btn--back" id="onb-back">← Back</button>' : ''}
        ${step < 3
          ? `<button class="btn btn--primary btn--full" id="onb-next">${step === 0 ? "Let's go" : 'Continue'}</button>`
          : '<button class="btn btn--go btn--full" id="onb-start">Start Program →</button>'}
      </div>
    `;

    // Set active step
    const steps = container.querySelectorAll('.onb-step');
    steps.forEach((s, i) => {
      s.classList.remove('active', 'exit-left');
      if (i === step) s.classList.add('active');
      else if (i < step) s.classList.add('exit-left');
    });

    // Fill values
    fillInputs();
    wireEvents();
  }

  function renderStep0() {
    return `
      <div class="onb-step" data-step="0">
        <div class="onb-brand" style="margin-top:auto">
          <h1>Project:<br>Float <span class="sub">24-Week Vertical Macrocycle</span></h1>
          <p class="onb-tagline">24 weeks to your highest vertical jump.</p>
          <div class="onb-structure">
            1 MACRO · 6 MESO · 24 WEEKS<br>
            5-DAY SPLIT · SHOULDER-SAFE<br>
            BLOCK PERIODIZATION → PEAK
          </div>
        </div>
      </div>
    `;
  }

  function renderStep1() {
    return `
      <div class="onb-step" data-step="1">
        <div class="onb-step-title">About You</div>
        <p class="onb-step-desc">We need a few numbers to personalize your program. You can skip any of these for now and update them later.</p>
        <div class="onb-fields">
          <div class="onb-field">
            <label class="onb-field__label" for="onb-name">Your Name <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-name" type="text" placeholder="What do we call you?" autocomplete="name">
          </div>
          <div class="onb-field">
            <label class="onb-field__label" for="onb-height">Height (cm) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-height" type="number" inputmode="decimal" placeholder="e.g. 180">
          </div>
          <div class="onb-field">
            <label class="onb-field__label" for="onb-bw">Bodyweight (kg) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-bw" type="number" inputmode="decimal" placeholder="e.g. 78">
          </div>
          <div class="onb-field">
            <label class="onb-field__label" for="onb-squat">Back Squat 1RM (kg) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-squat" type="number" inputmode="decimal" placeholder="e.g. 130">
            <span class="onb-field__hint">Best recent single — all % prescriptions are based on this</span>
            
            <div class="onb-help">
              <button class="onb-help__trigger">Don't know your 1RM? Estimate it ▼</button>
              <div class="onb-help__body">
                <p class="onb-help-text">Enter your best recent lift. We'll use the Epley formula to estimate your 1 Rep Max.</p>
                <div class="onb-calc">
                  <input type="number" id="calc-w" placeholder="Weight (kg)">
                  <input type="number" id="calc-r" placeholder="Reps">
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-family:'Space Mono',monospace; font-size:10px; color:var(--muted)">ESTIMATED 1RM:</span>
                  <span class="onb-calc-res" id="calc-res">—</span>
                </div>
                <button class="btn btn--sm btn--gold btn--full" id="calc-apply">Use This Estimate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderStep2() {
    return `
      <div class="onb-step" data-step="2">
        <div class="onb-step-title">Baseline Jump</div>
        <p class="onb-step-desc">Record your current standing vertical — this is the number you're going to beat. Optional, but highly recommended.</p>
        <div class="onb-fields">
          <div class="onb-field">
            <label class="onb-field__label" for="onb-vert">Standing Vertical (cm) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-vert" type="number" inputmode="decimal" placeholder="e.g. 58">
            <div id="onb-dunk-req" style="color:var(--accent); font-weight:bold; font-size:12px; margin-top:4px;"></div>
            
            <div class="onb-help">
              <button class="onb-help__trigger">How to measure at home ▼</button>
              <div class="onb-help__body">
                <div class="onb-help-text">
                  <b>The Chalk/Tape Method:</b>
                  <ol>
                    <li>Stand flat-footed next to a wall. Reach up as high as possible and mark the wall (Reach Height).</li>
                    <li>Put chalk on your fingertips (or hold a rolled piece of tape).</li>
                    <li>From a standstill, jump and tap the wall as high as you can (Jump Height).</li>
                    <li>Measure the distance between the two marks. That's your standing vertical.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div class="onb-field">
            <label class="onb-field__label" for="onb-approach">Approach Vertical (cm) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-approach" type="number" inputmode="decimal" placeholder="e.g. 68">
          </div>
          <div class="onb-field">
            <label class="onb-field__label" for="onb-broad">Broad Jump (cm) <span class="onb-opt">OPTIONAL</span></label>
            <input class="onb-field__input" id="onb-broad" type="number" inputmode="decimal" placeholder="e.g. 240">
          </div>
        </div>
      </div>
    `;
  }

  function renderStep3() {
    return `
      <div class="onb-step" data-step="3">
        <div class="onb-step-title">Ready to Fly</div>
        <p class="onb-step-desc">Here's your setup. You can always update these in settings.</p>
        <div class="onb-summary">
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Athlete</span>
            <span class="onb-summary-row__value" id="sum-name">${data.name || '—'}</span>
          </div>
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Height</span>
            <span class="onb-summary-row__value" id="sum-height">${data.height ? data.height + ' cm' : '—'}</span>
          </div>
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Bodyweight</span>
            <span class="onb-summary-row__value" id="sum-bw">${data.bodyweight ? data.bodyweight + ' kg' : '—'}</span>
          </div>
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Squat 1RM</span>
            <span class="onb-summary-row__value" id="sum-squat">${data.squat1rm ? data.squat1rm + ' kg' : '—'}</span>
          </div>
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Standing Vert</span>
            <span class="onb-summary-row__value" id="sum-vert">${data.startVert ? data.startVert + ' cm' : '—'}</span>
          </div>
          <div class="onb-summary-row">
            <span class="onb-summary-row__label">Start Date</span>
            <span class="onb-summary-row__value" id="sum-date">${data.startDate}</span>
          </div>
        </div>
        <div class="onb-field" style="margin-top: 24px">
          <label class="onb-field__label" for="onb-date">Start Date</label>
          <input class="onb-field__input" id="onb-date" type="date" value="${data.startDate}">
          <span class="onb-field__hint">Defaults to next Monday — week 1 starts here</span>
        </div>
      </div>
    `;
  }

  function fillInputs() {
    const map = {
      'onb-name': 'name',
      'onb-height': 'height',
      'onb-bw': 'bodyweight',
      'onb-squat': 'squat1rm',
      'onb-vert': 'startVert',
      'onb-approach': 'approachVert',
      'onb-broad': 'broadJump',
      'onb-date': 'startDate',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = container.querySelector(`#${id}`);
      if (el && data[key]) el.value = data[key];
    });
  }

  function collectInputs() {
    const map = {
      'onb-name': 'name',
      'onb-height': 'height',
      'onb-bw': 'bodyweight',
      'onb-squat': 'squat1rm',
      'onb-vert': 'startVert',
      'onb-approach': 'approachVert',
      'onb-broad': 'broadJump',
      'onb-date': 'startDate',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = container.querySelector(`#${id}`);
      if (el) data[key] = el.value;
    });
  }

  function wireEvents() {
    const next = container.querySelector('#onb-next');
    const back = container.querySelector('#onb-back');
    const start = container.querySelector('#onb-start');

    if (next) {
      next.addEventListener('click', () => {
        collectInputs();
        step++;
        render();
      });
    }

    if (back) {
      back.addEventListener('click', () => {
        collectInputs();
        step--;
        render();
      });
    }

    if (start) {
      start.addEventListener('click', () => {
        collectInputs();

        // Save to store
        store.setAthlete({
          name: data.name,
          height: data.height,
          bodyweight: data.bodyweight,
          squat1rm: data.squat1rm,
          startVert: data.startVert,
          currentVert: data.startVert,
          startDate: data.startDate,
        });

        // Add baseline jump test
        if (data.startVert) {
          store.addJumpTest({
            date: data.startDate,
            standing: data.startVert,
            approach: data.approachVert || '',
            broad: data.broadJump || '',
          });
        }

        store.completeOnboarding();
        navigate('/');
      });
    }

    // Live input tracking
    container.querySelectorAll('.onb-field__input').forEach(inp => {
      inp.addEventListener('input', () => {
        collectInputs();
        const dunkReq = container.querySelector('#onb-dunk-req');
        if (dunkReq) {
          const h = parseFloat(data.height);
          if (!isNaN(h) && h > 0) {
            const reach = h * 1.33;
            const req = Math.max(0, 320 - reach).toFixed(1);
            dunkReq.textContent = `DUNK GOAL: ~${req} CM VERT`;
          } else {
            dunkReq.textContent = '';
          }
        }
      });
    });

    // Accordions
    container.querySelectorAll('.onb-help__trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.onb-help');
        parent.classList.toggle('open');
      });
    });

    // 1RM Calculator
    const calcW = container.querySelector('#calc-w');
    const calcR = container.querySelector('#calc-r');
    const calcRes = container.querySelector('#calc-res');
    const calcApply = container.querySelector('#calc-apply');
    const squatInput = container.querySelector('#onb-squat');

    function updateCalc() {
      if (!calcW || !calcR || !calcRes) return;
      const w = parseFloat(calcW.value);
      const r = parseFloat(calcR.value);
      if (w > 0 && r > 0) {
        // Epley formula: 1RM = W * (1 + R/30)
        const rm = Math.round(w * (1 + r / 30));
        calcRes.textContent = rm + ' kg';
      } else {
        calcRes.textContent = '—';
      }
    }

    if (calcW) calcW.addEventListener('input', updateCalc);
    if (calcR) calcR.addEventListener('input', updateCalc);

    if (calcApply) {
      calcApply.addEventListener('click', () => {
        const res = calcRes.textContent.replace(' kg', '');
        if (res && res !== '—') {
          squatInput.value = res;
          data.squat1rm = res;
          
          // Flash effect
          squatInput.style.backgroundColor = 'rgba(255, 77, 36, 0.2)';
          setTimeout(() => squatInput.style.backgroundColor = 'transparent', 300);
          
          // Close accordion
          calcApply.closest('.onb-help').classList.remove('open');
        }
      });
    }
  }

  render();
}
