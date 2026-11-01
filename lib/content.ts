// Everything here is language-neutral: images, links, prices and proper names.
// All wording lives in i18n/en.json and i18n/vi.json. List entries there follow
// the same order as the lists here. Scafe, its people, address and press are
// placeholders: replace them with the real bar's details.
import type en from "@/i18n/en.json";

type Dictionary = typeof en;

export const site = {
  name: "Scafe",
  email: "hello@scafe.example",
  timeZone: "America/New_York",
};

const navLinks = [
  { key: "menu", href: "/menu" },
  { key: "about", href: "/about" },
  { key: "crew", href: "/crew" },
  { key: "nights", href: "/nights" },
  { key: "press", href: "/press" },
] as const;

export const socials = [
  { label: "instagram", href: "https://www.instagram.com/" },
  { label: "tiktok", href: "https://www.tiktok.com/" },
  { label: "spotify", href: "https://open.spotify.com/" },
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
  { name: "Tanqueray", logo: "/images/brands/tanqueray.png" },
  { name: "Absolut", logo: "/images/brands/absolut.svg" },
  { name: "Grey Goose", logo: "/images/brands/greygoose.svg" },
  { name: "Belvedere", logo: "/images/brands/belvedere.svg" },
  { name: "Bacardi", logo: "/images/brands/bacardi.svg" },
  { name: "Havana Club", logo: "/images/brands/havanaclub.png" },
  { name: "Malibu", logo: "/images/brands/malibu.png" },
  { name: "Jose Cuervo", logo: "/images/brands/josecuervo.svg" },
  { name: "Johnnie Walker", logo: "/images/brands/johnniewalker.svg" },
  { name: "Glenfiddich", logo: "/images/brands/glenfiddich.svg" },
  { name: "The Macallan", logo: "/images/brands/macallan.svg" },
  { name: "Wild Turkey", logo: "/images/brands/wildturkey.png" },
  { name: "Hennessy", logo: "/images/brands/hennessy.svg" },
  { name: "Martell", logo: "/images/brands/martell.svg" },
  { name: "Rémy Martin", logo: "/images/brands/remymartin.png" },
  { name: "Campari", logo: "/images/brands/campari.png" },
  { name: "Aperol", logo: "/images/brands/aperol.svg" },
  { name: "Martini", logo: "/images/brands/martini.png" },
  { name: "Jägermeister", logo: "/images/brands/jagermeister.png" },
  { name: "Baileys", logo: "/images/brands/baileys.png" },
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

const nightEvents = [
  { title: "Vinyl Thursdays", image: "/images/taps-room.webp" },
  { title: "The Blind Pour", image: "/images/glass-stack.webp" },
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
  signatures: signatureDrinks.map((drink, index) => ({ ...drink, ...t.menu.signatures[index] })),
  menus: {
    evening: joinMenu(t.menu.evening.groups, eveningDetails),
    morning: joinMenu(t.menu.morning.groups, morningDetails),
  },
  pillars: pillarImages.map((image, index) => ({ image, ...t.about.pillars[index] })),
  partners: partnerNames.map((name, index) => ({ name, text: t.about.partners.list[index] })),
  nights: nightEvents.map((night, index) => ({ ...night, ...t.nights.events[index] })),
  articles: articleEntries.map((article) => ({ ...article, ...t.articles[article.slug] })),
  pressHighlights: highlightEntries.map((item, index) => ({ ...item, title: t.press.highlights[index] })),
});

export type Content = ReturnType<typeof buildContent>;
