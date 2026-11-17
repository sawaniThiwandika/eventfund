// Event dates come from the API as "YYYY-MM-DD" (no time zone).
// Build a local date from the parts so the day never shifts because of time zones.

function toLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** "17 Nov 2026" */
export function formatDate(isoDate: string): string {
  return toLocalDate(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "Tuesday, 17 November 2026" */
export function formatLongDate(isoDate: string): string {
  return toLocalDate(isoDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Day number and short month, for the date tile on event cards. */
export function dateParts(isoDate: string): { day: string; month: string } {
  const date = toLocalDate(isoDate)
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-GB', { month: 'short' }),
  }
}
