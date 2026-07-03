import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';

const PROFILE_DEFAULTS = {
  name: '',
  email: '',
  phone: '',
  avatarUri: null,
  heightCm: undefined,
  weightKg: undefined,
  fitnessLevel: 'beginner',
};

export const useProfileStore = create(
  persist(
    (set) => ({
      ...PROFILE_DEFAULTS,

      updateProfile: (fields) => set((state) => ({ ...state, ...fields })),
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
