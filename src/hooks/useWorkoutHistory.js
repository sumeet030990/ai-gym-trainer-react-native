import { useEffect, useState } from 'react';
import { WORKOUT_HISTORY } from '../utils/constants/exercises';

// TODO: replace mock with a React Query call to progress.api.ts once past sessions
// are persisted server-side.
export function useWorkoutHistory() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchHistory = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setData(WORKOUT_HISTORY);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { data, isLoading, isError, refetch: fetchHistory };
}
