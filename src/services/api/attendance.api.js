import { authorizedFetch } from './client';

// start_date/end_date are optional ISO date strings ('YYYY-MM-DD').
export function getAttendance(userId, { startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const query = params.toString();
  return authorizedFetch(`/attendance/${userId}${query ? `?${query}` : ''}`);
}

// Logs a gym check-in for the authenticated user (attendance_date defaults to now server-side).
export function createAttendance() {
  return authorizedFetch('/attendance/', { method: 'POST', body: {} });
}
