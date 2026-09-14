import { authorizedFetch } from './client';

// start_date/end_date are optional ISO date strings ('YYYY-MM-DD').
export function getAttendance(userId, { startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const query = params.toString();
  return authorizedFetch(`/attendance/${userId}${query ? `?${query}` : ''}`);
}
