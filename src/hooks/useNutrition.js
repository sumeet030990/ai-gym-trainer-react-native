import { useEffect, useState } from 'react';

// TODO: replace mock with React Query call to diet.api.ts once the backend is wired up.
const MOCK_NUTRITION = {
  calories: { current: 1240, goal: 2200 },
  protein: { current: 86, goal: 140 },
  carbs: { current: 120, goal: 250 },
  fat: { current: 40, goal: 70 },
};

export function useNutrition() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchNutrition = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setData(MOCK_NUTRITION);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  return { data, isLoading, isError, refetch: fetchNutrition };
}
