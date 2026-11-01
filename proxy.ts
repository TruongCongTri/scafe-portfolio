import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, withLocale, type Locale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

// The saved choice wins, then the browser's language order.
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => {
      const [tag, quality] = entry.trim().split(";q=");
      return { language: tag.split("-")[0].toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  return accepted.map((entry) => entry.language).find((language) => hasLocale(language)) as Locale | undefined ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const current = locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (!current) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale(preferredLocale(request), pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
    response.cookies.set(LOCALE_COOKIE, current, { maxAge: ONE_YEAR, path: "/", sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|images|.*\\.).*)"],
};
