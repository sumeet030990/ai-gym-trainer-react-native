import { create } from 'zustand';

// Shared across the Summary and Exercise Details screens so a set logged
// from either one is visible on the other — replaced entirely once
// workout.api.ts can persist history server-side.
export const useWorkoutSessionStore = create((set) => ({
  completedSets: {},

  logSet: (exerciseId, data) => {
    set((state) => ({
      completedSets: {
        ...state.completedSets,
        [exerciseId]: [...(state.completedSets[exerciseId] ?? []), data],
      },
    }));
  },

  updateSet: (exerciseId, index, data) => {
    set((state) => {
      const sets = state.completedSets[exerciseId] ?? [];
      if (index >= sets.length) return state;
      const nextSets = sets.slice();
      nextSets[index] = data;
      return { completedSets: { ...state.completedSets, [exerciseId]: nextSets } };
    });
  },
}));
