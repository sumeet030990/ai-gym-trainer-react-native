import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUserGoals, getGoalQuestions, getUserGoals, saveUserGoals } from '../services/api/goals.api';

const USER_GOALS_KEY = ['userGoals'];

// The goals API reports failures as { ok: false, message } rather than throwing,
// so each queryFn/mutationFn re-throws to get React Query's error state.
async function unwrap(request) {
  const result = await request;
  if (!result.ok) throw new Error(result.message);
  return result.data;
}

export function useGoalQuestions() {
  return useQuery({
    queryKey: ['goalQuestions'],
    queryFn: async () => (await unwrap(getGoalQuestions())) ?? [],
    staleTime: 1000 * 60 * 60,
  });
}

export function useUserGoals() {
  return useQuery({
    queryKey: USER_GOALS_KEY,
    queryFn: async () => (await unwrap(getUserGoals())) ?? [],
  });
}

// Labels picked for the highest-priority (lowest sort_order) answered question,
// e.g. "Lose Weight, Lean Body" — used as a one-line goal summary.
export function usePrimaryGoalSummary() {
  const { data } = useUserGoals();
  if (!data?.length) return null;

  const [primary] = [...data].sort((a, b) => (a.question.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.question.sort_order ?? Number.MAX_SAFE_INTEGER));
  const labels = primary.answers.map((answer) => answer.option?.label ?? answer.answer_text).filter(Boolean);
  return labels.length ? labels.join(', ') : null;
}

// Both mutations also refresh /users/me, since its user_goals mirrors these answers.
function useInvalidateGoals() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: USER_GOALS_KEY });
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };
}

export function useSaveGoalsMutation() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (userGoals) => unwrap(saveUserGoals(userGoals)),
    onSuccess: invalidate,
  });
}

export function useDeleteGoalsMutation() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: () => unwrap(deleteUserGoals()),
    onSuccess: invalidate,
  });
}
