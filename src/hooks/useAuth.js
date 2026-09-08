import { useMutation } from '@tanstack/react-query';
import { loginRequest, registerRequest } from '../services/api/auth.api';
import { useAuthStore } from '../store/authStore';

// auth.api.js reports failures as { ok: false, message } rather than throwing,
// so each mutationFn re-throws here to get React Query's isPending/isError/error.
export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const result = await loginRequest(email, password);
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: ({ user, access_token }) => setSession(user, access_token),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload) => {
      const result = await registerRequest(payload);
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
  });
}
