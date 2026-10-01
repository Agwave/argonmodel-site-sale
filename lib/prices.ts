import { comparables } from "@/config/pricing";

/**
 * Live comparable prices, from Aliyun's public marketplace search.
 *
 * Why this endpoint: Atom.com and Sedo both block automated access to their own
 * listing pages, and their seller APIs are gated behind volume thresholds. But
 * Aliyun's domain marketplace (mi.aliyun.com) aggregates listings from both —
 * `orgPlatForm` in the response is literally "atom" or "sedo" — and its search
 * BFF is a plain JSON endpoint that needs no authentication. It quotes RMB.
 *
 * The endpoint is undocumented and rate-limited: a handful of rapid requests
 * trips a bot challenge that answers with an HTML page instead of JSON (it
 * clears in roughly 90 seconds). So requests are spaced out, every failure
 * degrades to the manual value in `config/pricing.ts`, and nothing here can
 * break a build — a stale-but-correct number is always preferable to no page.
 */
const ENDPOINT = "https://domainapi.aliyun.com/onsale/saleSearch.jsonp";

/** Aliyun trips its bot challenge after ~2-3 rapid requests. */
const REQUEST_SPACING_MS = 6_000;

const REQUEST_TIMEOUT_MS = 8_000;

export type LivePrice = {
  amount: number;
  /** Aliyun always quotes RMB. */
  currency: "CNY";
  /** "atom", "sedo", … — the marketplace the listing actually lives on. */
  platform: string | null;
  /** When the seller published the listing, as reported by Aliyun. */
  publishedAt: string | null;
};

/** Domain → live price. Domains that failed simply are not present. */
export type LivePriceMap = Record<string, LivePrice>;

export async function fetchLivePrices(): Promise<LivePriceMap> {
  const targets = comparables.filter(
    (entry): entry is typeof entry & { liveQuery: string } =>
      typeof entry.liveQuery === "string",
  );

  const prices: LivePriceMap = {};

  for (const [index, target] of targets.entries()) {
    // Space the requests; the first one goes immediately.
    if (index > 0) await sleep(REQUEST_SPACING_MS);

    const price = await fetchOne(target.liveQuery, target.domain);
    if (price) prices[target.domain] = price;
  }

  return prices;
}

async function fetchOne(
  query: string,
  domain: string,
): Promise<LivePrice | null> {
  try {
    const response = await fetch(
      `${ENDPOINT}?keyword=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Referer: "https://mi.aliyun.com/",
        },
        // Matches the page's ISR window, so the refresh runs once a day rather
        // than on every request.
        next: { revalidate: 86_400 },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) return null;

    const body = await response.text();

    // The bot challenge answers with an HTML page. Detect it by shape rather
    // than by content-type, which is not reliable here.
    if (!body.trimStart().startsWith("{")) return null;

    return readItem(JSON.parse(body), domain);
  } catch {
    return null;
  }
}

function readItem(payload: unknown, domain: string): LivePrice | null {
  const items = readPath(payload, ["data", "data"]);
  if (!Array.isArray(items)) return null;

  // The search is fuzzy — querying "astramodel.com" also returns astramigo.com
  // — so an exact match is required. A mismatch means "not a reliable answer",
  // never "close enough".
  const match = items.find(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      (item as { domainName?: unknown }).domainName === domain,
  ) as Record<string, unknown> | undefined;

  if (!match) return null;

  const amount = match.price;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    amount,
    currency: "CNY",
    platform:
      typeof match.orgPlatForm === "string" ? match.orgPlatForm : null,
    publishedAt:
      typeof match.publishTime === "string" ? match.publishTime : null,
  };
}

function readPath(value: unknown, path: string[]): unknown {
  let current: unknown = value;
  for (const key of path) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
