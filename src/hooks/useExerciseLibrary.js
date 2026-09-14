import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExercises } from '../services/api/exercise.api';
import { getEquipments } from '../services/api/equipment.api';

export function useExerciseLibrary() {
  const query = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const result = await getExercises();
      if (!result.ok) throw new Error(result.message);
      return result.data ?? [];
    },
  });

  return { data: query.data, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useEquipments() {
  const query = useQuery({
    queryKey: ['equipments'],
    queryFn: async () => {
      const result = await getEquipments({ page: 1, pageSize: 100 });
      if (!result.ok) throw new Error(result.message);
      return result.data ?? [];
    },
  });

  return { data: query.data, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useExerciseFilters(exercises, { query, muscleId, equipmentId } = {}) {
  return useMemo(() => {
    if (!exercises) return [];
    const normalizedQuery = query?.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesQuery = normalizedQuery ? exercise.name.toLowerCase().includes(normalizedQuery) : true;
      const matchesMuscle = muscleId ? exercise.muscle?.id === muscleId : true;
      const matchesEquipment = equipmentId ? exercise.equipment_id === equipmentId : true;
      return matchesQuery && matchesMuscle && matchesEquipment;
    });
  }, [exercises, query, muscleId, equipmentId]);
}

// Muscle options come from the exercises themselves (the API has no standalone
// /muscles endpoint); equipment options come from the full /equipments catalog.
export function useExerciseFilterOptions(exercises, equipments) {
  return useMemo(() => {
    const muscleMap = new Map();
    (exercises ?? []).forEach((exercise) => {
      if (exercise.muscle?.id) muscleMap.set(exercise.muscle.id, exercise.muscle.name);
    });
    const muscles = Array.from(muscleMap, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));

    const equipmentOptions = (equipments ?? [])
      .map((item) => ({ id: item.id, name: item.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { muscles, equipments: equipmentOptions };
  }, [exercises, equipments]);
}
