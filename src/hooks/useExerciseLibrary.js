import { useEffect, useMemo, useState } from 'react';
import { EQUIPMENT_TYPES, EXERCISES, MUSCLE_GROUPS } from '../utils/constants/exercises';

// TODO: replace mock with a React Query call to workout.api.ts once the exercise
// library is served from the backend.
export function useExerciseLibrary() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchLibrary = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setData(EXERCISES);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return { data, isLoading, isError, refetch: fetchLibrary };
}

export function useExerciseFilters(exercises, { query, muscle, equipment } = {}) {
  return useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((exercise) => {
      const matchesQuery = query ? exercise.name.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesMuscle = muscle ? exercise.muscle === muscle : true;
      const matchesEquipment = equipment ? exercise.equipment === equipment : true;
      return matchesQuery && matchesMuscle && matchesEquipment;
    });
  }, [exercises, query, muscle, equipment]);
}

export function useExerciseFilterOptions() {
  return { muscleGroups: MUSCLE_GROUPS, equipmentTypes: EQUIPMENT_TYPES };
}
