// Events this many days after the next one are promoted alongside it.
const CLOSE_DAYS = 3;

export const todayIn = (timeZone: string, now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

const dayNumber = (date: string) => Date.parse(`${date}T00:00:00Z`) / 86400000;

// Dates are YYYY-MM-DD, so they sort and compare as plain text.
export function pickEvents<T extends { date?: string }>(events: T[], today: string) {
  const dated = events
    .filter((event): event is T & { date: string } => Boolean(event.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = dated.filter((event) => event.date >= today);

  if (!upcoming.length) return { upcoming: false, events: dated.slice(-1) };

  const first = dayNumber(upcoming[0].date);
  return {
    upcoming: true,
    events: upcoming.filter((event) => dayNumber(event.date) - first <= CLOSE_DAYS),
  };
}
