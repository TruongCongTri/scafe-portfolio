# Scafe

Marketing site for a cocktail bar, built with Next.js, GSAP, Lenis and Swiper.

```bash
npm install
npm run dev
```

- `lib/content.ts` holds all copy, people, drinks and articles. Everything in it is placeholder content.
- `lib/scene.ts` holds the scroll system. Scene lengths are set per page in each `page.css`.
- `app/[locale]/global.css` holds tokens and shared rules. Colours come from `public/images/scafe.jpg`; the vector logo is traced from it into `components/ui/logoPaths.ts` and `public/images/scafe-logo.svg`. Every page and component has its own `.css` file next to it.
- `public/images/CREDITS.md` lists the source and license of each photo.

## Languages

Routes live under `app/[locale]` (`/vi`, `/en`), and `proxy.ts` redirects unprefixed addresses using the saved choice, then the browser language, then `defaultLocale` in `i18n/config.ts`.

All wording is in `i18n/vi.json` and `i18n/en.json`, which must keep the same keys. Images, links, prices and proper names stay in `lib/content.ts`; list entries in the JSON files follow its order.

Use `await getI18n()` in Server Components and `useI18n()` in Client Components. `TransitionLink` and `RectButton` add the locale, so pass them plain paths like `/menu`.

## Before launch

Set `NEXT_PUBLIC_SITE_URL` to the live domain. Canonical links, language alternates, the sitemap, share cards and structured data all use it.
