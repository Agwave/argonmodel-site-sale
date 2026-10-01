import type { Locale } from "@/i18n/config";

/**
 * A plain anchor, deliberately — **not** `next/link`.
 *
 * `next/link` navigates on the client, which re-renders the `[locale]` layout.
 * `next-themes` renders a blocking `<script>` to set the theme class before
 * first paint, and that script is server-render-only by design (it even sets
 * `nonce: typeof window === "undefined" ? nonce : ""`). Rendering it during a
 * client render is a no-op and makes React 19 log:
 *
 *   "Encountered a script tag while rendering React component."
 *
 * A full navigation also guarantees `<html lang>` is re-rendered with the right
 * value rather than patched in, and language switching is a rare, deliberate
 * action where the reload costs nothing. Do not "optimise" this back to
 * `next/link`.
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
    <a
      href={`/${target}`}
      hrefLang={target}
      aria-label={`${label}: ${targetLabel}`}
      className="inline-flex h-8 items-center rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {targetLabel}
    </a>
  );
}
