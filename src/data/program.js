/* =========================================================
   PROGRAM DATA — 24-Week Vertical Jump Macrocycle
   6 mesocycles × 4 weeks × 5 days
   ========================================================= */

export const MESOS = [
  {
    n: 1, title: "Anatomical Adaptation", weeks: "Wk 1–4", big: "01",
    desc: "Prep tendons, joints and connective tissue for what's coming. Moderate loads, controlled tempo, build movement quality and re-pattern the right shoulder safely. Extensive low-intensity plyos (pogos, line hops) to teach stiffness.",
    pills: ["Squat 65–72%", "Tempo work", "Extensive plyo", "RPE 6–7"],
    days: [
      {
        name: "Lower — Force Base", tag: "DAY 1", note: "Tempo emphasis. Own the bottom position.", ex: [
          ["Back Squat", "@31X1 tempo", "4×6 @68%"],
          ["Romanian Deadlift", "hinge, slow eccentric", "3×8"],
          ["Bulgarian Split Squat", "per leg, controlled", "3×8"],
          ["Standing Calf Raise", "2s pause top", "4×12"],
          ["Pogo Jumps", "stiff ankles, min ground time", "4×15"]
        ]
      },
      {
        name: "Upper — Shoulder-Safe + Core", tag: "DAY 2", note: "Neutral-grip & landmine only. Nothing overhead.", ex: [
          ["Landmine Press", "SHLD · neutral, pain-free arc", "3×10"],
          ["Chest-Supported Row", "SHLD · scap control", "4×10"],
          ["Pull-up", "maintenance, not to failure", "3×6"],
          ["Face Pull / Band Pull-apart", "SHLD · rear delt / cuff", "3×15"],
          ["Pallof Press + Dead Bug", "anti-rotation core", "3×10"]
        ]
      },
      {
        name: "Plyo Skill + Posterior", tag: "DAY 3", note: "Fresh legs only. Quality contacts.", ex: [
          ["Ankle Pogo / Line Hops", "extensive, rhythmic", "5×20"],
          ["Box Jump (step down)", "land soft, low box", "5×4"],
          ["Hip Thrust", "glute drive, 1s squeeze", "4×10"],
          ["Nordic / Ham Curl", "eccentric control", "3×6"],
          ["Tibialis Raise", "shin health", "3×15"]
        ]
      },
      {
        name: "Recovery / Mobility / Zone 2", tag: "DAY 4", note: "Active recovery — keep HR easy.", ex: [
          ["Zone 2 cardio", "nasal-breath pace", "25–30 min"],
          ["Hip & Ankle Mobility", "CARs, couch stretch", "15 min"],
          ["Shoulder Rehab Set", "SHLD · prescribed by PT", "as Rx"],
          ["Foam Roll / Soft Tissue", "quads, calves, t-spine", "10 min"]
        ]
      },
      {
        name: "Lower — Power Intro + Jump", tag: "DAY 5", note: "Intro to fast intent. Submax.", ex: [
          ["Trap-Bar Deadlift", "fast concentric intent", "4×5 @70%"],
          ["Vertical Jump (submax)", "reach focus, technique", "5×3"],
          ["Walking Lunge", "loaded, controlled", "3×10"],
          ["Single-leg Calf Raise", "per leg", "3×12"],
          ["Broad Jump (submax)", "stick the landing", "4×3"]
        ]
      }
    ]
  },
  {
    n: 2, title: "Hypertrophy / GPP", weeks: "Wk 5–8", big: "02",
    desc: "Build cross-sectional muscle in the prime movers (quads, glutes, hamstrings, calves) and raise work capacity. More volume, moderate loads. This is the size base that future strength is built on.",
    pills: ["Squat 70–78%", "Higher volume", "Work capacity", "RPE 7–8"],
    days: [
      {
        name: "Lower — Quad Volume", tag: "DAY 1", note: "Chase a strong pump, stay 1–2 reps from failure.", ex: [
          ["Back Squat", "steady, full depth", "5×8 @74%"],
          ["Leg Press", "feet mid, full ROM", "4×12"],
          ["Walking Lunge", "long stride, quad bias", "3×12"],
          ["Leg Extension", "1s squeeze top", "3×15"],
          ["Seated Calf Raise", "slow stretch", "4×15"]
        ]
      },
      {
        name: "Upper — Shoulder-Safe Volume", tag: "DAY 2", note: "Build the back to stabilise the shoulder.", ex: [
          ["Landmine Press", "SHLD · controlled", "4×10"],
          ["Chest-Supported Row", "SHLD · pause at chest", "4×12"],
          ["Pull-up / Lat Pulldown", "full stretch", "4×8"],
          ["Cable Face Pull", "SHLD · cuff & rear delt", "4×15"],
          ["Hanging Knee Raise + Side Plank", "core", "3×12 / 3×30s"]
        ]
      },
      {
        name: "Plyo + Posterior Volume", tag: "DAY 3", note: "Moderate plyo dose, still fresh.", ex: [
          ["Box Jump", "moderate height, soft land", "6×4"],
          ["Bounding", "horizontal power, rhythmic", "4×20m"],
          ["Hip Thrust", "heavy-ish, full lockout", "4×12"],
          ["Nordic / Glute-Ham Raise", "eccentric", "4×6"],
          ["Reverse Hyper / Back Ext", "low-back capacity", "3×12"]
        ]
      },
      {
        name: "Recovery / Mobility / Zone 2", tag: "DAY 4", note: "Don't skip — this is where you grow.", ex: [
          ["Zone 2 cardio", "easy steady", "30 min"],
          ["Mobility flow", "hips, ankles, t-spine", "15 min"],
          ["Shoulder Rehab Set", "SHLD · per PT", "as Rx"],
          ["Soft Tissue", "full lower body", "10 min"]
        ]
      },
      {
        name: "Lower — Posterior + Jump", tag: "DAY 5", note: "Hinge volume + repeat jumps.", ex: [
          ["Trap-Bar Deadlift", "controlled, full", "4×8 @72%"],
          ["Repeat Vertical Jumps", "reach, consistent height", "5×4"],
          ["Romanian Deadlift", "stretch hams", "4×10"],
          ["Standing Calf Raise", "heavy", "5×12"],
          ["Broad Jump", "distance + stick", "4×4"]
        ]
      }
    ]
  },
  {
    n: 3, title: "Maximal Strength", weeks: "Wk 9–12", big: "03",
    desc: "Raise the force ceiling. Heavy loads, lower reps, long rest (3–4 min on mains). Force is the foundation of power — a stronger squat means a higher potential jump. Plyos stay moderate to maintain elasticity.",
    pills: ["Squat 80–90%", "Low reps", "Long rest", "RPE 8–9"],
    days: [
      {
        name: "Lower — Max Squat", tag: "DAY 1", note: "Rest 3–4 min between top sets. Brace hard.", ex: [
          ["Back Squat", "heavy, crisp", "5×4 @85%"],
          ["Front Squat", "upright, quad bias", "3×5 @75%"],
          ["Bulgarian Split Squat", "loaded, per leg", "3×6"],
          ["Standing Calf Raise", "heavy, paused", "4×8"],
          ["Pogo Jumps", "keep elastic quality", "3×12"]
        ]
      },
      {
        name: "Upper — Shoulder-Safe Strength", tag: "DAY 2", note: "Strength rep ranges, still no overhead.", ex: [
          ["Landmine Press", "SHLD · heavier, clean reps", "4×8"],
          ["Weighted Pull-up / Row", "SHLD · build pulling strength", "4×6"],
          ["Chest-Supported Row", "SHLD · heavy, paused", "4×8"],
          ["Face Pull + External Rotation", "SHLD · cuff strength", "3×15"],
          ["Weighted Plank + Pallof", "stiff trunk", "3×30s / 3×10"]
        ]
      },
      {
        name: "Plyo + Heavy Posterior", tag: "DAY 3", note: "Quality contacts, longer rest between sets.", ex: [
          ["Depth Drop → Stick", "low box, absorb force", "5×3"],
          ["Box Jump", "moderate, explosive", "5×3"],
          ["Heavy Hip Thrust", "3×6 near-max", "4×6"],
          ["Nordic Curl", "slow eccentric", "4×5"],
          ["Back Extension", "weighted", "3×10"]
        ]
      },
      {
        name: "Recovery / Mobility / Zone 2", tag: "DAY 4", note: "Heavy weeks tax the CNS — recover fully.", ex: [
          ["Zone 2 cardio", "easy", "25 min"],
          ["Mobility", "hip & ankle priority", "15 min"],
          ["Shoulder Rehab", "SHLD · per PT", "as Rx"],
          ["Soft Tissue / Sauna", "optional", "—"]
        ]
      },
      {
        name: "Lower — Max Pull + Jump", tag: "DAY 5", note: "Heavy hinge, then sharp jumps.", ex: [
          ["Trap-Bar Deadlift", "heavy, fast intent", "5×3 @85%"],
          ["Max Vertical Jump", "full effort, reach mark", "6×2"],
          ["Romanian Deadlift", "heavy", "3×6"],
          ["Single-leg Calf Raise", "loaded", "3×10"],
          ["Standing Long Jump", "max effort, stick", "5×2"]
        ]
      }
    ]
  },
  {
    n: 4, title: "Strength-Speed", weeks: "Wk 13–16", big: "04",
    desc: "Now move heavy loads FAST. Dynamic-effort squats (compensatory acceleration), velocity-based intent. We start converting raw strength into usable power. Plyo intensity climbs.",
    pills: ["Dynamic 75–85%", "Fast intent", "Contrast sets", "RPE 7–8"],
    days: [
      {
        name: "Lower — Dynamic Squat", tag: "DAY 1", note: "Every rep MAX speed up. Rest full between sets.", ex: [
          ["Speed Back Squat", "explosive concentric", "8×3 @75%"],
          ["Trap-Bar Jump (light)", "jump with bar, land soft", "5×3"],
          ["Front Squat", "controlled", "3×5"],
          ["Standing Calf Raise", "fast, springy", "4×10"],
          ["Pogo Jumps", "stiff, reactive", "4×12"]
        ]
      },
      {
        name: "Upper — Shoulder-Safe", tag: "DAY 2", note: "Maintain pulling, keep cuff healthy.", ex: [
          ["Landmine Press", "SHLD · explosive intent", "4×6"],
          ["Weighted Pull-up", "SHLD · controlled", "4×6"],
          ["Chest-Supported Row", "SHLD · paused", "3×10"],
          ["Face Pull + ER", "SHLD · cuff", "3×15"],
          ["Med-ball Slam (light) + Pallof", "trunk power, pain-free", "3×8 / 3×10"]
        ]
      },
      {
        name: "Plyo Power + Posterior", tag: "DAY 3", note: "Contrast: heavy then explosive.", ex: [
          ["Depth Jump (low box)", "react fast off ground", "5×3"],
          ["Hip Thrust → Vertical Jump", "contrast pair", "4×(4+3)"],
          ["Bounding for height", "powerful, rhythmic", "4×20m"],
          ["Nordic Curl", "eccentric", "3×6"],
          ["Reverse Hyper", "posterior", "3×12"]
        ]
      },
      {
        name: "Recovery / Mobility / Zone 2", tag: "DAY 4", note: "Keep it light, stay springy.", ex: [
          ["Zone 2 cardio", "easy", "20–25 min"],
          ["Mobility", "ankle dorsiflexion focus", "15 min"],
          ["Shoulder Rehab", "SHLD · per PT", "as Rx"],
          ["Soft Tissue", "calves, quads", "10 min"]
        ]
      },
      {
        name: "Lower — Speed Pull + Jump", tag: "DAY 5", note: "Fast pulls, max-intent jumps.", ex: [
          ["Speed Trap-Bar Deadlift", "explosive", "6×3 @80%"],
          ["Max Vertical Jump", "reach, full effort", "6×3"],
          ["Romanian Deadlift", "moderate", "3×8"],
          ["Single-leg Calf Raise", "springy", "3×10"],
          ["Approach Jump (1-step)", "basketball-style, soft land", "5×3"]
        ]
      }
    ]
  },
  {
    n: 5, title: "Speed-Strength / Power", weeks: "Wk 17–20", big: "05",
    desc: "Rate of force development is king now. Lighter, explosive loads; high-intensity reactive plyos; jump-squats and Olympic-lift variants (shoulder-safe). The bar moves light and fast — express power.",
    pills: ["Explosive 50–70%", "High plyo", "RFD focus", "RPE 7"],
    days: [
      {
        name: "Lower — Jump Squats", tag: "DAY 1", note: "Light & violent. Reset each rep.", ex: [
          ["Jump Squat (loaded)", "explosive, 20–30% 1RM", "6×3"],
          ["Trap-Bar Jump", "max height with bar", "5×3"],
          ["Bulgarian Split Squat", "controlled, maintenance", "3×6"],
          ["Reactive Calf Hops", "fast, stiff", "4×15"],
          ["Pogo to single-leg", "reactive", "4×10"]
        ]
      },
      {
        name: "Upper — Shoulder-Safe", tag: "DAY 2", note: "Low volume maintenance.", ex: [
          ["Landmine Push Press", "SHLD · only if cleared", "3×6"],
          ["Weighted Pull-up", "SHLD · maintain", "3×5"],
          ["Chest-Supported Row", "SHLD", "3×8"],
          ["Face Pull + ER", "SHLD · cuff", "3×15"],
          ["Med-ball Rotational Throw", "trunk power, pain-free", "3×6"]
        ]
      },
      {
        name: "Reactive Plyo + Posterior", tag: "DAY 3", note: "Highest reactive demand. Stay crisp.", ex: [
          ["Depth Jump", "react instantly, max height", "6×3"],
          ["Hurdle Hops", "stiff, rebound fast", "5×5"],
          ["Single-leg Bound", "power per leg", "4×6"],
          ["Hip Thrust", "fast concentric", "3×6"],
          ["Nordic Curl", "maintain", "3×5"]
        ]
      },
      {
        name: "Recovery / Mobility / Zone 2", tag: "DAY 4", note: "Springs need rest to stay springy.", ex: [
          ["Zone 2 cardio", "very easy", "20 min"],
          ["Mobility", "full lower body", "15 min"],
          ["Shoulder Rehab", "SHLD · per PT", "as Rx"],
          ["Soft Tissue", "priority on calves", "10 min"]
        ]
      },
      {
        name: "Lower — Power Pull + Max Jump", tag: "DAY 5", note: "Express it — measure jumps.", ex: [
          ["Trap-Bar Speed Pull", "light, explosive", "5×2 @70%"],
          ["Max Vertical Jump (measured)", "log your reach", "6×2"],
          ["Approach Jump (full)", "basketball run-up", "5×3"],
          ["Single-leg Calf Raise", "reactive", "3×10"],
          ["Depth Drop → Max Jump", "contrast finisher", "4×2"]
        ]
      }
    ]
  },
  {
    n: 6, title: "Peaking / Realization", weeks: "Wk 21–24", big: "06",
    desc: "Convert everything into peak vertical. Volume drops sharply; intensity of intent stays maximal. Heavy CNS primers (low volume), max-intent jumps, full recovery. By the end you re-test and should hit your highest vert. Then re-assess shoulder for return to ball/Thai.",
    pills: ["Primer 40–60%", "Max jump", "Low volume", "Full recovery"],
    days: [
      {
        name: "Lower — CNS Primer", tag: "DAY 1", note: "Heavy single/double to potentiate, NOT to fatigue.", ex: [
          ["Back Squat (primer)", "heavy double, leave 3 in tank", "3×2 @85%"],
          ["Jump Squat (light)", "fast, post-activation", "4×3"],
          ["Vertical Jump", "max reach", "5×2"],
          ["Calf Hops", "reactive, short", "3×10"],
          ["—", "keep it short, you're priming", "—"]
        ]
      },
      {
        name: "Upper — Maintenance", tag: "DAY 2", note: "Minimal — just keep tissue healthy.", ex: [
          ["Chest-Supported Row", "SHLD · light", "3×8"],
          ["Pull-up", "SHLD · easy", "2×5"],
          ["Face Pull + ER", "SHLD · cuff", "3×15"],
          ["Pallof Press", "trunk", "3×10"],
          ["Shoulder Rehab", "SHLD · per PT", "as Rx"]
        ]
      },
      {
        name: "Max Reactive Jump", tag: "DAY 3", note: "Fewest contacts, highest quality. Measure everything.", ex: [
          ["Depth Jump (max)", "peak reactive output", "5×2"],
          ["Approach Vertical (measured)", "run-up, log reach", "6×2"],
          ["Standing Vertical (measured)", "log reach", "5×2"],
          ["Hip Thrust", "light, snappy", "2×5"],
          ["—", "walk away while jumps are high", "—"]
        ]
      },
      {
        name: "Recovery / Mobility", tag: "DAY 4", note: "Sleep, eat, recover. The work is done.", ex: [
          ["Light movement / walk", "blood flow only", "20 min"],
          ["Mobility", "gentle", "10 min"],
          ["Shoulder Rehab", "SHLD · per PT", "as Rx"],
          ["Soft Tissue", "light", "10 min"]
        ]
      },
      {
        name: "Peak Test + Jump", tag: "DAY 5", note: "Re-test vert vs week 1. Full rest between attempts.", ex: [
          ["Trap-Bar Primer", "heavy single", "2×1 @88%"],
          ["MAX VERTICAL TEST", "standing — record best", "5×1"],
          ["MAX APPROACH TEST", "run-up — record best", "5×1"],
          ["Broad Jump Test", "record distance", "3×1"],
          ["—", "compare to week 1, log PRs", "—"]
        ]
      }
    ]
  }
];

// --- Helpers ---

/** Get the global week number (1-24) from meso+week indices */
export function getGlobalWeek(mesoIdx, weekIdx) {
  return mesoIdx * 4 + weekIdx + 1;
}

/** Check if a given week is a deload week */
export function isDeloadWeek(weekIdx) {
  return weekIdx === 3;
}

/** Get week label */
export function weekLabel(mesoIdx, weekIdx) {
  const globalWeek = getGlobalWeek(mesoIdx, weekIdx);
  const deload = isDeloadWeek(weekIdx);
  return {
    globalWeek,
    isDeload: deload,
    label: deload ? `Wk ${globalWeek} · DELOAD` : `Wk ${globalWeek}`
  };
}

/** Compute deload prescription — drop a set from the first number */
export function computeDeloadRx(prescription) {
  if (/^\d+×/.test(prescription)) {
    return prescription.replace(/^(\d+)×/, (_, sets) =>
      `${Math.max(1, parseInt(sets) - 1)}×`
    ) + ' ↓';
  }
  return prescription;
}

/** Get the meso index and week index for a given global week (1-based) */
export function getMesoForWeek(globalWeek) {
  const idx = globalWeek - 1;
  return {
    mesoIdx: Math.floor(idx / 4),
    weekIdx: idx % 4
  };
}

/** Total training days in the program */
export const TOTAL_TRAINING_DAYS = MESOS.length * 4 * 5; // 120
