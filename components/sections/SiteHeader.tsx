import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { askingPrice } from "@/config/pricing";
import { element } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteHeader({
  dict,
  locale,
  lastReviewed,
}: {
  dict: Dictionary;
  locale: Locale;
  /** Pre-formatted, so no date logic runs in this component. */
  lastReviewed: string;
}) {
  const isSold = askingPrice.mode === "sold";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <a
          href={`/${locale}`}
          className="flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ElementMark />
          <span className="font-mono text-sm tracking-tight">{dict.header.wordmark}</span>
        </a>

        <div className="flex items-center gap-2">
          {/* Label carries the meaning; the dot is redundant decoration. The
              sold state must never sit next to a "for sale" claim anywhere — the
              header is the first thing a visitor reads. */}
          <span
            className="hidden h-8 items-center gap-2 rounded-md border border-border px-2.5 text-xs text-muted-foreground sm:inline-flex"
            title={isSold ? undefined : dict.header.availableAria(lastReviewed)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                isSold ? "bg-muted-foreground" : "bg-good motion-safe:animate-pulse",
              )}
            />
            {isSold ? dict.header.sold : dict.header.available}
          </span>
          <ThemeToggle label={dict.header.themeToggle} />
          <LocaleSwitcher
            current={locale}
            targetLabel={dict.header.otherLocaleName}
            label={dict.header.languageLabel}
          />
        </div>
      </div>
    </header>
  );
}

/** The argon element tile — the one graphic on the page that carries meaning. */
function ElementMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-7 flex-col items-center justify-center rounded border border-data/40 bg-data/5 font-mono leading-none"
    >
      <span className="text-[10px] font-medium text-data-ink">{element.symbol}</span>
      <span className="text-[7px] text-ink-muted">{element.number}</span>
    </span>
  );
}
