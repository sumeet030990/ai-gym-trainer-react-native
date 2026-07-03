import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';

const GOALS_DEFAULTS = {
  goalType: 'maintain',
  targetWeightKg: undefined,
  weeklyWorkoutTarget: 4,
  dailyCalorieTarget: 2200,
  proteinTargetG: 140,
};

export const useGoalsStore = create(
  persist(
    (set) => ({
      ...GOALS_DEFAULTS,

      updateGoals: (fields) => set((state) => ({ ...state, ...fields })),
    }),
    {
      name: 'goals-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
