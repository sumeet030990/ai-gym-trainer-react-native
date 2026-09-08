import { create } from 'zustand';
import { SECURE_KEYS, getSecureValue, setSecureValue, deleteSecureValue } from '../services/storage/secureStorage';

// The JWT never lands in Zustand/MMKV — only `isAuthenticated` does. The real
// token lives in SecureStore and is read on demand for authenticated requests.
const AUTH_DEFAULTS = {
  user: null,
  isAuthenticated: false,
  isHydrating: true,
};

// Network calls for login/register live in useAuth.js (React Query mutations);
// this store only ever persists the resulting session.
export const useAuthStore = create((set) => ({
  ...AUTH_DEFAULTS,

  hydrate: async () => {
    const token = await getSecureValue(SECURE_KEYS.authToken);
    set({ isAuthenticated: Boolean(token), isHydrating: false });
  },

  setSession: async (user, accessToken) => {
    await setSecureValue(SECURE_KEYS.authToken, accessToken);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await deleteSecureValue(SECURE_KEYS.authToken);
    set({ ...AUTH_DEFAULTS, isHydrating: false });
  },
}));
