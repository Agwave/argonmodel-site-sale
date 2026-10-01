/**
 * ⭐ THE FILE YOU EDIT.
 *
 * Prices live here in whatever currency the source quotes them in (`currency`),
 * and the page converts for display: English in USD, Chinese in CNY. Nothing is
 * pre-converted here, so the numbers below stay checkable against their source.
 *
 * Comparable prices are refreshed automatically — see `liveQuery` and
 * `lib/prices.ts`. The amounts below are the fallback: they are what renders if
 * the refresh fails, and they are the values the "Price checked" date refers to.
 * So whenever you update one by hand, bump its `checkedAt`.
 */

/** Flag a comparable once its price is older than this. */
export const stalenessThresholdDays = 30;

export type Currency = "USD" | "CNY";

/**
 * Your asking price.
 *
 * Modelled as three states rather than a bare number so that the page can never
 * render a number without also rendering what kind of number it is.
 *
 * - `tbd`         — no number is shown at all; the hero reads "Price on request".
 *                   Nothing false can render.
 * - `indicative`  — shows the number plus a persistent "subject to confirmation" chip.
 * - `firm`        — shows the number plus a "Firm asking price" chip.
 */
export type AskingPrice =
  | { mode: "tbd" }
  | { mode: "indicative"; amount: number; currency: Currency }
  | { mode: "firm"; amount: number; currency: Currency };

export const askingPrice: AskingPrice = {
  mode: "indicative",
  amount: 888,
  currency: "USD",
};

/** Whether a comparable is currently listed, or merely parked with no price. */
export type ComparableStatus = "active" | "parked";

type ComparableBase = {
  domain: string;
  status: ComparableStatus;
  sourceUrl: string;
  sourceName: string;
  /**
   * The keyword to query against Aliyun's public marketplace search, which
   * aggregates listings from Atom, Sedo and others. When present the page tries
   * to refresh this price at build/revalidate time; if the refresh fails, the
   * static amount below is used instead.
   *
   * Set to null to opt a domain out of the refresh and always use the manual
   * amount (e.g. if the search returns unreliable matches for it).
   */
  liveQuery: string | null;
};

/**
 * A comparable listing.
 *
 * `display` decides what the price cell shows, and the type forces the price to
 * agree with it:
 *
 * - `price`      — a known figure. Requires `amount`, `currency` AND `checkedAt`.
 * - `make-offer` — the seller publishes no price. Requires `checkedAt`, and the
 *                  cell renders words, never a 0 or a dash (a dash reads as "free").
 * - `unchecked`  — you have not read the listing yet. Renders "Awaiting check",
 *                  but still links to the listing so a visitor can go look.
 *
 * Never estimate a comparable's price. An invented figure in this table is the
 * one thing that would undermine the whole page — and the automatic refresh
 * exists precisely so that estimating is never necessary.
 */
export type Comparable =
  | (ComparableBase & {
      display: "price";
      amount: number;
      currency: Currency;
      /** ISO date (YYYY-MM-DD) — the day this figure was last verified. */
      checkedAt: string;
    })
  | (ComparableBase & { display: "make-offer"; checkedAt: string })
  | (ComparableBase & { display: "unchecked" });

export const comparables: Comparable[] = [
  {
    domain: "astramodel.com",
    status: "active",
    sourceUrl: "https://www.atom.com/name/AstraModel",
    sourceName: "Atom.com",
    liveQuery: "astramodel.com",
    // Read from Aliyun's aggregated marketplace feed, which reports this as an
    // Atom listing. Aliyun quotes RMB.
    display: "price",
    amount: 38_024,
    currency: "CNY",
    checkedAt: "2026-10-01",
  },
  {
    domain: "opusmodel.com",
    status: "active",
    sourceUrl: "https://www.atom.com/name/OpusModel",
    sourceName: "Atom.com",
    liveQuery: "opusmodel.com",
    display: "price",
    amount: 18_751,
    currency: "CNY",
    checkedAt: "2026-10-01",
  },
  {
    domain: "claudemodel.com",
    status: "active",
    // Listed on Sedo — the parked page gives no hint of this, but Aliyun's feed
    // reports a Sedo listing with an asking price.
    sourceUrl: "https://sedo.com/search/searchresult.php4?keyword=claudemodel.com",
    sourceName: "Sedo",
    liveQuery: "claudemodel.com",
    display: "price",
    amount: 253_847,
    currency: "CNY",
    checkedAt: "2026-10-01",
  },
];

/**
 * Your own row in the comparison table, kept separate from the list above so the
 * table can pin it first and style it as the subject rather than the context.
 */
export const subject = {
  domain: "argonmodel.com",
  status: "active" as const,
};
