// The weekly deals from the bar's S...LAY DAY post. Days: 0 is Sunday. Times are 24-hour
// and compare as text, in the bar's own time zone. Names and posters are the bar's own.
export const OFFERS = [
  { id: "morning", name: "S...TART DAY", image: "/images/discount/mon.jpg", days: [1], start: "09:00", end: "17:00" },
  { id: "earlyEvening", name: "S...MILE HOUR", image: "/images/discount/happy-hour.jpg", days: [1, 2, 3, 4], start: "17:00", end: "20:00" },
  { id: "snack", name: "S...AY DAY", image: "/images/discount/thu.jpg", days: [4], start: "09:00", end: "24:00" },
  { id: "bespoke", name: "S...LAY DAY", image: "/images/discount/sun.jpg", days: [0], start: "09:00", end: "24:00" },
] as const;

export type Offer = (typeof OFFERS)[number];
export type OfferId = Offer["id"];

export const OFFER_POSTERS = OFFERS.map((offer) => offer.image);

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const clock = (timeZone: string, now: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return { day: (WEEKDAYS as readonly string[]).indexOf(part("weekday")), time: `${part("hour")}:${part("minute")}` };
};

const onDay = (offer: Offer, day: number) => (offer.days as readonly number[]).includes(day);

export function activeOffers(timeZone: string, now = new Date()): OfferId[] {
  const { day, time } = clock(timeZone, now);
  return OFFERS.filter((offer) => onDay(offer, day) && time >= offer.start && time < offer.end).map((offer) => offer.id);
}

// Today's deals that are still to come or running, for the popup.
export function todaysOffers(timeZone: string, now = new Date()): Offer[] {
  const { day, time } = clock(timeZone, now);
  return OFFERS.filter((offer) => onDay(offer, day) && time < offer.end);
}
