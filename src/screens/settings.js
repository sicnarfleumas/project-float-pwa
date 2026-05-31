/* =========================================================
   SETTINGS SCREEN — Profile, export, import, reset
   ========================================================= */

import { store } from '../state/store.js';
import { toast } from '../components/toast.js';
import { navigate } from '../utils/router.js';
import { formatDate } from '../utils/helpers.js';

export function renderSettings(container) {
  container.classList.add('settings');
  const state = store.get();
  const athlete = state.athlete;

  container.innerHTML = `
    <div class="settings-header">
      <h2>Settings</h2>
    </div>

    <!-- Profile -->
    <div class="settings-section">
      <div class="settings-section__title">Athlete Profile</div>
      <div class="settings-row">
        <div class="field">
          <label class="field__label" for="set-name">Name</label>
          <input class="input" id="set-name" type="text" value="${athlete.name || ''}">
        </div>
        <div class="field">
          <label class="field__label" for="set-height">Height (cm)</label>
          <input class="input" id="set-height" type="number" inputmode="decimal" value="${athlete.height || ''}">
        </div>
      </div>
      <div class="settings-row">
        <div class="field">
          <label class="field__label" for="set-bw">Bodyweight (kg)</label>
          <input class="input" id="set-bw" type="number" inputmode="decimal" value="${athlete.bodyweight || ''}">
        </div>
        <div class="field">
          <label class="field__label" for="set-squat">Squat 1RM (kg)</label>
          <input class="input" id="set-squat" type="number" inputmode="decimal" value="${athlete.squat1rm || ''}">
        </div>
      </div>
      <div class="settings-row">
        <div class="field">
          <label class="field__label" for="set-vert">Current Vert (cm)</label>
          <input class="input" id="set-vert" type="number" inputmode="decimal" value="${athlete.currentVert || ''}">
          <div id="set-dunk-req" style="color:var(--accent); font-weight:bold; font-size:12px; margin-top:4px;"></div>
        </div>
        <div class="field">
          <label class="field__label" for="set-start">Start Date</label>
          <input class="input" id="set-start" type="date" value="${athlete.startDate || ''}">
        </div>
      </div>
      <button class="btn btn--go btn--full mt-md" id="set-save-profile">Save Profile</button>
    </div>

    <!-- Jump Test Log -->
    <div class="settings-section">
      <div class="settings-section__title">Jump Test Log</div>
      <p style="font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);margin-bottom:12px">
        Record periodic test results to track your progress over time.
      </p>
      <div class="settings-row">
        <div class="field">
          <label class="field__label" for="jt-standing">Standing (cm)</label>
          <input class="input input--sm" id="jt-standing" type="number" inputmode="decimal" placeholder="—">
        </div>
        <div class="field">
          <label class="field__label" for="jt-approach">Approach (cm)</label>
          <input class="input input--sm" id="jt-approach" type="number" inputmode="decimal" placeholder="—">
        </div>
        <div class="field">
          <label class="field__label" for="jt-broad">Broad (cm)</label>
          <input class="input input--sm" id="jt-broad" type="number" inputmode="decimal" placeholder="—">
        </div>
      </div>
      <button class="btn btn--gold btn--full btn--sm mt-sm" id="jt-add">+ Add Test Result</button>
      <div class="jump-tests" id="jump-tests-list"></div>
    </div>

    <!-- Data -->
    <div class="settings-section">
      <div class="settings-section__title">Data Management</div>
      <div class="settings-actions">
        <button class="btn btn--go btn--full" id="set-export">⬇ Export Progress (JSON)</button>
        <button class="btn btn--gold btn--full" id="set-import-btn">⬆ Import Backup</button>
        <input type="file" id="set-import-file" accept=".json" style="display:none">
      </div>
    </div>

    <!-- Danger zone -->
    <div class="settings-section settings-danger">
      <div class="settings-section__title" style="color:var(--danger)">Danger Zone</div>
      <button class="btn btn--full" id="set-reset">Reset All Data</button>
    </div>
  `;

  // --- Render jump tests ---
  renderJumpTests();

  function updateSettingsDunkGoal() {
    const h = parseFloat(container.querySelector('#set-height').value);
    const dunkReq = container.querySelector('#set-dunk-req');
    if (dunkReq) {
      if (!isNaN(h) && h > 0) {
        const reach = h * 1.33;
        const req = Math.max(0, 320 - reach).toFixed(1);
        dunkReq.textContent = `DUNK GOAL: ~${req} CM VERT`;
      } else {
        dunkReq.textContent = '';
      }
    }
  }

  // --- Wire events ---

  const heightInput = container.querySelector('#set-height');
  if (heightInput) heightInput.addEventListener('input', updateSettingsDunkGoal);
  updateSettingsDunkGoal(); // Initial run

  // Save profile
  container.querySelector('#set-save-profile').addEventListener('click', () => {
    store.setAthlete({
      name: container.querySelector('#set-name').value,
      height: container.querySelector('#set-height').value,
      bodyweight: container.querySelector('#set-bw').value,
      squat1rm: container.querySelector('#set-squat').value,
      currentVert: container.querySelector('#set-vert').value,
      startDate: container.querySelector('#set-start').value,
    });
    toast('Profile saved!', 'success');
  });

  // Add jump test
  container.querySelector('#jt-add').addEventListener('click', () => {
    const standing = container.querySelector('#jt-standing').value;
    const approach = container.querySelector('#jt-approach').value;
    const broad = container.querySelector('#jt-broad').value;

    if (!standing && !approach && !broad) {
      toast('Enter at least one measurement', 'error');
      return;
    }

    store.addJumpTest({ standing, approach, broad });

    // Update current vert if standing entered
    if (standing) {
      store.setAthlete({ currentVert: standing });
      container.querySelector('#set-vert').value = standing;
    }

    container.querySelector('#jt-standing').value = '';
    container.querySelector('#jt-approach').value = '';
    container.querySelector('#jt-broad').value = '';

    toast('Jump test recorded! 🎯', 'success');
    renderJumpTests();
  });

  // Export
  container.querySelector('#set-export').addEventListener('click', () => {
    const json = store.export();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    const name = (state.athlete.name || 'vert').replace(/\s+/g, '-').toLowerCase();
    a.href = URL.createObjectURL(blob);
    a.download = `${name}-project-float.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Progress exported!', 'success');
  });

  // Import
  container.querySelector('#set-import-btn').addEventListener('click', () => {
    container.querySelector('#set-import-file').click();
  });

  container.querySelector('#set-import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = store.import(ev.target.result);
      if (success) {
        toast('Data imported successfully!', 'success');
        renderSettings(container); // Re-render with new data
      } else {
        toast('Failed to import — check the file format', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Reset
  container.querySelector('#set-reset').addEventListener('click', () => {
    showResetModal();
  });

  function renderJumpTests() {
    const list = container.querySelector('#jump-tests-list');
    if (!list) return;
    const tests = store.get().jumpTests || [];

    if (tests.length === 0) {
      list.innerHTML = '<p style="font-family:\'Space Mono\',monospace;font-size:11px;color:var(--muted);margin-top:8px">No tests recorded yet.</p>';
      return;
    }

    list.innerHTML = [...tests].reverse().map(t => `
      <div class="jump-test-entry">
        <div class="jump-test-entry__date">${formatDate(t.date)}</div>
        <div class="jump-test-entry__values">
          ${t.standing ? `<div class="jump-test-entry__val"><div class="jump-test-entry__val-num">${t.standing}</div><div class="jump-test-entry__val-label">Stand</div></div>` : ''}
          ${t.approach ? `<div class="jump-test-entry__val"><div class="jump-test-entry__val-num">${t.approach}</div><div class="jump-test-entry__val-label">App</div></div>` : ''}
          ${t.broad ? `<div class="jump-test-entry__val"><div class="jump-test-entry__val-num">${t.broad}</div><div class="jump-test-entry__val-label">Broad</div></div>` : ''}
        </div>
      </div>
    `).join('');
  }

  function showResetModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__title">Reset Everything?</div>
        <p class="modal__text">This will permanently delete all your workout logs, jump tests, and profile data. Export a backup first if you want to keep anything.</p>
        <div class="modal__actions">
          <button class="btn" id="modal-cancel">Cancel</button>
          <button class="btn" id="modal-confirm" style="border-color:var(--danger);color:var(--danger)">Reset</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#modal-confirm').addEventListener('click', () => {
      store.reset();
      overlay.remove();
      toast('All data cleared.', 'info');
      navigate('/onboarding');
    });
  }
}
