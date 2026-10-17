import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserPlan,
  checkRegenerationRequired,
  generatePlan,
  regeneratePlan,
  logWorkout,
  getWorkoutLogs,
  getWorkoutSessionLog,
} from '../services/api/workout.api';
import { useWorkoutSessionStore } from '../store/workoutSessionStore';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// The plan's `day` field is LLM-generated free text seeded from short forms
// ("Mon", "Tue", ...) rather than full weekday names, so match on the first
// three letters, case-insensitively, to line up with "Monday"/"Tuesday"/etc.
function matchesWeekday(planDayName, weekdayFullName) {
  return planDayName?.trim().toLowerCase().slice(0, 3) === weekdayFullName.toLowerCase().slice(0, 3);
}

function findPlanDay(days, weekdayFullName) {
  return days.find((day) => matchesWeekday(day.day, weekdayFullName));
}

// Shapes a plan exercise like the rest of the app's exercise objects (ExerciseCard,
// the Exercise Details screen, the session store). The route/store id is the
// library exercise_id when the server matched one, else a plan-local key, since
// unmatched exercises can still be viewed and tracked but not logged.
function mapPlanExercises(planExercises = []) {
  const usedIds = new Set();

  return [...planExercises]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((exercise, index) => {
      const libraryId = exercise.exercise_id && !usedIds.has(exercise.exercise_id) ? exercise.exercise_id : null;
      const id = libraryId ?? `plan-${index}`;
      usedIds.add(id);

      return {
        id,
        exerciseId: libraryId,
        muscleId: libraryId ? exercise.muscle_id ?? null : null,
        name: exercise.name,
        muscle: exercise.muscle_name ?? null,
        equipment: null,
        illustration: 'body-outline',
        sets: exercise.sets,
        reps: exercise.reps,
        suggestedWeight: exercise.weight_kg || null,
        weightUnit: 'kg',
        calories: null,
        instructions: exercise.form_cue ? [exercise.form_cue] : [],
      };
    });
}

function pickTodaysWorkout(planResponse) {
  const days = planResponse?.workout_plan?.days ?? [];
  const todayName = WEEKDAY_NAMES[new Date().getDay()];
  const today = findPlanDay(days, todayName);

  // Plans only include the user's chosen training days, so a day absent from
  // the plan is a legitimate rest day rather than a load failure.
  if (!today) {
    return {
      title: 'Rest Day',
      subtitle: todayName,
      exerciseCount: 0,
      calories: null,
      duration: null,
      aiReason: null,
      isRestDay: true,
      exercises: [],
    };
  }

  return {
    title: today.muscles?.join(' & ') || today.day,
    subtitle: today.day,
    exerciseCount: today.exercises?.length ?? 0,
    calories: null,
    duration: null,
    aiReason: today.notes ?? null,
    isRestDay: false,
    exercises: mapPlanExercises(today.exercises),
  };
}

export function useTodayWorkout() {
  const query = useQuery({
    queryKey: ['workout-plan'],
    queryFn: async () => {
      const result = await getUserPlan();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
  });

  return { ...query, data: query.data ? pickTodaysWorkout(query.data) : undefined };
}

// Monday-start dates for the current calendar week, so the strip shows real
// day-of-month numbers next to each weekday's slot in the (repeating) plan.
function getCurrentWeekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

function normalizeExerciseName(exercise, index) {
  if (typeof exercise === 'string') return exercise;
  return exercise?.name ?? exercise?.exercise_name ?? exercise?.title ?? `Exercise ${index + 1}`;
}

function buildDaySummary(planDay) {
  const exercises = planDay?.exercises ?? [];
  return {
    title: planDay?.muscles?.join(' & ') || planDay?.day || 'Rest Day',
    exerciseNames: exercises.map(normalizeExerciseName),
    exerciseCount: exercises.length,
    notes: planDay?.notes ?? null,
    isRestDay: exercises.length === 0,
  };
}

export function useWeekPlan() {
  const query = useQuery({
    queryKey: ['workout-plan'],
    queryFn: async () => {
      const result = await getUserPlan();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
  });

  const planDays = query.data?.workout_plan?.days ?? [];
  const todayKey = new Date().toDateString();

  const week = getCurrentWeekDates().map((date) => {
    const weekdayName = WEEKDAY_NAMES[date.getDay()];
    const planDay = findPlanDay(planDays, weekdayName);

    return {
      key: date.toDateString(),
      weekday: weekdayName,
      letter: WEEKDAY_LETTERS[date.getDay()],
      dayNumber: date.getDate(),
      isToday: date.toDateString() === todayKey,
      ...buildDaySummary(planDay),
    };
  });

  return { ...query, data: query.data ? week : undefined };
}

export function useRegenerationStatus() {
  return useQuery({
    queryKey: ['regeneration'],
    queryFn: async () => {
      const result = await checkRegenerationRequired();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
  });
}

// Also refreshes /users/me: its current_plan_id is what the root navigator gates onboarding on.
export function useGeneratePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await generatePlan();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plan'] });
      queryClient.invalidateQueries({ queryKey: ['regeneration'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useRegeneratePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await regeneratePlan();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plan'] });
      queryClient.invalidateQueries({ queryKey: ['regeneration'] });
    },
  });
}

// Builds the /workout/log-workout body from the session store's completed sets,
// grouped by muscle as the API expects. The server replaces the sets of every
// exercise sent, so each exercise carries its full set list. Exercises without
// library ids can't be referenced server-side, so they stay local only.
export function canSyncExercise(exercise) {
  return Boolean(exercise?.exerciseId && exercise?.muscleId);
}

export function buildWorkoutLogPayload(exercises, completedSets, attendanceId) {
  const muscles = new Map();

  exercises.forEach((exercise) => {
    const sets = completedSets[exercise.id] ?? [];
    if (sets.length === 0 || !canSyncExercise(exercise)) return;

    const exerciseLogs = muscles.get(exercise.muscleId) ?? [];
    exerciseLogs.push({
      exercise_id: exercise.exerciseId,
      sets: sets.map((set, index) => ({ set_number: index + 1, reps: set.reps ?? 0, weight_kg: set.weight ?? 0 })),
    });
    muscles.set(exercise.muscleId, exerciseLogs);
  });

  return {
    attendance_id: attendanceId,
    muscles: Array.from(muscles, ([muscleId, exerciseLogs]) => ({ muscle_id: muscleId, exercises: exerciseLogs })),
  };
}

// Whether a workout has already been logged today, so the summary doesn't let
// the same session be saved twice. Dates are UTC to match attendance_date.
export function useHasLoggedWorkoutToday() {
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['workout-logs', today],
    queryFn: async () => {
      const result = await getWorkoutLogs({ startDate: today, endDate: today });
      if (!result.ok) throw new Error(result.message);
      return (result.data ?? []).length > 0;
    },
  });
}

// Server log -> session store shape, keyed by library exercise id (which is
// what synced exercises use as their store id). Sets arrive in set_number order.
function toCompletedSets(sessionLog) {
  return Object.fromEntries(
    (sessionLog?.exercises ?? []).map((exercise) => [
      exercise.exercise_id,
      exercise.sets.map((set) => ({ weight: set.weight_kg, reps: set.reps })),
    ]),
  );
}

// Keeps the session store in step with today's attendance. Every save sends an
// exercise's full set list and the server replaces what it had, so the store
// must hold everything already logged before another set is saved; otherwise
// e.g. an app restart would start at set 1 and wipe the earlier sets. Also
// drops a previous day's sets once there's no session for today.
// `attendanceReady` is false until today's attendance has loaded.
export function useWorkoutSessionSync(attendanceId, attendanceReady) {
  const sessionAttendanceId = useWorkoutSessionStore((state) => state.attendanceId);
  const hydrateSession = useWorkoutSessionStore((state) => state.hydrateSession);
  const resetSession = useWorkoutSessionStore((state) => state.resetSession);
  const needsHydration = Boolean(attendanceId) && sessionAttendanceId !== attendanceId;

  const query = useQuery({
    queryKey: ['workout-session-log', attendanceId],
    queryFn: async () => {
      const result = await getWorkoutSessionLog(attendanceId);
      if (!result.ok) throw new Error(result.message);
      return result.data ?? null;
    },
    enabled: needsHydration,
    // Only read once per session, right before hydrating; a cached copy could predate later saves.
    gcTime: 0,
  });

  useEffect(() => {
    if (!attendanceReady) return;
    if (!attendanceId) {
      if (sessionAttendanceId) resetSession();
      return;
    }
    if (needsHydration && query.isSuccess && !query.isFetching) {
      hydrateSession(attendanceId, toCompletedSets(query.data));
    }
  }, [attendanceReady, attendanceId, sessionAttendanceId, needsHydration, query.isSuccess, query.isFetching, query.data, hydrateSession, resetSession]);

  return {
    isSyncing: needsHydration && !query.isError,
    isError: needsHydration && query.isError,
    refetch: query.refetch,
  };
}

// Read-only view of one past session's log, for the History detail screen. Kept
// under its own key so it never shares cache with useWorkoutSessionSync's read.
export function useWorkoutSessionDetail(attendanceId) {
  return useQuery({
    queryKey: ['workout-session-detail', attendanceId],
    queryFn: async () => {
      const result = await getWorkoutSessionLog(attendanceId);
      if (!result.ok) throw new Error(result.message);
      return result.data ?? null;
    },
    enabled: Boolean(attendanceId),
  });
}

export function useLogWorkoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // Saves fire after every set; a shared scope runs them one at a time so an
    // older set list can't land after a newer one and overwrite it.
    scope: { id: 'workout-log' },
    mutationFn: async (payload) => {
      const result = await logWorkout(payload);
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-logs'] });
      // Attendance records carry muscles_trained, which is derived from workout logs.
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['regeneration'] });
    },
  });
}
