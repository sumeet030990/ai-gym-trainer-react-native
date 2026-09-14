import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPlan, checkRegenerationRequired, regeneratePlan } from '../services/api/workout.api';

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
