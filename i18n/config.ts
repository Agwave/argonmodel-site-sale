export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** BCP 47 tags, used for <html lang>, Intl formatting, and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

/**
 * Currency is bound to the locale, not to a user preference: English shows USD,
 * Chinese shows CNY. USD is the base — the transaction currency — and the CNY
 * figure is a conversion. See lib/format.ts.
 */
export const localeCurrency: Record<Locale, "USD" | "CNY"> = {
  en: "USD",
  zh: "CNY",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
