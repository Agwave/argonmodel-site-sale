import { ArrowUpRight, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  askingPrice,
  comparables,
  stalenessThresholdDays,
  subject,
} from "@/config/pricing";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  daysSince,
  displayCurrencyFor,
  formatDate,
  isoDate,
  makePriceFormatter,
  toDisplayAmount,
} from "@/lib/format";
import type { FxRate } from "@/lib/fx";
import type { LivePriceMap } from "@/lib/prices";
import type { Currency } from "@/config/pricing";

type Row = {
  domain: string;
  isSubject: boolean;
  /** Stored in `amountCurrency`; used only for the magnitude bar. */
  amount: number | null;
  amountCurrency: Currency;
  priceText: string;
  sourceName: string | null;
  sourceUrl: string | null;
  statusLabel: string;
  checkedLabel: string | null;
  stale: boolean;
  /** True when this row's price came from the automatic feed. */
  isLive: boolean;
};

/**
 * The comparison is an emphasis form, not a chart: one item is the subject and
 * the rest are context. So this is a table, not four bars on an axis — the
 * accent marks the subject row, the comparables are de-emphasised grey, and no
 * legend is needed because there is only one emphasised thing.
 *
 * Every figure is rendered as text. The magnitude bar is a redundant supplement;
 * nothing is readable only by comparing bar lengths, and no colour alone carries
 * meaning — each bar sits beside its own label.
 *
 * Below `md` this renders as stacked cards instead of a table. A five-column
 * data table cannot fit a phone, and the horizontal-scroll alternative leaks a
 * page-level horizontal scroll on narrow viewports (Chrome lets a scroller's
 * extent escape into the root scroll width once the table is far wider than the
 * viewport). The card layout removes the scroll container entirely, so the leak
 * is not possible rather than merely tuned away.
 */
export function Comparables({
  dict,
  locale,
  fx,
  now,
  livePrices,
}: {
  dict: Dictionary;
  locale: Locale;
  fx: FxRate;
  /** Injected so staleness is computed from one consistent clock. */
  now: Date;
  /** Prices refreshed from the marketplace feed; missing entries fall back. */
  livePrices: LivePriceMap;
}) {
  const formatPrice = makePriceFormatter(locale, fx);
  const today = isoDate(now);

  /**
   * Bar lengths and the summary tiles compare prices against each other, so they
   * need one shared basis. Prices arrive in whatever currency their source
   * quoted — Atom and Sedo surface as RMB through Aliyun, this domain is priced
   * in USD — so raw numbers would be compared across currencies and the bars
   * would be meaningless.
   *
   * The shared basis is the *display* currency, not USD: computing in USD and
   * then converting back for the Chinese page would round-trip every figure
   * through two conversions for no reason.
   */
  const display: Currency = displayCurrencyFor(locale);
  const toDisplay = (amount: number, currency: Currency): number =>
    toDisplayAmount(amount, currency, locale, fx);

  const rows: Row[] = [
    {
      domain: subject.domain,
      isSubject: true,
      amount: askingPrice.mode === "tbd" ? null : askingPrice.amount,
      amountCurrency: askingPrice.mode === "tbd" ? "USD" : askingPrice.currency,
      priceText:
        askingPrice.mode === "tbd"
          ? dict.hero.priceOnRequest
          : formatPrice(askingPrice.amount, askingPrice.currency),
      sourceName: null,
      sourceUrl: null,
      statusLabel: dict.comparables.forSale,
      checkedLabel: null,
      stale: false,
      isLive: false,
    },
    ...comparables.map((entry): Row => {
      const live = livePrices[entry.domain];

      const statusLabel =
        entry.status === "parked"
          ? dict.comparables.parked
          : dict.comparables.activeListing;

      // A live figure wins over the stored one. The stored value is not
      // discarded — it is what renders if the refresh fails.
      if (live) {
        return {
          domain: entry.domain,
          isSubject: false,
          amount: live.amount,
          amountCurrency: live.currency,
          priceText: formatPrice(live.amount, live.currency),
          sourceName: entry.sourceName,
          sourceUrl: entry.sourceUrl,
          statusLabel,
          // Fresh by definition, so no staleness treatment applies.
          checkedLabel: dict.comparables.checkedOn(formatDate(today, locale)),
          stale: false,
          isLive: true,
        };
      }

      const checkedLabel =
        entry.display === "unchecked"
          ? null
          : dict.comparables.checkedOn(formatDate(entry.checkedAt, locale));

      return {
        domain: entry.domain,
        isSubject: false,
        amount: entry.display === "price" ? entry.amount : null,
        amountCurrency: entry.display === "price" ? entry.currency : "USD",
        priceText:
          entry.display === "price"
            ? formatPrice(entry.amount, entry.currency)
            : entry.display === "make-offer"
              ? `${dict.comparables.makeOffer} — ${dict.comparables.noPublicPrice}`
              : dict.comparables.awaitingCheck,
        // Linked even when unchecked — a visitor can go read the price
        // themselves, which is the whole point of citing the source.
        sourceName: entry.sourceName,
        sourceUrl: entry.sourceUrl,
        statusLabel,
        checkedLabel,
        stale:
          entry.display !== "unchecked" &&
          daysSince(entry.checkedAt, now) > stalenessThresholdDays,
        isLive: false,
      };
    }),
  ];

  const priced = rows.filter(
    (row): row is Row & { amount: number } => row.amount !== null,
  );
  const maxAmount = priced.reduce(
    (max, row) => Math.max(max, toDisplay(row.amount, row.amountCurrency)),
    0,
  );
  // If any contributing price had to be converted, the summary statistics are
  // derived figures and must be presented as approximate too.
  const tilesAreDerived = priced.some(
    (row) => row.amountCurrency !== display,
  );
  const anyStale = rows.some((row) => row.stale);

  /**
   * The "why so cheap" note renders only while it is true: the subject is priced
   * and sits below every priced comparable. Raise the price and it disappears on
   * its own, so it can never become a stale claim.
   */
  const subjectRow = rows[0];
  const comparableAmounts = priced
    .filter((row) => !row.isSubject)
    .map((row) => toDisplay(row.amount, row.amountCurrency));
  const showLowPriceNote =
    subjectRow.amount !== null &&
    comparableAmounts.length > 0 &&
    toDisplay(subjectRow.amount, subjectRow.amountCurrency) <
      Math.min(...comparableAmounts);

  // With no prices entered yet there is nothing to compare, so the bars and the
  // summary tiles stay out of the way rather than rendering empty furniture.
  const showBars = priced.length >= 2 && maxAmount > 0;

  const priceCell = (row: Row, className?: string) => (
    <div className={className}>
      <span className={cn("block", row.isSubject && "font-medium")}>
        {row.priceText}
      </span>
      {showBars && row.amount !== null && (
        <span
          role="img"
          aria-label={dict.comparables.barAria(row.domain, row.priceText)}
          className="bar-track mt-2 block h-1.5 w-full max-w-[10rem] overflow-hidden rounded-sm"
        >
          <span
            className={cn(
              "block h-full rounded-r-[3px]",
              row.isSubject ? "bg-data" : "bg-deemphasis",
            )}
            style={{
              // Normalised to the display currency so the bars compare like with
              // like, and rounded so the markup carries no float noise.
              width: `${Math.max(
                2,
                Math.round((toDisplay(row.amount, row.amountCurrency) / maxAmount) * 1000) / 10,
              )}%`,
            }}
          />
        </span>
      )}
    </div>
  );

  const sourceCell = (row: Row) =>
    row.sourceUrl && row.sourceName ? (
      <a
        href={row.sourceUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="inline-flex items-center gap-1 text-data-ink underline-offset-4 hover:underline"
      >
        {row.sourceName}
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        <span className="sr-only">({dict.common.opensInNewTab})</span>
      </a>
    ) : (
      <span className="text-ink-muted">—</span>
    );

  const checkedCell = (row: Row) =>
    row.checkedLabel ? (
      // Icon + words, never colour alone.
      <span
        className={cn(
          "inline-flex flex-wrap items-center gap-x-1.5 gap-y-1",
          row.stale ? "text-warning" : "text-ink-muted",
        )}
      >
        {row.stale && (
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
        )}
        {row.checkedLabel}
        {/* Says plainly which figures were fetched rather than read. */}
        {row.isLive && (
          <span
            title={dict.comparables.autoTagTitle}
            className="rounded border border-border px-1 py-0.5 text-[10px] text-ink-muted"
          >
            {dict.comparables.autoTag}
          </span>
        )}
      </span>
    ) : (
      <span className="text-ink-muted">—</span>
    );

  const subjectTag = (row: Row) =>
    row.isSubject ? (
      <span className="rounded border border-data/40 px-1.5 py-0.5 text-[10px] text-data-ink">
        {dict.comparables.thisDomain}
      </span>
    ) : null;

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.comparables.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          {dict.comparables.subhead}
        </p>

        {showBars && (
          <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            <Tile
              label={dict.comparables.tiles.median}
              sub={dict.comparables.tiles.medianSub}
              value={formatPrice(
                medianOf(priced.map((row) => toDisplay(row.amount, row.amountCurrency))),
                display,
                { approximate: tilesAreDerived },
              )}
            />
            <Tile
              label={dict.comparables.tiles.highest}
              sub={null}
              value={formatPrice(maxAmount, display, { approximate: tilesAreDerived })}
            />
            <Tile
              label={dict.comparables.tiles.count}
              sub={dict.comparables.tiles.countSub}
              value={String(rows.length)}
            />
          </dl>
        )}

        {/* Phones: one card per domain. */}
        <ul className="mt-10 space-y-3 md:hidden">
          {rows.map((row) => (
            <li
              key={row.domain}
              className={cn(
                "rounded-xl border border-border p-4",
                row.isSubject && "border-l-2 border-l-data bg-surface-2",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={cn("font-mono text-xs", row.isSubject && "font-medium")}
                >
                  {row.domain}
                </span>
                {subjectTag(row)}
              </div>

              <div className="mt-3 tabular-nums">{priceCell(row)}</div>

              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs">
                <dt className="text-ink-muted">{dict.comparables.columns.marketplace}</dt>
                <dd className="text-right">{sourceCell(row)}</dd>
                <dt className="text-ink-muted">{dict.comparables.columns.status}</dt>
                <dd className="text-right text-muted-foreground">{row.statusLabel}</dd>
                <dt className="text-ink-muted">{dict.comparables.columns.checked}</dt>
                <dd className="text-right">{checkedCell(row)}</dd>
              </dl>
            </li>
          ))}
        </ul>

        {/* md and up: the table. No min-width — `w-full` with wrapping cells
            cannot overflow, so no horizontal scroller is needed. */}
        <div className="mt-10 hidden md:block">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{dict.comparables.heading}</caption>
            <thead>
              <tr className="border-b border-border text-left">
                <Th>{dict.comparables.columns.domain}</Th>
                <Th className="w-[32%]">{dict.comparables.columns.price}</Th>
                <Th>{dict.comparables.columns.marketplace}</Th>
                <Th>{dict.comparables.columns.status}</Th>
                <Th>{dict.comparables.columns.checked}</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.domain}
                  className={cn(
                    "border-b border-border align-top last:border-b-0",
                    // The emphasis encoding: surface + a rule, not hue alone.
                    row.isSubject && "border-l-2 border-l-data bg-surface-2",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "py-4 pr-4 font-mono text-xs font-normal break-words",
                      row.isSubject ? "pl-4" : "pl-0",
                    )}
                  >
                    <span className={cn(row.isSubject && "font-medium")}>
                      {row.domain}
                    </span>
                    {row.isSubject && (
                      <span className="mt-1 block font-sans text-[11px] text-ink-muted">
                        {dict.comparables.thisDomain}
                      </span>
                    )}
                  </th>

                  <td
                    className={cn(
                      "py-4 pr-4 tabular-nums",
                      row.isSubject ? "pl-4" : "pl-0",
                    )}
                  >
                    {priceCell(row)}
                  </td>

                  <td className={cn("py-4 pr-4", row.isSubject ? "pl-4" : "pl-0")}>
                    {sourceCell(row)}
                  </td>

                  <td
                    className={cn(
                      "py-4 pr-4 text-muted-foreground",
                      row.isSubject ? "pl-4" : "pl-0",
                    )}
                  >
                    {row.statusLabel}
                  </td>

                  <td className={cn("py-4", row.isSubject ? "pl-4" : "pl-0")}>
                    {checkedCell(row)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {anyStale && (
          <p className="mt-4 flex items-start gap-2 text-xs text-warning">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {dict.comparables.staleWarning}
          </p>
        )}

        {/* A gap this large, left unexplained, reads as a mistake or a scam —
            so it gets named, right where the reader notices it. */}
        {showLowPriceNote && (
          <div className="mt-6 rounded-xl border border-border border-l-2 border-l-data bg-surface-2 p-5">
            <p className="text-sm font-medium">{dict.comparables.lowPriceTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {dict.comparables.lowPriceBody}
            </p>
          </div>
        )}

        {/* Persistent, not a tooltip: the provenance of every number is part of
            the page, not a disclosure hidden behind interaction. */}
        <div className="mt-8 rounded-xl border border-border bg-card/50 p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Info className="size-4 shrink-0 text-data-ink" aria-hidden="true" />
            {dict.comparables.provenanceTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {dict.comparables.provenanceBody}
          </p>
        </div>
      </div>
    </section>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "py-3 pr-4 font-mono text-[11px] font-normal tracking-[0.08em] text-ink-muted uppercase first:pl-0",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Tile({
  label,
  sub,
  value,
}: {
  label: string;
  sub: string | null;
  value: string;
}) {
  return (
    <div className="bg-card p-5">
      <dt className="text-xs text-muted-foreground">
        {label}
        {sub && <span className="mt-0.5 block text-[11px] text-ink-muted">{sub}</span>}
      </dt>
      {/* Proportional figures: tabular-nums is for columns, and this is a
          standalone display value. */}
      <dd className="mt-2 text-2xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}

function medianOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle];
}
