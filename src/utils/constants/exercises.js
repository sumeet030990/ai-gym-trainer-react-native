// Shared exercise + workout mock data. Replace with workout.api.ts / ai.api.ts calls
// once the backend can serve real exercise libraries and session history.

export const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

export const EQUIPMENT_TYPES = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell'];

export const EXERCISES = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    equipment: 'Barbell',
    illustration: 'body-outline',
    sets: 4,
    reps: '8-10',
    suggestedWeight: 60,
    weightUnit: 'kg',
    calories: 65,
    instructions: [
      'Lie flat on the bench with feet firmly on the floor.',
      'Grip the bar slightly wider than shoulder-width.',
      'Lower the bar to mid-chest with control, then press up.',
    ],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    equipment: 'Dumbbell',
    illustration: 'body-outline',
    sets: 3,
    reps: '10-12',
    suggestedWeight: 22,
    weightUnit: 'kg',
    calories: 55,
    instructions: [
      'Set the bench to a 30-45 degree incline.',
      'Press dumbbells up until arms are extended.',
      'Lower slowly until elbows are just below the bench line.',
    ],
  },
  {
    id: 'cable-fly',
    name: 'Cable Chest Fly',
    muscle: 'Chest',
    equipment: 'Cable',
    illustration: 'body-outline',
    sets: 3,
    reps: '12-15',
    suggestedWeight: 15,
    weightUnit: 'kg',
    calories: 40,
    instructions: [
      'Stand centered between two cable towers.',
      'Bring handles together in a wide arcing motion.',
      'Squeeze chest at the midpoint, then return with control.',
    ],
  },
  {
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    muscle: 'Arms',
    equipment: 'Cable',
    illustration: 'body-outline',
    sets: 3,
    reps: '12-15',
    suggestedWeight: 25,
    weightUnit: 'kg',
    calories: 35,
    instructions: [
      'Keep elbows pinned to your sides.',
      'Push the bar down until arms are fully extended.',
      'Control the return until forearms reach parallel.',
    ],
  },
  {
    id: 'overhead-triceps-extension',
    name: 'Overhead Triceps Extension',
    muscle: 'Arms',
    equipment: 'Dumbbell',
    illustration: 'body-outline',
    sets: 3,
    reps: '10-12',
    suggestedWeight: 14,
    weightUnit: 'kg',
    calories: 35,
    instructions: [
      'Hold a single dumbbell overhead with both hands.',
      'Lower behind your head by bending at the elbows.',
      'Extend back to the start without flaring elbows out.',
    ],
  },
  {
    id: 'pushups',
    name: 'Push-Ups',
    muscle: 'Chest',
    equipment: 'Bodyweight',
    illustration: 'body-outline',
    sets: 3,
    reps: '15-20',
    suggestedWeight: null,
    weightUnit: null,
    calories: 45,
    instructions: [
      'Keep your body in a straight line from head to heels.',
      'Lower until your chest nearly touches the floor.',
      'Push back up while keeping your core tight.',
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscle: 'Back',
    equipment: 'Machine',
    illustration: 'body-outline',
    sets: 4,
    reps: '10-12',
    suggestedWeight: 45,
    weightUnit: 'kg',
    calories: 50,
    instructions: [
      'Grip the bar wider than shoulder-width.',
      'Pull the bar down to upper chest, squeezing your back.',
      'Slowly return to the starting position.',
    ],
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    muscle: 'Legs',
    equipment: 'Barbell',
    illustration: 'body-outline',
    sets: 4,
    reps: '6-8',
    suggestedWeight: 70,
    weightUnit: 'kg',
    calories: 90,
    instructions: [
      'Rest the bar across your upper back, feet shoulder-width apart.',
      'Sit back and down until thighs are parallel to the floor.',
      'Drive through your heels to stand back up.',
    ],
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    muscle: 'Full Body',
    equipment: 'Kettlebell',
    illustration: 'body-outline',
    sets: 3,
    reps: '15-20',
    suggestedWeight: 16,
    weightUnit: 'kg',
    calories: 70,
    instructions: [
      'Hinge at the hips with a flat back, kettlebell between your feet.',
      'Drive hips forward to swing the bell to chest height.',
      'Let it swing back between your legs and repeat.',
    ],
  },
  {
    id: 'plank',
    name: 'Plank',
    muscle: 'Core',
    equipment: 'Bodyweight',
    illustration: 'body-outline',
    sets: 3,
    reps: '45s',
    suggestedWeight: null,
    weightUnit: null,
    calories: 20,
    instructions: [
      'Rest on forearms and toes, body in a straight line.',
      'Brace your core and avoid letting hips sag.',
      'Hold for the target duration while breathing steadily.',
    ],
  },
];

export function getExerciseById(id) {
  return EXERCISES.find((exercise) => exercise.id === id) ?? null;
}

// Per-set actuals logged the last time the user did each exercise. Drives the
// AI weight/rep suggestions in useSetSuggestion until progress.api.ts can
// serve real history.
export const EXERCISE_SET_HISTORY = {
  'bench-press': {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: 57.5, reps: 10 },
      { weight: 57.5, reps: 9 },
      { weight: 57.5, reps: 8 },
      { weight: 55, reps: 8 },
    ],
  },
  'incline-dumbbell-press': {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: 20, reps: 12 },
      { weight: 20, reps: 11 },
      { weight: 20, reps: 10 },
    ],
  },
  'cable-fly': {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: 12.5, reps: 15 },
      { weight: 12.5, reps: 14 },
      { weight: 12.5, reps: 13 },
    ],
  },
  'triceps-pushdown': {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: 22.5, reps: 15 },
      { weight: 22.5, reps: 14 },
      { weight: 22.5, reps: 13 },
    ],
  },
  'overhead-triceps-extension': {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: 12, reps: 12 },
      { weight: 12, reps: 11 },
      { weight: 12, reps: 10 },
    ],
  },
  pushups: {
    lastSessionDate: '2026-06-26',
    sets: [
      { weight: null, reps: 18 },
      { weight: null, reps: 16 },
      { weight: null, reps: 15 },
    ],
  },
};

// Smallest sensible jump when the AI suggests adding weight, per equipment type.
export const WEIGHT_INCREMENT_BY_EQUIPMENT = {
  Barbell: 2.5,
  Machine: 2.5,
  Cable: 2.5,
  Dumbbell: 2,
  Kettlebell: 4,
  Bodyweight: 0,
};

export const TODAY_WORKOUT_EXERCISE_IDS = [
  'bench-press',
  'incline-dumbbell-press',
  'cable-fly',
  'triceps-pushdown',
  'overhead-triceps-extension',
  'pushups',
];

export const WORKOUT_HISTORY = [
  {
    id: 'w-2026-07-01',
    title: 'Chest & Triceps',
    date: '2026-07-01',
    duration: '48m',
    calories: 410,
    exerciseCount: 6,
    volume: 8420,
  },
  {
    id: 'w-2026-06-29',
    title: 'Back & Biceps',
    date: '2026-06-29',
    duration: '52m',
    calories: 460,
    exerciseCount: 7,
    volume: 9120,
  },
  {
    id: 'w-2026-06-27',
    title: 'Leg Day',
    date: '2026-06-27',
    duration: '55m',
    calories: 520,
    exerciseCount: 6,
    volume: 11200,
  },
  {
    id: 'w-2026-06-25',
    title: 'Full Body Recovery',
    date: '2026-06-25',
    duration: '30m',
    calories: 260,
    exerciseCount: 5,
    volume: 4300,
  },
  {
    id: 'w-2026-06-23',
    title: 'Shoulders & Core',
    date: '2026-06-23',
    duration: '40m',
    calories: 360,
    exerciseCount: 6,
    volume: 6800,
  },
];

