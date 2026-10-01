export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** BCP 47 tags, used for <html lang>, Intl formatting, and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

/**
 * Currency is bound to the locale, not to a user preference: English displays
 * USD, Chinese displays CNY.
 *
 * The mapping lives in `displayCurrencyFor()` in `lib/format.ts`, next to the
 * conversion logic that has to agree with it. It is deliberately *not* declared
 * here as well — two places claiming to know the locale→currency mapping is how
 * a price label ends up saying "USD" above a CNY figure.
 */

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
