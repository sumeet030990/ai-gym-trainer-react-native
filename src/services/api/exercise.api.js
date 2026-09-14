import { authorizedFetch } from './client';

// gymId (optional) restricts results to exercises whose equipment is available at that gym.
export function getExercises({ gymId } = {}) {
  const params = new URLSearchParams();
  if (gymId) params.set('gym_id', gymId);
  const query = params.toString();
  return authorizedFetch(`/exercise/${query ? `?${query}` : ''}`);
}
