// Pure date-range helpers for the Attendance filters (15 days / month / year / custom).
// All ranges are inclusive and capped at "today" so future dates are never requested.

function pad(value) {
  return String(value).padStart(2, '0');
}

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function last15DaysRange() {
  const end = startOfDay(new Date());
  const start = startOfDay(new Date());
  start.setDate(start.getDate() - 14);
  return { startDate: toDateString(start), endDate: toDateString(end), label: 'Last 15 Days' };
}

export function monthRange(monthDate) {
  const today = startOfDay(new Date());
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const start = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const end = lastDayOfMonth > today ? today : lastDayOfMonth;
  const label = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return { startDate: toDateString(start), endDate: toDateString(end), label };
}

export function yearRange(year) {
  const today = startOfDay(new Date());
  const start = new Date(year, 0, 1);
  const lastDayOfYear = new Date(year, 11, 31);
  const end = lastDayOfYear > today ? today : lastDayOfYear;
  return { startDate: toDateString(start), endDate: toDateString(end), label: String(year) };
}

export function customRange(start, end) {
  if (!start || !end) return null;
  const label = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  return { startDate: toDateString(start), endDate: toDateString(end), label };
}

// Resolves a filter descriptor ({ mode, monthDate, yearValue, customStart, customEnd })
// into the { startDate, endDate, label } shape the attendance API/hook expects.
export function resolveAttendanceFilter(filter) {
  switch (filter.mode) {
    case 'month':
      return monthRange(filter.monthDate);
    case 'year':
      return yearRange(filter.yearValue);
    case 'custom':
      return customRange(filter.customStart, filter.customEnd) ?? last15DaysRange();
    case 'last15':
    default:
      return last15DaysRange();
  }
}

export function defaultAttendanceFilter() {
  const today = new Date();
  return {
    mode: 'last15',
    monthDate: today,
    yearValue: today.getFullYear(),
    customStart: null,
    customEnd: null,
  };
}
