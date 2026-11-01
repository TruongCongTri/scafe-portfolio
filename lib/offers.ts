// The weekly deals from the bar's S...LAY DAY post. Days: 0 is Sunday. Times are 24-hour
// and compare as text, in the bar's own time zone.
export const OFFERS = [
  { id: "morning", days: [1], start: "09:00", end: "17:00" },
  { id: "earlyEvening", days: [1, 2, 3, 4], start: "17:00", end: "20:00" },
  { id: "snack", days: [4], start: "09:00", end: "24:00" },
  { id: "bespoke", days: [0], start: "09:00", end: "24:00" },
] as const;

export type OfferId = (typeof OFFERS)[number]["id"];

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function activeOffers(timeZone: string, now = new Date()): OfferId[] {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  const day = (WEEKDAYS as readonly string[]).indexOf(part("weekday"));
  const time = `${part("hour")}:${part("minute")}`;

  return OFFERS.filter(
    (offer) => (offer.days as readonly number[]).includes(day) && time >= offer.start && time < offer.end
  ).map((offer) => offer.id);
}
