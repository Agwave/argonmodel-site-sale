import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * Next.js 16 renamed the `middleware` file convention to `proxy` (the exported
 * function renamed with it). Same behaviour, but it now defaults to the Node.js
 * runtime rather than Edge.
 *
 * This only does one thing: send a request for an un-prefixed path to the right
 * locale. Every real page lives under `/{locale}` and is statically rendered.
 *
 * Deliberately sets no cookie — the footer promises no cookies, and a Set-Cookie
 * on every response would also defeat CDN caching of the static pages.
 */

/** Picks a locale from the Accept-Language header, honouring q-values. */
function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const weight = q === undefined ? 1 : Number.parseFloat(q);
      return { tag: tag.trim().toLowerCase(), weight };
    })
    .filter((entry) => entry.tag.length > 0 && Number.isFinite(entry.weight))
    .sort((a, b) => b.weight - a.weight);

  for (const { tag } of ranked) {
    // `zh`, `zh-CN`, `zh-Hans`, `zh-TW` all land on the Simplified dictionary.
    if (tag === "zh" || tag.startsWith("zh-")) return "zh";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // 307, not 308: the destination depends on a request header, so it must never
  // be cached as a permanent redirect.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    // Skip Next internals, API routes, and anything with a file extension.
    "/((?!_next/|api/|.*\\.[^/]+$).*)",
  ],
};
