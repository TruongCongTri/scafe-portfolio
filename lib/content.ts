// Everything here is language-neutral: images, links, prices and proper names.
// All wording lives in i18n/en.json and i18n/vi.json. List entries there follow
// the same order as the lists here. Scafe, its people, address and press are
// placeholders: replace them with the real bar's details.
import type { Locale } from "@/i18n/config";
import type en from "@/i18n/en.json";
import type { Catalog, MenuName } from "./catalog";
import { OFFER_POSTERS } from "./offers";
import { poster, type Poster } from "./posters";

type Dictionary = typeof en;

export const site = {
  name: "Scafe",
  // Set NEXT_PUBLIC_SITE_URL to the live domain: canonical links and the sitemap use it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://scafe.example",
  email: "hello@scafe.example",
  timeZone: "Asia/Ho_Chi_Minh",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1647.8465154263454!2d106.68438769438231!3d10.791264980143445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752916755d6ef9%3A0xbb800b91d5b8f89f!2zU-KApiBDYWZlIEJhcg!5e0!3m2!1sen!2s!4v1793515406090!5m2!1sen!2s",
};

const navLinks = [
  { key: "menu", href: "/menu" },
  { key: "about", href: "/about" },
  { key: "crew", href: "/crew" },
  { key: "nights", href: "/nights" },
  { key: "press", href: "/press" },
] as const;

export const socials = [
  { label: "facebook", href: "https://www.facebook.com/profile.php?id=61591109050358" },
  { label: "instagram", href: "https://www.instagram.com/scafe.bar/" },
  { label: "threads", href: "https://www.threads.com/@scafe.bar" },
];

const heroImages = [
  "/images/pour.webp",
  "/images/whisky.webp",
  "/images/bottle-rack.webp",
  "/images/shelf.webp",
  "/images/ice-gin.webp",
  "/images/old-fashioned.webp",
];

const brandLogos = [
  { name: "Tanqueray", logo: "/images/brands/tanqueray.webp" },
  { name: "Absolut", logo: "/images/brands/absolut.svg" },
  { name: "Grey Goose", logo: "/images/brands/greygoose.webp" },
  { name: "Belvedere", logo: "/images/brands/belvedere.svg" },
  { name: "Bacardi", logo: "/images/brands/bacardi.webp" },
  { name: "Havana Club", logo: "/images/brands/havanaclub.webp" },
  { name: "Malibu", logo: "/images/brands/malibu.webp" },
  { name: "Jose Cuervo", logo: "/images/brands/josecuervo.webp" },
  { name: "Johnnie Walker", logo: "/images/brands/johnniewalker.webp" },
  { name: "Glenfiddich", logo: "/images/brands/glenfiddich.svg" },
  { name: "The Macallan", logo: "/images/brands/macallan.svg" },
  { name: "Wild Turkey", logo: "/images/brands/wildturkey.webp" },
  { name: "Hennessy", logo: "/images/brands/hennessy.webp" },
  { name: "Martell", logo: "/images/brands/martell.webp" },
  { name: "Rémy Martin", logo: "/images/brands/remymartin.webp" },
  { name: "Campari", logo: "/images/brands/campari.webp" },
  { name: "Aperol", logo: "/images/brands/aperol.svg" },
  { name: "Martini", logo: "/images/brands/martini.webp" },
  { name: "Jägermeister", logo: "/images/brands/jagermeister.png" },
  { name: "Baileys", logo: "/images/brands/baileys.webp" },
  { name: "Grand Marnier", logo: "/images/brands/grandmarnier.svg" },
];

// Unnamed entries show their role as the headline. Only Gia Hân has a real photo so far.
const leadPeople: { name?: string; image: string }[] = [
  { name: "Hà Ngọc Trâm", image: "/images/old-fashioned.webp" },
  { name: "Gia Hân", image: "/images/crews/han.jpg" },
  { name: "TBD", image: "/images/espresso.webp" },
  { image: "/images/shelf.webp" },
];

// `focus` keeps each portrait photo's glass in frame on a wide stage.
// Supporting crew, in list order. The page shows up to MAX_SUPPORT of them.
const supportNames = [...Array<string>(18).fill("TBD"), "Công Trí"];

const MAX_SUPPORT = 19;

// One drink per row, repeating if the list ever outgrows it.
const supportImages = [
  "/images/drinks/ssspicy.jpg",
  "/images/drinks/tbd.jpg",
  "/images/drinks/b52.jpg",
  "/images/menu-drinks/negroni.webp",
  "/images/menu-drinks/mojito.webp",
  "/images/menu-drinks/aperol-spritz.webp",
  "/images/menu-drinks/margarita.webp",
  "/images/menu-drinks/paloma.webp",
  "/images/menu-drinks/mai-tai.webp",
  "/images/menu-drinks/whisky-sour.webp",
  "/images/menu-drinks/gin-fizz.webp",
  "/images/menu-drinks/aviation.webp",
  "/images/menu-drinks/clover-club.webp",
  "/images/menu-drinks/midori-sour.webp",
  "/images/menu-drinks/sidecar.webp",
  "/images/menu-drinks/pina-colada.webp",
  "/images/menu-drinks/tequila-sunrise.webp",
  "/images/menu-drinks/godfather.webp",
  "/images/menu-drinks/mimosa.webp",
];

const signatureDrinks = [
  { title: "SSSPICY", image: "/images/drinks/ssspicy.jpg", focus: "50% 62%" },
  { title: "TBD", image: "/images/drinks/tbd.jpg", focus: "50% 38%" },
  { title: "B52", image: "/images/drinks/b52.jpg", focus: "50% 38%" },
];

type MenuDetail = { price: string; image?: string };
type MenuGroup = { title: string; items: { name: string; note?: string }[] };

// Prices are as printed, in thousands of dong. Groups and items follow the order of
// menu.evening and menu.morning in the language files.
const eveningDetails: MenuDetail[][] = [
  [{ price: "250", image: "/images/menu-drinks/sweeet.webp" }, { price: "250", image: "/images/menu-drinks/sourrr.webp" }, { price: "250", image: "/images/drinks/ssspicy.jpg" }, { price: "230", image: "/images/shaker.webp" }, { price: "250", image: "/images/menu-drinks/altos-margarita.webp" }, { price: "250", image: "/images/menu-drinks/jameson-ginger-lime.webp" }],
  [{ price: "179", image: "/images/menu-drinks/godfather.webp" }, { price: "179", image: "/images/menu-drinks/boulevardier.webp" }, { price: "179", image: "/images/old-fashioned.webp" }, { price: "179", image: "/images/menu-drinks/whisky-sour.webp" }],
  [{ price: "179", image: "/images/menu-drinks/aviation.webp" }, { price: "179", image: "/images/menu-drinks/negroni.webp" }, { price: "179", image: "/images/menu-drinks/clover-club.webp" }, { price: "179", image: "/images/menu-drinks/gin-fizz.webp" }],
  [{ price: "179", image: "/images/menu-drinks/margarita.webp" }, { price: "179", image: "/images/menu-drinks/paloma.webp" }, { price: "179", image: "/images/whisky.webp" }, { price: "179", image: "/images/menu-drinks/tequila-sunrise.webp" }],
  [{ price: "179", image: "/images/menu-drinks/mojito.webp" }, { price: "179", image: "/images/menu-drinks/daiquiri.webp" }, { price: "179", image: "/images/menu-drinks/pina-colada.webp" }, { price: "179", image: "/images/menu-drinks/mai-tai.webp" }, { price: "179", image: "/images/menu-drinks/kingston-negroni.webp" }],
  [{ price: "179", image: "/images/espresso.webp" }, { price: "179", image: "/images/menu-drinks/pornstar-martini.webp" }, { price: "179", image: "/images/menu-drinks/wet-pussy.webp" }, { price: "179", image: "/images/menu-drinks/kamikaze.webp" }],
  [{ price: "179", image: "/images/menu-drinks/sidecar.webp" }, { price: "179", image: "/images/menu-drinks/french-connection.webp" }],
  [{ price: "179", image: "/images/menu-drinks/midori-sour.webp" }, { price: "179", image: "/images/menu-drinks/toblerone.webp" }, { price: "179", image: "/images/menu-drinks/mimosa.webp" }, { price: "179", image: "/images/menu-drinks/japanese-slipper.webp" }, { price: "179", image: "/images/menu-drinks/aperol-spritz.webp" }],
  [{ price: "99", image: "/images/drinks/b52.jpg" }, { price: "99", image: "/images/glass-stack.webp" }, { price: "99", image: "/images/glass-stack.webp" }, { price: "99", image: "/images/glass-stack.webp" }],
  [{ price: "65" }, { price: "65" }, { price: "65" }, { price: "65" }, { price: "65" }, { price: "65" }],
  [{ price: "59" }, { price: "69" }, { price: "69" }],
];

const morningDetails: MenuDetail[][] = [
  [{ price: "30" }, { price: "35" }, { price: "42" }, { price: "42" }, { price: "45" }, { price: "48" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "40" }, { price: "45" }, { price: "50" }],
  [{ price: "60" }, { price: "60" }, { price: "62" }, { price: "62" }, { price: "62" }, { price: "65" }],
  [{ price: "60" }, { price: "62" }, { price: "62" }, { price: "62" }, { price: "65" }, { price: "65" }],
  [{ price: "40" }, { price: "60" }, { price: "60" }, { price: "60" }, { price: "60" }, { price: "60" }, { price: "60" }],
  [{ price: "45" }, { price: "45" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "50" }, { price: "70" }],
  [{ price: "40" }, { price: "40" }, { price: "50" }],
  [{ price: "7" }, { price: "10" }, { price: "10" }, { price: "15" }, { price: "15" }, { price: "15" }],
];

export type MenuItem = MenuDetail & { id: string; name: string; note?: string; active: boolean; added: boolean };

// Every drink with its status: built-in ones first, then the manager's additions.
const joinMenu = (menu: MenuName, groups: MenuGroup[], details: MenuDetail[][], locale: Locale, catalog: Catalog) =>
  groups.map((group, groupIndex) => {
    const builtIn = group.items.map((item, itemIndex): MenuItem => {
      const id = `${menu}-${groupIndex}-${itemIndex}`;
      return { ...item, ...details[groupIndex][itemIndex], id, active: !catalog.inactiveDrinks.includes(id), added: false };
    });
    const added = catalog.addedDrinks
      .filter((drink) => drink.menu === menu && drink.group === groupIndex)
      .map((drink): MenuItem => ({
        ...drink[locale],
        id: drink.id,
        price: drink.price,
        image: drink.image,
        active: !catalog.inactiveDrinks.includes(drink.id),
        added: true,
      }));
    return { title: group.title, items: [...builtIn, ...added] };
  });

export type NightEvent = {
  id: string;
  image: string;
  // The card image with its size, and every poster for the event's own page.
  cover: Poster;
  posters: Poster[];
  date?: string;
  time?: string;
  title: string;
  heading: string;
  text: string;
  notes: string[];
  active: boolean;
  added: boolean;
};

// Newest first, with undated events like the weekly deals after them.
const joinEvents = (t: Dictionary, locale: Locale, catalog: Catalog) =>
  [
    ...nightEntries.map(({ images, ...night }, index): NightEvent => ({
      ...t.nights.events[index],
      ...night,
      cover: poster(night.image),
      posters: (images ?? [night.image]).map((src) => poster(src)),
      active: !catalog.inactiveEvents.includes(night.id),
      added: false,
    })),
    ...catalog.addedEvents.map((event): NightEvent => {
      const cover = poster(event.image, event.imageSize);
      return {
        ...event[locale],
        id: event.id,
        image: event.image,
        cover,
        posters: [cover],
        date: event.date,
        time: event.time,
        active: !catalog.inactiveEvents.includes(event.id),
        added: true,
      };
    }),
  ]
    .filter((event) => !catalog.removedEvents.includes(event.id))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const pillarImages = ["/images/shaker.webp", "/images/back-bar.webp", "/images/snug.webp"];

const partnerNames = [
  "Ember & Oak Distillery",
  "Saltline Botanicals",
  "Copper Moth Records",
  "Slow Comet Roasters",
];

// Posters and details come from the bar's own Instagram posts, newest first.
// A date (YYYY-MM-DD) makes a night eligible for the promo popup.
const nightEntries: { id: string; image: string; images?: readonly string[]; date?: string }[] = [
  { id: "jam", image: "/images/events/jam.webp", date: "2026-10-31" },
  { id: "coraline", image: "/images/events/coraline.webp", date: "2026-10-30" },
  { id: "mood", image: "/images/events/mood.webp", date: "2026-10-23" },
  { id: "howl", image: "/images/events/howl.webp", date: "2026-10-16" },
  { id: "slay", image: "/images/events/slay.webp", images: OFFER_POSTERS },
];

export const categories = ["news", "behindTheBar", "press", "drinks"] as const;

type Category = (typeof categories)[number];

const articleEntries: {
  slug: keyof Dictionary["articles"];
  date: string;
  author: string;
  category: Category;
  image: string;
  // Every photo for the article's own page, when there's more than the cover.
  images?: readonly string[];
  // Placeholder stories: kept out of search until real ones replace them.
  sample?: boolean;
}[] = [
  { slug: "how-to-find-scafe", date: "13.10.2026", author: site.name, category: "news", image: "/images/press/how-to-find.webp" },
  {
    slug: "grand-opening",
    date: "13.10.2026",
    author: site.name,
    category: "behindTheBar",
    image: "/images/press/grand-opening.webp",
    images: ["/images/press/grand-opening.webp", "/images/press/grand-opening.jpg"],
  },
  { slug: "soft-opening", date: "13.10.2026", author: site.name, category: "behindTheBar", image: "/images/press/soft-opening.webp" },
  { slug: "weekly-deals", date: "17.08.2026", author: site.name, category: "news", image: "/images/events/slay.webp", images: OFFER_POSTERS },
  { slug: "the-ice-program", date: "07.10.2026", author: site.name, category: "behindTheBar", image: "/images/glass-stack.webp", sample: true },
  { slug: "last-ember-joins-the-list", date: "02.09.2026", author: site.name, category: "drinks", image: "/images/whisky.webp", sample: true },
  { slug: "six-years-of-red-hour", date: "01.09.2026", author: site.name, category: "drinks", image: "/images/pour.webp", sample: true },
  { slug: "city-guide-names-scafe", date: "28.08.2026", author: site.name, category: "press", image: "/images/taps-room.webp", sample: true },
  { slug: "meet-the-barrel", date: "31.05.2026", author: site.name, category: "behindTheBar", image: "/images/old-taps.webp", sample: true },
  { slug: "a-room-with-low-light", date: "20.07.2025", author: site.name, category: "press", image: "/images/snug.webp", sample: true },
];

export const nightIds = nightEntries.map((night) => night.id);

export const articleSlugs = articleEntries.map((article) => article.slug);
export const realArticleSlugs = articleEntries.filter((article) => !article.sample).map((article) => article.slug);

const highlightEntries = [
  { date: "13.10.2026", author: site.name, image: "/images/press/grand-opening.webp", href: "/press/grand-opening" },
  { date: "17.08.2026", author: site.name, image: "/images/events/slay.webp", href: "/press/weekly-deals" },
];

// Joins the neutral data above with one language's wording.
const allMenus = (t: Dictionary, locale: Locale, catalog: Catalog) => ({
  evening: joinMenu("evening", t.menu.evening.groups, eveningDetails, locale, catalog),
  morning: joinMenu("morning", t.menu.morning.groups, morningDetails, locale, catalog),
});

const publicGroups = (groups: ReturnType<typeof joinMenu>) =>
  groups
    .map((group) => ({ ...group, items: group.items.filter((item) => item.active) }))
    .filter((group) => group.items.length);

// The manager sees everything, including what's hidden from the public.
export const buildManageData = (t: Dictionary, locale: Locale, catalog: Catalog) => ({
  menus: allMenus(t, locale, catalog),
  events: joinEvents(t, locale, catalog),
});

export type ManageData = ReturnType<typeof buildManageData>;

export const buildContent = (t: Dictionary, locale: Locale, catalog: Catalog) => {
  const menus = allMenus(t, locale, catalog);
  const hiddenDrinks = menus.evening.flatMap((group) => group.items.filter((item) => !item.active).map((item) => item.name));

  return {
  nav: navLinks.map((item) => ({ href: item.href, label: t.nav[item.key] })),
  heroReel: heroImages.map((src, index) => ({ src, alt: t.home.hero.reelAlts[index] })),
  brands: brandLogos.map((brand, index) => ({ ...brand, ...t.home.pours.brands[index] })),
  leads: leadPeople.map((lead, index) => {
    const role = t.people.leads[index];
    return { image: lead.image, name: lead.name ?? role, role: lead.name && role };
  }),
  support: supportNames.slice(0, MAX_SUPPORT).map((name, index) => ({
    name,
    role: t.people.support,
    image: supportImages[index % supportImages.length],
  })),
  signatures: signatureDrinks
    .map((drink, index) => ({ ...drink, ...t.menu.signatures[index] }))
    .filter((drink) => !hiddenDrinks.includes(drink.title)),
  menus: { evening: publicGroups(menus.evening), morning: publicGroups(menus.morning) },
  pillars: pillarImages.map((image, index) => ({ image, ...t.about.pillars[index] })),
  partners: partnerNames.map((name, index) => ({ name, text: t.about.partners.list[index] })),
  nights: joinEvents(t, locale, catalog).filter((event) => event.active),
  articles: articleEntries.map(({ images, ...article }) => ({
    ...article,
    ...t.articles[article.slug],
    posters: (images ?? [article.image]).map((src) => poster(src)),
  })),
  pressHighlights: highlightEntries.map((item, index) => ({ ...item, title: t.press.highlights[index] })),
  };
};

export type Content = ReturnType<typeof buildContent>;
