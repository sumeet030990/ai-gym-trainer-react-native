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

// payload: { attendance_id, muscles: [{ muscle_id, exercises: [{ exercise_id, sets: [{ set_number, reps, weight_kg }] }] }] }
export function logWorkout(payload) {
  return authorizedFetch('/workout/log-workout', { method: 'POST', body: payload });
}

// start_date/end_date are optional ISO date strings ('YYYY-MM-DD'); the server defaults to the last 30 days.
export function getWorkoutLogs({ startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const query = params.toString();
  return authorizedFetch(`/workout/get-user-logs${query ? `?${query}` : ''}`);
}

// Everything logged so far for one attendance: { id, attendance_id, exercises: [{ exercise_id, muscle_id, sets }] },
// or null when nothing has been logged for it yet.
export function getWorkoutSessionLog(attendanceId) {
  return authorizedFetch(`/workout/get-session-log?attendance_id=${encodeURIComponent(attendanceId)}`);
}
