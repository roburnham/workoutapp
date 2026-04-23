export const SESSION_INFO = {
  upper1: { name: 'Upper #1', color: '#0A84FF', label: 'Upper' },
  lower1: { name: 'Lower #1', color: '#30D158', label: 'Lower' },
  upper2: { name: 'Upper #2', color: '#0A84FF', label: 'Upper' },
  lower2: { name: 'Lower #2', color: '#30D158', label: 'Lower' },
  arms:   { name: 'Arms & Weak Points', color: '#BF5AF2', label: 'Arms' },
}

export const ACTIVITY_TYPES = [
  { id: 'running',  label: 'Running',  emoji: '🏃' },
  { id: 'cycling',  label: 'Cycling',  emoji: '🚴' },
  { id: 'sports',   label: 'Sports',   emoji: '⚽' },
  { id: 'yoga',     label: 'Yoga',     emoji: '🧘' },
  { id: 'other',    label: 'Other',    emoji: '🏅' },
]

export function getBlock(week) {
  return week <= 5 ? 1 : 2
}

export function getSessionExercises(block, sessionType) {
  return BLOCKS[block]?.sessions[sessionType] ?? []
}

export const BLOCKS = {
  1: {
    name: 'Block 1: Build Phase',
    weeks: [1, 2, 3, 4, 5],
    sessions: {
      upper1: [
        { name: 'Cuffed Behind-The-Back Lateral Raise', technique: 'Myo-reps', warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Cross-Body Cable Y-Raise', sub2: 'DB Lateral Raise' },
        { name: 'Cross-Body Lat Pull-Around', technique: 'Long-length Partials (last set)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Half-Kneeling 1-Arm Lat Pulldown', sub2: 'Neutral-Grip Pullup' },
        { name: 'Low Incline Smith Machine Press', technique: 'Pec Static Stretch (30 sec)', warmupSets: '2-3', workingSets: 4, reps: '8-10', earlyRPE: '~8-9', lastRPE: '~9-10', rest: '~2-3 min', sub1: 'Low Incline Machine Press', sub2: 'Low Incline DB Press' },
        { name: 'Chest-Supported Machine Row', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Chest-Supported T-Bar Row', sub2: 'Helms Row' },
        { name: 'Overhead Cable Triceps Extension (Bar)', technique: 'Dropset', warmupSets: '1', workingSets: 2, reps: '8-10', earlyRPE: '~9-10', lastRPE: '10', rest: '~2-3 min', sub1: 'Overhead Cable Triceps Extension (Rope)', sub2: 'DB Skull Crusher' },
        { name: 'Straight-Bar Lat Prayer', technique: 'Long-length Partials (last set)', warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Machine Lat Pullover', sub2: 'DB Lat Pullover' },
        { name: 'Pec Deck (w/ Integrated Partials)', technique: 'Integrated Partials (all sets)', warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~8-9', lastRPE: '10', rest: '~1-2 min', sub1: 'Bent-Over Cable Pec Flye', sub2: 'DB Flye (w/ Integrated Partials)' },
      ],
      lower1: [
        { name: 'Seated Leg Curl', technique: null, warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Lying Leg Curl', sub2: 'Nordic Ham Curl' },
        { name: 'Machine Hip Adduction', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Cable Hip Adduction', sub2: 'Copenhagen Hip Adduction' },
        { name: 'Hack Squat', technique: null, warmupSets: '2-4', workingSets: 3, reps: '4, 6, 8', earlyRPE: '~9', lastRPE: '~9', rest: '~3-5 min', sub1: 'Machine Squat', sub2: 'Front Squat' },
        { name: 'Leg Extension', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'DB Step-Up', sub2: 'Reverse Nordic' },
        { name: 'Leg Press Calf Press', technique: 'Calf Static Stretch (30 sec)', warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Donkey Calf Raise', sub2: 'Seated Calf Raise' },
      ],
      upper2: [
        { name: 'Super-ROM Overhand Cable Row', technique: null, warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Overhand Machine Row', sub2: 'Arm-Out Single-Arm DB Row' },
        { name: 'Machine Shoulder Press', technique: 'Dropset', warmupSets: '2-3', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Cable Shoulder Press', sub2: 'Seated DB Shoulder Press' },
        { name: 'Assisted Pull-Up', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Lat Pulldown', sub2: 'Machine Pulldown' },
        { name: 'Paused Assisted Dip', technique: null, warmupSets: '2', workingSets: 3, reps: '8-10', earlyRPE: '~8-9', lastRPE: '10', rest: '~2-3 min', sub1: 'Decline Machine Chest Press', sub2: 'Decline Barbell Press' },
        { name: 'Inverse DB Zottman Curl', technique: null, warmupSets: '1', workingSets: 2, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Slow-Eccentric DB Curl', sub2: 'Hammer Curl' },
        { name: 'Super-ROM DB Lateral Raise', technique: null, warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~0.5-1 min', sub1: 'Cable Upright Row', sub2: 'DB Lateral Raise' },
        { name: 'Cable Reverse Flye (Mechanical Dropset)', technique: 'Mechanical Dropset (all sets)', warmupSets: '0', workingSets: 3, reps: '5, 4, 3+', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Reverse Pec Deck', sub2: 'Bent-Over Reverse DB Flye' },
      ],
      lower2: [
        { name: 'Lying Leg Curl', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Seated Leg Curl', sub2: 'Nordic Ham Curl' },
        { name: 'Leg Press', technique: null, warmupSets: '2-4', workingSets: 3, reps: '8', earlyRPE: '~8-9', lastRPE: '~8-9', rest: '~1-2 min', sub1: 'Belt Squat', sub2: 'High-Bar Back Squat' },
        { name: 'Paused Barbell RDL', technique: null, warmupSets: '2-3', workingSets: 2, reps: '8', earlyRPE: '~6-7', lastRPE: '~7-8', rest: '~3-4 min', sub1: 'Paused DB RDL', sub2: 'Glute-Ham Raise' },
        { name: 'A1: Machine Hip Adduction', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~0.5-1 min', sub1: 'Cable Hip Adduction', sub2: 'Copenhagen Hip Adduction' },
        { name: 'A2: Sissy Squat', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~7-8', lastRPE: '~7-8', rest: '~0.5-1 min', sub1: 'Leg Extension', sub2: 'Goblet Squat' },
        { name: 'Standing Calf Raise', technique: 'Calf Static Stretch (30 sec)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Leg Press Calf Press', sub2: 'Donkey Calf Raise' },
      ],
      arms: [
        { name: 'Weak Point Exercise 1', technique: null, warmupSets: '1-3', workingSets: 3, reps: '8-12', earlyRPE: '~9', lastRPE: '~9-10', rest: '~1-3 min', sub1: 'See Weak Point Table', sub2: 'See Weak Point Table' },
        { name: 'Weak Point Exercise 2 (optional)', technique: null, warmupSets: '1-3', workingSets: 2, reps: '8-12', earlyRPE: '~9', lastRPE: '~9-10', rest: '~1-3 min', sub1: 'See Weak Point Table', sub2: 'See Weak Point Table' },
        { name: 'Bayesian Cable Curl', technique: 'Long-length Partials (last set)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'DB Incline Curl', sub2: 'DB Scott Curl' },
        { name: 'Seated DB French Press', technique: null, warmupSets: '1', workingSets: 3, reps: '10', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'EZ-bar Skull Crusher', sub2: 'DB Skull Crusher' },
        { name: 'Bottom-2/3 Constant Tension Preacher Curl', technique: null, warmupSets: '1', workingSets: 2, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Bottom-2/3 EZ-Bar Curl', sub2: 'Spider Curl' },
        { name: 'Cable Triceps Kickback', technique: null, warmupSets: '0', workingSets: 2, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Bench Dip', sub2: 'DB Triceps Kickback' },
        { name: 'Cable Crunch', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Machine Crunch', sub2: 'Plate-Weighted Crunch' },
      ],
    },
  },
  2: {
    name: 'Block 2: Novelty Phase',
    weeks: [6, 7, 8, 9, 10],
    sessions: {
      upper1: [
        { name: 'Cuffed Behind-The-Back Lateral Raise', technique: 'Myo-reps', warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Cross-Body Cable Y-Raise', sub2: 'DB Lateral Raise' },
        { name: 'Lat-Focused Cable Row', technique: 'Lat Static Stretch (30 sec)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Half-Kneeling 1-Arm Lat Pulldown', sub2: 'Elbows-In 1-Arm DB Row' },
        { name: 'Low Incline DB Press', technique: null, warmupSets: '2-3', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Low Incline Machine Press', sub2: 'Low Incline Barbell Press' },
        { name: 'Chest-Supported T-Bar Row + Kelso Shrug', technique: null, warmupSets: '2', workingSets: 3, reps: '8-10 + 4-6', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Machine Chest-Supported Row + Kelso Shrug', sub2: 'Incline Chest-Supported DB Row + Kelso Shrug' },
        { name: 'Bent-Over Cable Pec Flye (w/ Integrated Partials)', technique: 'Integrated Partials (all sets)', warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~8-9', lastRPE: '10', rest: '~1-2 min', sub1: 'Pec Deck (w/ Integrated Partials)', sub2: 'DB Flye (w/ Integrated Partials)' },
        { name: '1-Arm Lat Pull-In', technique: 'Long-length Partials (last set)', warmupSets: '1', workingSets: 2, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Wide-Grip Lat Pulldown', sub2: 'Wide-Grip Band-Assisted Pull-Up' },
        { name: 'Dual-Cable Triceps Press', technique: null, warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~8-9', lastRPE: '10', rest: '~2-3 min', sub1: 'Overhead Cable Triceps Extension (Bar)', sub2: 'DB Skull Crusher' },
      ],
      lower1: [
        { name: 'Seated Leg Curl', technique: null, warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Lying Leg Curl', sub2: 'Nordic Ham Curl' },
        { name: 'Machine Hip Adduction', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Cable Hip Adduction', sub2: 'Copenhagen Hip Adduction' },
        { name: 'Smith Machine Squat', technique: null, warmupSets: '2-4', workingSets: 3, reps: '4, 6, 8', earlyRPE: '~9', lastRPE: '~9', rest: '~3-5 min', sub1: 'Machine Squat', sub2: 'DB Bulgarian Split Squat' },
        { name: 'Leg Extension', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'DB Step-Up', sub2: 'Reverse Nordic' },
        { name: 'DB Calf Jumps', technique: null, warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Leg Press Calf Jumps', sub2: 'Standing Calf Raise' },
      ],
      upper2: [
        { name: 'Dual-Handle Lat Pulldown (Mid-back + Lats)', technique: null, warmupSets: '1-2', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Overhand Lat Pulldown', sub2: 'Pull-Up' },
        { name: 'Seated DB Shoulder Press', technique: null, warmupSets: '2-3', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Seated Barbell Shoulder Press', sub2: 'Standing DB Arnold Press' },
        { name: 'Chest-Supported Machine Row', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Chest-Supported T-Bar Row', sub2: 'Helms Row' },
        { name: 'Decline Machine Chest Press', technique: null, warmupSets: '2', workingSets: 3, reps: '8-10', earlyRPE: '~8-9', lastRPE: '10', rest: '~2-3 min', sub1: 'Decline Smith Machine Press', sub2: 'Decline Barbell Press' },
        { name: 'Concentration Cable Curl', technique: null, warmupSets: '1', workingSets: 2, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'DB Concentration Curl', sub2: 'DB Preacher Curl' },
        { name: 'Cross-Body Cable Y-Raise', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9', lastRPE: '10', rest: '~2-3 min', sub1: 'Machine Lateral Raise', sub2: 'DB Lateral Raise' },
        { name: 'Rear Delt 45° Cable Flye', technique: null, warmupSets: '1', workingSets: 3, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'DB Rear Delt Swing', sub2: 'Bent-Over Reverse DB Flye' },
      ],
      lower2: [
        { name: 'Lying Leg Curl', technique: 'Long-length Partials (last set)', warmupSets: '1-2', workingSets: 3, reps: '8-10', earlyRPE: '~9', lastRPE: '10', rest: '~1-2 min', sub1: 'Seated Leg Curl', sub2: 'Nordic Ham Curl' },
        { name: 'Smith Machine Reverse Lunge', technique: null, warmupSets: '2-4', workingSets: 3, reps: '8', earlyRPE: '~8-9', lastRPE: '~8-9', rest: '~1-2 min', sub1: 'DB Reverse Lunge', sub2: 'DB Walking Lunge' },
        { name: 'Glute-Ham Raise', technique: null, warmupSets: '2-3', workingSets: 3, reps: '8', earlyRPE: '~8-9', lastRPE: '~9-10', rest: '~3-4 min', sub1: 'Nordic Ham Curl', sub2: 'Seated Leg Curl' },
        { name: 'A1: Machine Hip Adduction', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: null, sub1: 'Cable Hip Adduction', sub2: 'Copenhagen Hip Adduction' },
        { name: 'A2: Machine Hip Abduction', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: null, sub1: 'Cable Hip Abduction', sub2: 'Lateral Band Walk' },
        { name: 'Standing Calf Raise', technique: 'Calf Static Stretch (30 sec)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Seated Calf Raise', sub2: 'Leg Press Calf Press' },
      ],
      arms: [
        { name: 'Weak Point Exercise 1', technique: null, warmupSets: '1-3', workingSets: 3, reps: '8-12', earlyRPE: '~9', lastRPE: '~9-10', rest: '~1-3 min', sub1: 'See Weak Point Table', sub2: 'See Weak Point Table' },
        { name: 'Weak Point Exercise 2 (optional)', technique: null, warmupSets: '1-3', workingSets: 2, reps: '8-12', earlyRPE: '~9', lastRPE: '~9-10', rest: '~1-3 min', sub1: 'See Weak Point Table', sub2: 'See Weak Point Table' },
        { name: 'Slow-Eccentric EZ-Bar Skull Crusher', technique: null, warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Slow-Eccentric DB Skull Crusher', sub2: 'Slow-Eccentric DB French Press' },
        { name: 'Slow-Eccentric Bayesian Curl', technique: 'Long-length Partials (last set)', warmupSets: '1', workingSets: 3, reps: '10-12', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Slow-Eccentric DB Incline Curl', sub2: 'Slow-Eccentric DB Scott Curl' },
        { name: 'Triceps Diverging Pressdown (Long Rope or 2 Ropes)', technique: null, warmupSets: '1', workingSets: 2, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Cable Triceps Kickback', sub2: 'DB Triceps Kickback' },
        { name: 'Reverse-Grip Cable Curl', technique: null, warmupSets: '0', workingSets: 2, reps: '12-15', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Reverse-Grip EZ-Bar Curl', sub2: 'Reverse-Grip DB Curl' },
        { name: 'Roman Chair Leg Raise', technique: null, warmupSets: '0', workingSets: 3, reps: '10-20', earlyRPE: '~9-10', lastRPE: '10', rest: '~1-2 min', sub1: 'Hanging Leg Raise', sub2: 'Reverse Crunch' },
      ],
    },
  },
}
