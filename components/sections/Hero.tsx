import { Info } from "lucide-react";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { MailtoLink } from "@/components/cta";
import { PriceCounter } from "@/components/PriceCounter";
import { askingPrice } from "@/config/pricing";
import { element, site } from "@/config/site";
import { contactEmail } from "@/lib/env";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { displayCurrencyFor, displayPrice, formatNative } from "@/lib/format";
import type { FxRate } from "@/lib/fx";

export function Hero({
  dict,
  locale,
  fx,
}: {
  dict: Dictionary;
  locale: Locale;
  fx: FxRate;
}) {
  // The union makes it impossible to render a number without its status chip:
  // both come from the same value.
  const price =
    askingPrice.mode === "tbd"
      ? null
      : displayPrice(askingPrice.amount, askingPrice.currency, locale, fx);
  const statusNote = dict.hero.statusNote[askingPrice.mode];

  return (
    <section className="relative overflow-hidden">
      {/* Static radial gradient behind the price. Deliberately no blur filter —
          a large blur is one of the most expensive things to composite on a
          mid-range phone, and a radial gradient is already soft. */}
      <div
        aria-hidden="true"
        className="bg-glow pointer-events-none absolute top-0 left-1/2 -z-10 size-[60vw] max-h-[900px] max-w-[900px] -translate-x-1/2 rounded-full"
      />

      <div className="mx-auto w-full max-w-5xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
              {dict.hero.eyebrow}
            </p>

            <h1 className="mt-5 font-mono text-[clamp(2.25rem,7vw,4.5rem)] leading-none tracking-[-0.03em] break-all">
              {site.domain}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              {dict.hero.subhead}
            </p>

            <div className="mt-10">
              <p className="font-mono text-xs tracking-[0.12em] text-ink-muted uppercase">
                {/* The label names the currency being *displayed* — the Chinese
                    page shows a CNY conversion even though the ask is in USD. */}
                {dict.hero.priceLabel(
                  dict.currencyNames[displayCurrencyFor(locale)],
                )}
              </p>

              {price ? (
                <PriceCounter
                  prefix={price.prefix}
                  value={price.value}
                  valueText={price.valueText}
                  localeTag={localeTags[locale]}
                  className="mt-2 block text-[clamp(3rem,10vw,5.5rem)] leading-none font-semibold"
                />
              ) : (
                <p className="mt-2 text-[clamp(2rem,6vw,3.25rem)] leading-none font-semibold text-muted-foreground">
                  {dict.hero.priceOnRequest}
                </p>
              )}

              <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
                <Info className="size-3.5 shrink-0" aria-hidden="true" />
                {statusNote}
              </p>

              {/* When the displayed figure is a conversion, restate the amount
                  the seller actually quoted — that is the number the deal is
                  written in. */}
              {price && !price.isNative && askingPrice.mode !== "tbd" && (
                <p className="mt-2 font-mono text-xs text-ink-muted">
                  {dict.hero.originalQuote(
                    formatNative(askingPrice.amount, askingPrice.currency, locale),
                    dict.currencyNames[askingPrice.currency],
                  )}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MailtoLink email={contactEmail} subject={dict.hero.mailSubject}>
                {dict.hero.ctaPrimary}
              </MailtoLink>
              <CopyEmailButton
                email={contactEmail}
                label={dict.hero.ctaSecondary}
                copiedLabel={dict.hero.copied}
              />
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
              {dict.hero.trust.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-border">
                      ·
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ElementTile dict={dict} />
        </div>
      </div>
    </section>
  );
}

/** argon: element 18, noble gas, atomic mass 39.948. */
function ElementTile({ dict }: { dict: Dictionary }) {
  return (
    <div
      aria-hidden="true"
      className="hidden w-56 shrink-0 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm lg:block"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-5xl leading-none text-data-ink">{element.symbol}</span>
        <span className="font-mono text-xs text-ink-muted">{element.number}</span>
      </div>

      <dl className="mt-6 space-y-2 font-mono text-[11px]">
        <div className="flex justify-between gap-3 border-t border-border pt-2">
          <dt className="text-ink-muted">mass</dt>
          <dd className="text-muted-foreground">{element.mass}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-2">
          <dt className="text-ink-muted">group</dt>
          <dd className="text-muted-foreground">{dict.hero.element.category}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-2">
          <dt className="text-ink-muted">state</dt>
          <dd className="text-muted-foreground">{dict.hero.element.state}</dd>
        </div>
      </dl>
    </div>
  );
}
