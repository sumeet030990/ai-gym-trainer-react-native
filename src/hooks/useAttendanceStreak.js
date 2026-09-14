import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAttendance, getAttendance } from '../services/api/attendance.api';

// Consecutive days checked in, counting back from today (or yesterday, so a
// streak doesn't reset to 0 before today's check-in happens).
function computeStreak(days) {
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

  if (!query.data) return { ...query, data: undefined };
  console.log('query.data: ', query.data);

  const days = new Set(query.data.map((record) => record.attendance_date.slice(0, 10)));
  console.log('days: ', days);
  const hasCheckedInToday = days.has(new Date().toISOString().slice(0, 10));
  console.log('new Date().toISOString().slice(0, 10): ', new Date().toISOString().slice(0, 10));
  console.log('hasCheckedInToday: ', hasCheckedInToday);

  return { ...query, data: { streak: computeStreak(days), hasCheckedInToday } };
}

// Logs a gym check-in and refreshes any attendance history/streak queries so they pick it up.
export function useLogAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await createAttendance();
      if (!result.ok) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
