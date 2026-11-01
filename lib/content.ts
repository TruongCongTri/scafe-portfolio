// All brand copy lives here. Scafe, its people, address and press are
// placeholders: replace them with the real bar's details.

export const site = {
  name: "Scafe",
  tagline: ["Pouring late", "seven nights a week"],
  description:
    "Scafe is an independent cocktail bar in the old town, serving precise drinks, low light and long evenings.",
  address: "17 Ember Alley, Old Town",
  email: "hello@scafe.example",
  timeZone: "America/New_York",
};

export const nav = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Crew", href: "/crew" },
  { label: "Nights", href: "/nights" },
  { label: "Press", href: "/press" },
];

export const socials = [
  { label: "instagram", href: "https://www.instagram.com/" },
  { label: "tiktok", href: "https://www.tiktok.com/" },
  { label: "spotify", href: "https://open.spotify.com/" },
];

export const heroReel = [
  { src: "/images/pour.webp", alt: "A red cocktail being poured into a coupe" },
  { src: "/images/whisky.webp", alt: "Whisky over ice on a dark bar" },
  { src: "/images/bottle-rack.webp", alt: "Glasses hanging over rows of bottles" },
  { src: "/images/shelf.webp", alt: "A crowded back bar lined with bottles" },
  { src: "/images/ice-gin.webp", alt: "Gin and tonic against a dark background" },
  { src: "/images/old-fashioned.webp", alt: "An old fashioned with a cherry" },
];

export const brands = [
  { name: "Tanqueray", logo: "/images/brands/tanqueray.png", type: "Gin", origin: "London" },
  { name: "Absolut", logo: "/images/brands/absolut.svg", type: "Vodka", origin: "Sweden" },
  { name: "Grey Goose", logo: "/images/brands/greygoose.svg", type: "Vodka", origin: "France" },
  { name: "Belvedere", logo: "/images/brands/belvedere.svg", type: "Vodka", origin: "Poland" },
  { name: "Bacardi", logo: "/images/brands/bacardi.svg", type: "Rum", origin: "Caribbean" },
  { name: "Havana Club", logo: "/images/brands/havanaclub.png", type: "Rum", origin: "Cuba" },
  { name: "Malibu", logo: "/images/brands/malibu.png", type: "Coconut rum", origin: "Barbados" },
  { name: "Jose Cuervo", logo: "/images/brands/josecuervo.svg", type: "Tequila", origin: "Jalisco" },
  { name: "Johnnie Walker", logo: "/images/brands/johnniewalker.svg", type: "Blended Scotch", origin: "Scotland" },
  { name: "Glenfiddich", logo: "/images/brands/glenfiddich.svg", type: "Single malt", origin: "Speyside" },
  { name: "The Macallan", logo: "/images/brands/macallan.svg", type: "Single malt", origin: "Speyside" },
  { name: "Wild Turkey", logo: "/images/brands/wildturkey.png", type: "Bourbon", origin: "Kentucky" },
  { name: "Hennessy", logo: "/images/brands/hennessy.svg", type: "Cognac", origin: "France" },
  { name: "Martell", logo: "/images/brands/martell.svg", type: "Cognac", origin: "France" },
  { name: "Rémy Martin", logo: "/images/brands/remymartin.png", type: "Cognac", origin: "France" },
  { name: "Campari", logo: "/images/brands/campari.png", type: "Bitter", origin: "Italy" },
  { name: "Aperol", logo: "/images/brands/aperol.svg", type: "Aperitivo", origin: "Italy" },
  { name: "Martini", logo: "/images/brands/martini.png", type: "Vermouth", origin: "Italy" },
  { name: "Jägermeister", logo: "/images/brands/jagermeister.png", type: "Herbal liqueur", origin: "Germany" },
  { name: "Baileys", logo: "/images/brands/baileys.png", type: "Irish cream", origin: "Ireland" },
  { name: "Grand Marnier", logo: "/images/brands/grandmarnier.svg", type: "Orange liqueur", origin: "France" },
];

export type Member = { name: string; role: string; image: string; pick: string };

export const leads: Member[] = [
  { name: "Mara Voss", role: "Owner & Head Bartender", image: "/images/old-fashioned.webp", pick: "Old fashioned" },
  { name: "Theo Lindqvist", role: "Bar Manager", image: "/images/whisky.webp", pick: "Peated whisky, one rock" },
  { name: "Inés Calloway", role: "Beverage Director", image: "/images/espresso.webp", pick: "Espresso martini" },
  { name: "Jonah Reyes", role: "Head of Service", image: "/images/ice-gin.webp", pick: "Gin and tonic" },
  { name: "Priya Halden", role: "Events Lead", image: "/images/pour.webp", pick: "Negroni" },
  { name: "Sol Whitaker", role: "Co-founder", image: "/images/tall-sour.webp", pick: "Tall sour" },
];

export const crew = [
  ["Alma Trevino", "Senior Bartender"],
  ["Ben Okafor", "Bartender"],
  ["Cleo Marsh", "Bartender"],
  ["Dov Aronson", "Barback"],
  ["Esme Rowan", "Floor Lead"],
  ["Felix Tran", "Bartender"],
  ["Greta Nowak", "Host"],
  ["Hana Ishii", "Prep Lead"],
  ["Ivo Santos", "Barback"],
  ["Juno Pike", "Host"],
  ["Kit Ferreira", "Resident DJ"],
  ["Lena Dubois", "Bookkeeper"],
  ["Milo Grant", "Glassware & Ice"],
  ["Nell Abara", "Floor Staff"],
  ["Oren Vale", "Floor Staff"],
].map(([name, role]) => ({ name, role }));

export const crewImages = [
  "/images/glass-stack.webp",
  "/images/shaker.webp",
  "/images/gin-tonic.webp",
  "/images/mint.webp",
  "/images/espresso-pair.webp",
];

export const signatures = [
  {
    title: "Last Ember",
    tag: "now on the list",
    text: "Smoked rye, burnt orange and a slow stir over one clear rock. It arrives under a glass dome and leaves the whole bar asking what you ordered. Nobody makes it quite like us, because nobody else is this stubborn.",
    image: "/images/whisky.webp",
  },
  {
    title: "Red Hour",
    tag: "six seasons running",
    text: "Bitter, bright and dangerously easy. Our house aperitivo blend changes with the citrus, but it has opened the evening here for six years straight, and the regulars will tell you when we get it wrong.",
    image: "/images/pour.webp",
  },
  {
    title: "The Night Shift",
    tag: "guest favourite",
    text: "Cold-brewed espresso, dark rum and a whisper of salt. Built for the second wind, shaken hard and served with three beans. Every round is a small negotiation with tomorrow morning.",
    image: "/images/espresso-pair.webp",
  },
];

export const collection = [
  { title: "Clear Tide", image: "/images/ice-gin.webp", price: "$16" },
  { title: "Garden Party", image: "/images/mint.webp", price: "$15" },
  { title: "Old Marrow", image: "/images/old-fashioned.webp", price: "$17" },
  { title: "Lime & Bitter Truth", image: "/images/gin-tonic.webp", price: "$14" },
  { title: "Long Way Home", image: "/images/tall-sour.webp", price: "$15" },
  { title: "Dark Roast", image: "/images/espresso.webp", price: "$16" },
  { title: "Top Shelf Flight", image: "/images/shelf.webp", price: "$28" },
  { title: "Draught of the Week", image: "/images/old-taps.webp", price: "$9" },
  { title: "Bartender's Choice", image: "/images/shaker.webp", price: "$18" },
  { title: "Juniper Reserve", image: "/images/bottle-rack.webp", price: "$19" },
];

export const pillars = [
  {
    title: ["Serious", "drinks"],
    subtitle: "Stir, shake, repeat",
    text: "Scafe is devoted to the small decisions behind a great drink. We test every ratio, cut our own ice and treat each glass as if it were the only one going out tonight.",
    image: "/images/shaker.webp",
  },
  {
    title: ["Serious", "welcome"],
    subtitle: "Unforgettable evenings",
    text: "We believe a bar is only as good as how it makes you feel. Your name gets remembered, your usual gets noticed, and nobody who walks in alone stays that way for long.",
    image: "/images/back-bar.webp",
  },
  {
    title: ["Serious", "room"],
    subtitle: "A place that holds you",
    text: "Dark wood, warm lamps and a record that was chosen on purpose. The room is built to slow you down, so one drink quietly becomes the best part of your week.",
    image: "/images/snug.webp",
  },
];

export const partners = [
  { name: "Ember & Oak Distillery", text: "A small-batch rye made to our spec, aged in barrels we picked ourselves and poured nowhere else in town." },
  { name: "Saltline Botanicals", text: "Coastal herbs and citrus from one family farm, in season and delivered the same morning they are picked." },
  { name: "Copper Moth Records", text: "Our resident selectors, who fill the listening corner with rare vinyl every Thursday and Sunday night." },
  { name: "Slow Comet Roasters", text: "The single-origin beans behind The Night Shift, roasted a few streets away and ground to order." },
];

export const nights = [
  {
    title: "Vinyl Thursdays",
    heading: "Bring a record. Leave a legend.",
    text: "Every Thursday the decks open to anyone with a story and a seven-inch. Sign up for a fifteen-minute slot, and the crew will pour for whoever clears the floor or fills it.",
    notes: ["From 8pm, every Thursday", "Vinyl only, no playlists", "Selectors drink on the house"],
    image: "/images/taps-room.webp",
  },
  {
    title: "The Blind Pour",
    heading: "Think you know your rye from your bourbon?",
    text: "Six glasses, no labels and a table of equally overconfident strangers. Our monthly tasting league is open to teams of two, and the winners get their name on the wall until someone takes it down.",
    notes: ["First Monday of the month", "Teams of two", "Limited to twelve teams"],
    image: "/images/glass-stack.webp",
  },
];

export type Article = {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: "Behind The Bar" | "Press" | "Drinks";
  image: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "the-ice-program",
    title: "Inside Our Obsessive New Ice Program",
    date: "07.10.2026",
    author: "Inés Calloway",
    category: "Behind The Bar",
    image: "/images/glass-stack.webp",
    body: [
      "Clear ice is a slow business. Our new freezer works from the bottom up, pushing air and impurities away for three days before we cut a single block by hand.",
      "The result melts more slowly, looks better in the glass and lets a stirred drink stay itself for longer. It is also, we admit, a little ridiculous. We are keeping it.",
    ],
  },
  {
    slug: "last-ember-joins-the-list",
    title: "“Last Ember” Joins the House List",
    date: "02.09.2026",
    author: "Mara Voss",
    category: "Drinks",
    image: "/images/whisky.webp",
    body: [
      "After eleven versions and one small incident with the smoke gun, Last Ember has earned its place at the top of the list.",
      "It is built on our private rye barrel, finished with burnt orange and stirred until the room goes quiet. Come and tell us if we got it right.",
    ],
  },
  {
    slug: "six-years-of-red-hour",
    title: "Six Years of Red Hour",
    date: "01.09.2026",
    author: "Theo Lindqvist",
    category: "Drinks",
    image: "/images/pour.webp",
    body: [
      "It started as a way to fill the quiet hour before eight. Six years later, Red Hour is the reason people leave work on time.",
      "This autumn the aperitivo blend shifts to blood orange. The price, the playlist and the regulars stay exactly the same.",
    ],
  },
  {
    slug: "city-guide-names-scafe",
    title: "City Guide Names Scafe a Bar to Watch",
    date: "28.08.2026",
    author: "Jonah Reyes",
    category: "Press",
    image: "/images/taps-room.webp",
    body: [
      "We try not to read our own reviews, but this one was pinned to the staff room wall before the ink had dried.",
      "Thanks to everyone who has ever waited patiently for a stirred drink. The compliment belongs to the room as much as the crew.",
    ],
  },
  {
    slug: "meet-the-barrel",
    title: "Meet Our First Private Barrel",
    date: "31.05.2026",
    author: "Mara Voss",
    category: "Behind The Bar",
    image: "/images/old-taps.webp",
    body: [
      "We drove out to Ember & Oak with six samples, two opinions and no intention of agreeing. Five hours later we had picked one barrel.",
      "It makes up the backbone of the rye drinks this year. When it is gone, it is gone.",
    ],
  },
  {
    slug: "a-room-with-low-light",
    title: "A Room With Low Light",
    date: "20.07.2025",
    author: "Sol Whitaker",
    category: "Press",
    image: "/images/snug.webp",
    body: [
      "Nobody ever fell for a bar under fluorescent tubes. A short note on the lamps, the wood and the two years we spent getting the room to feel like nine o'clock.",
    ],
  },
];

export const pressHighlights = [
  { title: "How One Back-Alley Bar Made Waiting Fashionable", date: "09.08.2026", author: "Priya Halden", image: "/images/snug.webp", href: "/press/a-room-with-low-light" },
  { title: "City Guide Names Scafe a Bar to Watch", date: "14.07.2026", author: "Jonah Reyes", image: "/images/back-bar.webp", href: "/press/city-guide-names-scafe" },
];
