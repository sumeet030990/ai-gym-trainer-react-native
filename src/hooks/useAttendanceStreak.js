import { useQuery } from '@tanstack/react-query';
import { getAttendance } from '../services/api/attendance.api';

// Consecutive days checked in, counting back from today (or yesterday, so a
// streak doesn't reset to 0 before today's check-in happens).
function computeStreak(records) {
  const days = new Set(records.map((record) => record.attendance_date.slice(0, 10)));
  const cursor = new Date();
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useAttendanceStreak(userId) {
  const query = useQuery({
    queryKey: ['attendance', userId],
    queryFn: async () => {
      const result = await getAttendance(userId);
      if (!result.ok) throw new Error(result.message);
      return result.data ?? [];
    },
    enabled: Boolean(userId),
  });

  return { ...query, data: query.data ? { streak: computeStreak(query.data) } : undefined };
}
