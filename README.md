# Scafe

Marketing site for a cocktail bar, built with Next.js, GSAP, Lenis and Swiper.

```bash
npm install
npm run dev
```

- `lib/content.ts` holds all copy, people, drinks and articles. Everything in it is placeholder content.
- `lib/scene.ts` holds the scroll system. Scene lengths are set per page in each `page.css`.
- `app/global.css` holds tokens and shared rules. Colours come from `public/images/scafe.jpg`; the vector logo is traced from it into `components/ui/logoPaths.ts` and `public/images/scafe-logo.svg`. Every page and component has its own `.css` file next to it.
- `public/images/CREDITS.md` lists the source and license of each photo.
