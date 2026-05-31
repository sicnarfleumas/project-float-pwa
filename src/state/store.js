/* =========================================================
   STATE STORE — localStorage-backed reactive state
   ========================================================= */

const STORAGE_KEY = 'project-float-v1';

const DEFAULT_STATE = {
  version: 1,
  onboarded: false,
  athlete: {
    name: '',
    bodyweight: '',
    squat1rm: '',
    startVert: '',
    currentVert: '',
    startDate: '',
  },
  logs: {},           // "meso.week.day.exercise.field" → value
  jumpTests: [],      // [{ date, standing, approach, broad }]
  completedDays: {},  // "meso.week.day" → timestamp
  warmups: {},        // "meso.week.day" → { base, finisher, ts }
};

let _state = null;
let _listeners = [];
let _saveTimer = null;

/** Deep clone helper */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Load state from localStorage or return default */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults for forward compatibility
      return { ...clone(DEFAULT_STATE), ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
  }
  return clone(DEFAULT_STATE);
}

/** Persist state to localStorage (debounced) */
function persist() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, 300);
}

/** Notify all subscribers */
function notify() {
  _listeners.forEach(fn => {
    try { fn(_state); } catch (e) { console.error('Subscriber error:', e); }
  });
}

// --- Public API ---

export const store = {
  /** Initialize state (call once at startup) */
  init() {
    _state = load();
    return _state;
  },

  /** Get current state (read-only snapshot) */
  get() {
    return _state;
  },

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(fn) {
    _listeners.push(fn);
    return () => {
      _listeners = _listeners.filter(l => l !== fn);
    };
  },

  /** Update state partially */
  update(partial) {
    Object.assign(_state, partial);
    persist();
    notify();
  },

  /** Update athlete data */
  setAthlete(data) {
    _state.athlete = { ..._state.athlete, ...data };
    persist();
    notify();
  },

  /** Set a log entry */
  setLog(key, value) {
    _state.logs[key] = value;
    persist();
    notify();
  },

  /** Get a log entry */
  getLog(key) {
    return _state.logs[key] || '';
  },

  /** Mark a day as completed */
  completeDay(mesoIdx, weekIdx, dayIdx) {
    const k = `${mesoIdx}.${weekIdx}.${dayIdx}`;
    _state.completedDays[k] = Date.now();
    persist();
    notify();
  },

  /** Check if a day is completed */
  isDayCompleted(mesoIdx, weekIdx, dayIdx) {
    return !!_state.completedDays[`${mesoIdx}.${weekIdx}.${dayIdx}`];
  },

  /** Mark warm-up completion */
  setWarmup(mesoIdx, weekIdx, dayIdx, data) {
    const k = `${mesoIdx}.${weekIdx}.${dayIdx}`;
    _state.warmups[k] = { ...(_state.warmups[k] || {}), ...data, ts: Date.now() };
    persist();
    notify();
  },

  /** Get warm-up state */
  getWarmup(mesoIdx, weekIdx, dayIdx) {
    return _state.warmups[`${mesoIdx}.${weekIdx}.${dayIdx}`] || null;
  },

  /** Add a jump test */
  addJumpTest(test) {
    _state.jumpTests.push({ ...test, date: test.date || new Date().toISOString() });
    persist();
    notify();
  },

  /** Count completed training days */
  completedDayCount() {
    return Object.keys(_state.completedDays).length;
  },

  /** Export full state as JSON string */
  export() {
    return JSON.stringify(_state, null, 2);
  },

  /** Import state from JSON string */
  import(json) {
    try {
      const parsed = JSON.parse(json);
      _state = { ...clone(DEFAULT_STATE), ...parsed };
      persist();
      notify();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  /** Reset all data */
  reset() {
    _state = clone(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    persist();
    notify();
  },

  /** Mark onboarding complete */
  completeOnboarding() {
    _state.onboarded = true;
    persist();
    notify();
  },

  /** Build a log key */
  key(mesoIdx, weekIdx, dayIdx, exIdx, field) {
    return `${mesoIdx}.${weekIdx}.${dayIdx}.${exIdx}.${field}`;
  }
};
