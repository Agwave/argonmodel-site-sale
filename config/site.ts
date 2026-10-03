/**
 * Site identity. Edit this file plus `config/pricing.ts` — those two are the
 * only files you need to touch to run this site.
 *
 * Deployment-specific values live in environment variables instead, so they are
 * never committed — the contact address and the canonical URL. See `.env.example`
 * and `lib/env.ts`.
 */

export const site = {
  /** Used for the wordmark, <title>, Open Graph and structured data. */
  domain: "argonmodel.com",

  /**
   * The public marketplace listing. This is the strongest ownership proof the
   * page can offer — a listing exists only after the venue verifies the seller
   * controls the domain — so it is linked from the footer and cited in the
   * ownership FAQ. Set either to null to hide it.
   *
   * Keep `askingPrice` in `config/pricing.ts` in step with the listing: the page
   * and the marketplace are two views of one offer, and a mismatch between them
   * is the fastest way to lose a buyer's trust.
   */
  marketplaceListingUrl:
    "https://mi.aliyun.com/domain-detail?domainName=argonmodel.com" as string | null,
  marketplaceListingName: "Aliyun Domain Trading" as string | null,

  /**
   * The recommended venue for the transaction, linked from the escrow step.
   * The domain is registered with Aliyun, so its trading service can complete
   * escrow and a same-registrar push in one step — which also sidesteps ICANN's
   * 60-day transfer window. Buyers may use any provider; this is only surfaced
   * as the suggested default.
   */
  recommendedVenueUrl: "https://mi.aliyun.com/",

  /**
   * The date you last verified the prices in `config/pricing.ts`.
   * ⚠️ Bump this whenever you touch a price. `pnpm check-prices` warns if it
   * falls behind.
   */
  lastReviewed: "2026-10-01",
} as const;

/** argon — element 18. Shown as the hero's element tile. */
export const element = {
  symbol: "Ar",
  number: 18,
  mass: "39.948",
} as const;

export type Site = typeof site;

/** Resolved marketplace listing, or null when none is configured. */
export function marketplaceListing(): { href: string; name: string } | null {
  if (!site.marketplaceListingUrl || !site.marketplaceListingName) return null;
  return { href: site.marketplaceListingUrl, name: site.marketplaceListingName };
}
