// Everything here is language-neutral: images, links, prices and proper names.
// All wording lives in i18n/en.json and i18n/vi.json. List entries there follow
// the same order as the lists here. Scafe, its people, address and press are
// placeholders: replace them with the real bar's details.
import type en from "@/i18n/en.json";

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

const joinMenu = (groups: MenuGroup[], details: MenuDetail[][]) =>
  groups.map((group, groupIndex) => ({
    title: group.title,
    items: group.items.map((item, itemIndex) => ({ ...item, ...details[groupIndex][itemIndex] })),
  }));

const pillarImages = ["/images/shaker.webp", "/images/back-bar.webp", "/images/snug.webp"];

const partnerNames = [
  "Ember & Oak Distillery",
  "Saltline Botanicals",
  "Copper Moth Records",
  "Slow Comet Roasters",
];

// Posters and details come from the bar's own Instagram posts, newest first.
// A date (YYYY-MM-DD) makes a night eligible for the promo popup.
const nightEntries: { image: string; date?: string }[] = [
  { image: "/images/events/jam.webp", date: "2026-10-31" },
  { image: "/images/events/coraline.webp", date: "2026-10-30" },
  { image: "/images/events/mood.webp", date: "2026-10-23" },
  { image: "/images/events/howl.webp", date: "2026-10-16" },
  { image: "/images/events/slay.webp" },
];

export const categories = ["behindTheBar", "press", "drinks"] as const;

type Category = (typeof categories)[number];

const articleEntries: {
  slug: keyof Dictionary["articles"];
  date: string;
  author: string;
  category: Category;
  image: string;
}[] = [
  { slug: "the-ice-program", date: "07.10.2026", author: site.name, category: "behindTheBar", image: "/images/glass-stack.webp" },
  { slug: "last-ember-joins-the-list", date: "02.09.2026", author: site.name, category: "drinks", image: "/images/whisky.webp" },
  { slug: "six-years-of-red-hour", date: "01.09.2026", author: site.name, category: "drinks", image: "/images/pour.webp" },
  { slug: "city-guide-names-scafe", date: "28.08.2026", author: site.name, category: "press", image: "/images/taps-room.webp" },
  { slug: "meet-the-barrel", date: "31.05.2026", author: site.name, category: "behindTheBar", image: "/images/old-taps.webp" },
  { slug: "a-room-with-low-light", date: "20.07.2025", author: site.name, category: "press", image: "/images/snug.webp" },
];

export const articleSlugs = articleEntries.map((article) => article.slug);

const highlightEntries = [
  { date: "09.08.2026", author: site.name, image: "/images/snug.webp", href: "/press/a-room-with-low-light" },
  { date: "14.07.2026", author: site.name, image: "/images/back-bar.webp", href: "/press/city-guide-names-scafe" },
];

// Joins the neutral data above with one language's wording.
export const buildContent = (t: Dictionary) => ({
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
  signatures: signatureDrinks.map((drink, index) => ({ ...drink, ...t.menu.signatures[index] })),
  menus: {
    evening: joinMenu(t.menu.evening.groups, eveningDetails),
    morning: joinMenu(t.menu.morning.groups, morningDetails),
  },
  pillars: pillarImages.map((image, index) => ({ image, ...t.about.pillars[index] })),
  partners: partnerNames.map((name, index) => ({ name, text: t.about.partners.list[index] })),
  nights: nightEntries.map((night, index) => ({ ...night, ...t.nights.events[index] })),
  articles: articleEntries.map((article) => ({ ...article, ...t.articles[article.slug] })),
  pressHighlights: highlightEntries.map((item, index) => ({ ...item, title: t.press.highlights[index] })),
});

export type Content = ReturnType<typeof buildContent>;
