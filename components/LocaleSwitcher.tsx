import Link from "next/link";
import type { Locale } from "@/i18n/config";

/**
 * A plain link — no JS, works with scripting disabled. The site is a single
 * page, so switching locale is just a different path segment.
 */
export function LocaleSwitcher({
  current,
  targetLabel,
  label,
}: {
  current: Locale;
  /** The name of the locale being switched to, in its own language. */
  targetLabel: string;
  /** Accessible name for the control, e.g. "Language". */
  label: string;
}) {
  const target: Locale = current === "en" ? "zh" : "en";

  return (
    <Link
      href={`/${target}`}
      hrefLang={target}
      aria-label={`${label}: ${targetLabel}`}
      className="inline-flex h-8 items-center rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {targetLabel}
    </Link>
  );
}
