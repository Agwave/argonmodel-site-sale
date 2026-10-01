import { localeTags, type Locale } from "@/i18n/config";
import type { Currency } from "@/config/pricing";
import type { FxRate } from "./fx";

/**
 * Display currency is bound to the locale — English in USD, Chinese in CNY —
 * while each price is stored in the currency its source actually quoted. So a
 * figure is either *native* to the display currency or *converted* into it, and
 * the two are presented differently:
 *
 *   native    → the exact figure ("$888", "¥38,024")
 *   converted → "≈" and rounded, because a converted number has no precision
 *               of its own: the rate moves daily and is itself an estimate.
 *
 * Showing a conversion as though it were exact would be the one dishonest thing
 * this page could do with a number.
 */
const CNY_ROUNDING_STEP = 1_000;
const USD_ROUNDING_STEP = 10;

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function toDisplayAmountRaw(
  amount: number,
  from: Currency,
  to: Currency,
  fx: FxRate,
): number {
  if (from === to) return amount;
  return to === "CNY" ? amount * fx.rate : amount / fx.rate;
}

export type DisplayPrice = {
  /** Rendered outside the animated element so the line never reflows. */
  prefix: string;
  /** The integer the counter animates towards. */
  value: number;
  /**
   * `value` with grouping separators. The counter renders this at rest, which
   * guarantees the server-rendered text and the post-animation text are
   * byte-identical — no reflow, and the no-JS output matches.
   */
  valueText: string;
  /** `prefix` + `valueText`. */
  formatted: string;
  /** False when the figure was converted rather than quoted natively. */
  isNative: boolean;
};

export function displayPrice(
  amount: number,
  currency: Currency,
  locale: Locale,
  fx: FxRate,
  /**
   * Overrides the native/converted inference. Needed for derived figures such
   * as the median of a mixed-currency set: the value is already expressed in the
   * display currency, but it was computed from converted inputs, so it must
   * still be marked approximate.
   */
  options?: { approximate?: boolean },
): DisplayPrice {
  const target: Currency = locale === "zh" ? "CNY" : "USD";
  const isNative = options?.approximate === undefined
    ? currency === target
    : !options.approximate;

  const converted = toDisplayAmountRaw(amount, currency, target, fx);
  const value = isNative
    ? converted
    : roundTo(converted, target === "CNY" ? CNY_ROUNDING_STEP : USD_ROUNDING_STEP);

  const prefix = `${isNative ? "" : "≈ "}${target === "CNY" ? "¥" : "$"}`;
  const valueText = value.toLocaleString(localeTags[locale]);

  return { prefix, value, valueText, formatted: `${prefix}${valueText}`, isNative };
}

/** The currency a locale displays prices in. */
export function displayCurrencyFor(locale: Locale): Currency {
  return locale === "zh" ? "CNY" : "USD";
}

/**
 * Builds the formatter used for the comparison table and other inline figures.
 * Call sites hand over an amount plus the currency it was quoted in.
 */
export function makePriceFormatter(
  locale: Locale,
  fx: FxRate,
): (
  amount: number,
  currency: Currency,
  options?: { approximate?: boolean },
) => string {
  return (amount, currency, options) =>
    displayPrice(amount, currency, locale, fx, options).formatted;
}

/**
 * Converts an amount into the locale's display currency. Used where several
 * prices must be compared against each other, which is only meaningful on one
 * shared basis.
 */
export function toDisplayAmount(
  amount: number,
  from: Currency,
  locale: Locale,
  fx: FxRate,
): number {
  return toDisplayAmountRaw(amount, from, displayCurrencyFor(locale), fx);
}

/**
 * Formats an amount in the currency it was quoted in, ignoring the locale's
 * display currency. Used to restate a converted figure in the currency the
 * contract will actually be settled in.
 */
export function formatNative(
  amount: number,
  currency: Currency,
  locale: Locale,
): string {
  return `${currency === "CNY" ? "¥" : "$"}${amount.toLocaleString(localeTags[locale])}`;
}

/** Formats an ISO date (YYYY-MM-DD) without timezone drift. */
export function formatDate(isoDate: string, locale: Locale): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Formats the FX provider's own timestamp string. */
export function formatRateAsOf(raw: string, locale: Locale): string | null {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Whole days between an ISO date and now. Negative values clamp to 0. */
export function daysSince(isoDate: string, now: Date): number {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 0;

  const elapsedMs = now.getTime() - parsed.getTime();
  return Math.max(0, Math.floor(elapsedMs / 86_400_000));
}

/** Renders a rate with enough precision to be checkable, e.g. "6.7169". */
export function formatRate(rate: number): string {
  return rate.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

/** Today as an ISO date (YYYY-MM-DD), in UTC. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
