import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/api/user.api';

// getMe() reports failures as { ok: false, message } rather than throwing,
// so queryFn re-throws here to get React Query's isError/error.
export function useUserProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const result = await getMe();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
  });
}
