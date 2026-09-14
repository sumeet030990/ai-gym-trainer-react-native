import { authorizedFetch } from './client';

export function getUserPlan() {
  return authorizedFetch('/workout/get-user-plan');
}

export function checkRegenerationRequired() {
  return authorizedFetch('/workout/check-regeneration-required');
}

export function regeneratePlan() {
  return authorizedFetch('/workout/ai/regenerate-plan', { method: 'POST' });
}
