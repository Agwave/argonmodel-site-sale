import { ArrowUpRight } from "lucide-react";
import { marketplaceListing, site } from "@/config/site";
import { contactEmail } from "@/lib/env";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatRate, formatRateAsOf } from "@/lib/format";
import type { FxRate } from "@/lib/fx";

export function SiteFooter({
  dict,
  locale,
  fx,
  lastReviewed,
}: {
  dict: Dictionary;
  locale: Locale;
  fx: FxRate;
  lastReviewed: string;
}) {
  const asOf = fx.asOf ? formatRateAsOf(fx.asOf, locale) : null;

  // Only claim the rate is live when it actually came from the provider AND we
  // could read its timestamp. Anything else is described as a fixed reference
  // rate and names the number actually used — never dressed up as live.
  const fxNote =
    fx.source === "live" && asOf !== null
      ? dict.footer.fxNoteLive(formatRate(fx.rate), asOf)
      : dict.footer.fxNoteFallback(formatRate(fx.rate));

  const listing = marketplaceListing();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-sm">{site.domain}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-block text-sm text-data-ink underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            {listing && (
              <a
                href={listing.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {listing.name}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">({dict.common.opensInNewTab})</span>
              </a>
            )}
          </div>

          <ul className="max-w-2xl space-y-2 text-xs leading-relaxed text-ink-muted sm:text-right">
            <li>{dict.footer.reviewed(lastReviewed)}</li>
            <li>{dict.footer.dataNote}</li>
            <li>{fxNote}</li>
            <li className="text-muted-foreground">{dict.footer.currencyNote}</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.copyright}</p>
          <p>{dict.footer.noTracking}</p>
        </div>
      </div>
    </footer>
  );
}
