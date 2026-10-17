import { create } from 'zustand';

// Shared across the Summary and Exercise Details screens so a set logged
// from either one is visible on the other. Each change is also saved to the
// server via /workout/log-workout, and the store is reloaded from the server
// (see useWorkoutSessionSync) whenever it isn't already holding today's session.
export const useWorkoutSessionStore = create((set) => ({
  // Attendance the sets below belong to; null until a session is loaded, which
  // includes sets logged before the workout was started.
  attendanceId: null,
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

  // Adopts the server's sets for a session. Sets logged before any session was
  // loaded are kept on top (Start Workout uploads them); sets left over from an
  // earlier session are dropped so they can't be saved into this one.
  hydrateSession: (attendanceId, serverSets) => {
    set((state) => ({
      attendanceId,
      completedSets: state.attendanceId === null ? { ...serverSets, ...state.completedSets } : serverSets,
    }));
  },

  resetSession: () => set({ attendanceId: null, completedSets: {} }),
}));
