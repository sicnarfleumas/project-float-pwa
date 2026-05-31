/* =========================================================
   WARM-UP PROTOCOL
   Base sequence (~8 min every session) + day-specific finishers
   ========================================================= */

export const BASE_WARMUP = [
  {
    name: 'Raise',
    duration: '2–3 min',
    detail: 'Easy bike, row, or skips. Muay Thai skip-rope is perfect if you have a rope. Just enough to break a light sweat.',
    items: [
      { name: 'Easy cardio', rx: '2–3 min', cue: 'Break a light sweat, nothing more' }
    ]
  },
  {
    name: 'Shoulder Rehab Block',
    duration: '2 min',
    badge: 'SHLD',
    detail: 'Slot your PT\'s prescribed set here — every day, no exceptions. Defaulting it into the warm-up means it actually happens.',
    items: [
      { name: 'Band External Rotations', rx: '2×15', cue: 'Or PT-prescribed equivalent' },
      { name: 'Band Pull-aparts', rx: '2×15', cue: 'Squeeze rear delts' },
      { name: 'Scapular Wall Slides', rx: '2×10', cue: 'Full contact with wall' }
    ]
  },
  {
    name: 'Hips & Ankles',
    duration: '2 min',
    detail: 'Your two limiters for both squatting and jumping.',
    items: [
      { name: 'World\'s Greatest Stretch', rx: '4/side', cue: 'Open hips, rotate through t-spine' },
      { name: 'Deep Squat Hold with Pry', rx: '30s', cue: 'Gently push knees out' },
      { name: 'Ankle Dorsiflexion Rock', rx: '8/side', cue: 'Knee-to-wall — matters a lot for jump depth and landing' }
    ]
  },
  {
    name: 'Glute & Core Switch-on',
    duration: '1–2 min',
    detail: 'Activate the prime movers before loading them.',
    items: [
      { name: 'Glute Bridge', rx: '×15', cue: 'Squeeze hard at top' },
      { name: 'Dead Bug', rx: '6/side', cue: 'Slow and controlled' },
      { name: 'Bird Dog', rx: '6/side', cue: 'Reach long, hold 2s' }
    ]
  }
];

export const DAY_FINISHERS = {
  heavy_lower: {
    name: 'Heavy Lower Ramp',
    detail: 'Ramp into the bar. Never jump straight to working weight on a heavy day.',
    items: [
      { name: 'Bodyweight Squats', rx: '×10', cue: 'Full depth, controlled' },
      { name: 'Goblet Squat', rx: '×8', cue: 'Light KB/DB, groove the pattern' },
      { name: 'Empty Bar Squats', rx: '×5', cue: 'Find your brace' },
      { name: 'Ramp Sets', rx: '3–4×3–5', cue: 'Climb to working %, add ~10–15% per set' },
      { name: 'Leg Swings (front-back)', rx: '10/leg', cue: 'Controlled, full range' },
      { name: 'Leg Swings (lateral)', rx: '10/leg', cue: 'Open up the adductors' }
    ]
  },
  plyo: {
    name: 'Plyo CNS Prime',
    detail: 'Wake up the nervous system, prime the tendons. Don\'t go cold into max jumps.',
    items: [
      { name: 'Pogo Hops', rx: '2×10', cue: 'Building stiffness progressively' },
      { name: 'A-Skips', rx: '2×15m', cue: 'Quick, snappy ground contacts' },
      { name: 'Low Line Hops (front-back)', rx: '2×10', cue: 'Stiff ankles, minimal ground time' },
      { name: 'Low Line Hops (side-side)', rx: '2×10', cue: 'Same — reactive, not muscular' },
      { name: 'Submaximal Vertical Jumps', rx: '3 reps', cue: '~70%, 80%, 90% — bridge into real work' }
    ]
  },
  upper: {
    name: 'Upper Body Ramp',
    detail: 'Light ramp for pushing and pulling — keep it brief.',
    items: [
      { name: 'Band Pull-aparts', rx: '×15', cue: 'Warm up the posterior chain' },
      { name: 'Push-up Variation', rx: '×10', cue: 'Scap-controlled, slow' },
      { name: 'Light Row / Hang', rx: '×8', cue: 'Open up the lats' }
    ]
  },
  recovery: {
    name: 'Recovery Only',
    detail: 'Just the base sequence, slower tempo, longer holds. It doubles as your mobility work.',
    items: []
  }
};

/** Map day index (0-4) to finisher type */
export function getFinisherForDay(dayIndex) {
  const map = {
    0: 'heavy_lower',  // Day 1: Lower (force/squat)
    1: 'upper',        // Day 2: Upper
    2: 'plyo',         // Day 3: Plyo / jump skill
    3: 'recovery',     // Day 4: Recovery
    4: 'heavy_lower'   // Day 5: Lower (power/posterior)
  };
  return DAY_FINISHERS[map[dayIndex]] || DAY_FINISHERS.recovery;
}

/** Coach rules — shown as tip text */
export const WARMUP_RULES = [
  'Keep the warm-up non-fatiguing — it should switch you on, never tire you out.',
  'On plyo and power days especially, if you feel like you "worked" in the warm-up, you overdid it.'
];
