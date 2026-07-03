import { useEffect, useState } from 'react';

// TODO: replace mock with a React Query call to ai.api.ts / workout.api.ts once the
// backend can generate real AI-adapted plans from workout history.
const WORKOUT_LIBRARY = {
  standard: {
    title: 'Chest & Triceps',
    subtitle: 'Push Day · Hypertrophy',
    exerciseCount: 8,
    calories: 420,
    duration: '45m',
  },
  lightRecovery: {
    title: 'Full Body Recovery',
    subtitle: 'Light Strength · Mobility',
    exerciseCount: 6,
    calories: 260,
    duration: '30m',
  },
  easeBackIn: {
    title: 'Mobility & Light Cardio',
    subtitle: 'Active Recovery',
    exerciseCount: 5,
    calories: 180,
    duration: '25m',
  },
};

// Days since the user's last logged workout is what drives the AI's suggestion —
// e.g. a long gap (a holiday, an injury) should ease the user back in rather than
// picking up the regular split where it left off.
const MOCK_DAYS_SINCE_LAST_WORKOUT = 4;

function getAdaptedWorkout(daysSinceLastWorkout) {
  if (daysSinceLastWorkout >= 5) {
    return {
      ...WORKOUT_LIBRARY.easeBackIn,
      aiReason: `You've been away for ${daysSinceLastWorkout} days — easing you back in with light mobility work.`,
    };
  }
  if (daysSinceLastWorkout >= 2) {
    return {
      ...WORKOUT_LIBRARY.lightRecovery,
      aiReason: `It's been ${daysSinceLastWorkout} days since your last session, so today's a lighter recovery workout.`,
    };
  }
  return { ...WORKOUT_LIBRARY.standard, aiReason: null };
}

export function useTodayWorkout() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchWorkout = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setData(getAdaptedWorkout(MOCK_DAYS_SINCE_LAST_WORKOUT));
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchWorkout();
  }, []);

  return { data, isLoading, isError, refetch: fetchWorkout };
}
