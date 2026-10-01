const FX_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

/**
 * Used when the live rate cannot be reached. The UI must never present this as
 * live — `source: "fallback"` switches the footer and the price note over to
 * "reference rate" wording and names the fixed number.
 */
export const FALLBACK_USD_CNY = 6.72;

export type FxRate = {
  rate: number;
  /** The upstream's own "last updated" string, or null when on the fallback. */
  asOf: string | null;
  source: "live" | "fallback";
};

/**
 * Runs at build time and on ISR revalidation, not per request — the page is
 * statically rendered with a 24h revalidate, which also refreshes the rate date.
 *
 * Never throws: a build or a revalidation must not fail because a currency API
 * was slow. Any failure degrades to the fixed reference rate.
 */
export async function getUsdCny(): Promise<FxRate> {
  try {
    const response = await fetch(FX_ENDPOINT, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(3_000),
    });

    if (!response.ok) {
      throw new Error(`FX request failed with ${response.status}`);
    }

    const data: unknown = await response.json();
    const rate = readCnyRate(data);

    if (rate === null) {
      throw new Error("FX response did not contain a usable CNY rate");
    }

    return { rate, asOf: readUpdatedAt(data), source: "live" };
  } catch {
    return { rate: FALLBACK_USD_CNY, asOf: null, source: "fallback" };
  }
}

function readCnyRate(data: unknown): number | null {
  if (typeof data !== "object" || data === null) return null;
  const rates = (data as { rates?: unknown }).rates;
  if (typeof rates !== "object" || rates === null) return null;
  const cny = (rates as { CNY?: unknown }).CNY;
  return typeof cny === "number" && Number.isFinite(cny) && cny > 0 ? cny : null;
}

function readUpdatedAt(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const value = (data as { time_last_update_utc?: unknown }).time_last_update_utc;
  return typeof value === "string" ? value : null;
}
