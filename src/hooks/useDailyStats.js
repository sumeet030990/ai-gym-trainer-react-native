import { useEffect, useState } from 'react';

// TODO: replace mock with React Query calls to progress.api.ts / diet.api.ts.
const MOCK_DAILY_STATS = {
  calories: { current: 420, goal: 600 },
  steps: { current: 6420, goal: 10000 },
  water: { current: 5, goal: 8 },
  streak: 12,
  activeMinutes: 38,
};

export function useDailyStats() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DAILY_STATS);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
