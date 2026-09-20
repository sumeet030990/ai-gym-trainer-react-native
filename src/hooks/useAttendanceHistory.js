import { useQuery } from '@tanstack/react-query';
import { getAttendance } from '../services/api/attendance.api';

// Fetches attendance records for userId within [startDate, endDate] ('YYYY-MM-DD' strings).
export function useAttendanceHistory(userId, { startDate, endDate } = {}) {
  return useQuery({
    queryKey: ['attendance', userId, startDate, endDate],
    queryFn: async () => {
      const result = await getAttendance(userId, { startDate, endDate });
      if (!result.ok) throw new Error(result.message);
      return result.data ?? [];
    },
    enabled: Boolean(userId && startDate && endDate),
  });
}
