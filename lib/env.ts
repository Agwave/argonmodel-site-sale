/**
 * Deployment-specific values, supplied as environment variables rather than
 * committed to the repository.
 *
 * These are read at **build time** — every page is statically generated — so
 * changing one in the Vercel dashboard does nothing until you redeploy.
 *
 * Local development reads `.env.local` (gitignored); `.env.example` is the
 * committed template listing the keys.
 */

/** The value shipped in `.env.example`; treated as "not configured". */
const PLACEHOLDER_EMAIL = "you@example.com";

/**
 * Resolved once at module load, so a missing value fails the build with an
 * actionable message instead of shipping a page whose only call-to-action —
 * the mailto link — goes nowhere.
 */
function readContactEmail(): string {
  const value = process.env.CONTACT_EMAIL?.trim();

  if (!value || value === PLACEHOLDER_EMAIL) {
    throw new Error(
      [
        "",
        "CONTACT_EMAIL is not set.",
        "",
        "  The mailto link is the only way a buyer can reach you, so the build",
        "  stops here rather than publishing a broken call-to-action.",
        "",
        "  Local:  cp .env.example .env.local   then fill it in",
        "  Vercel: Project → Settings → Environment Variables, then redeploy",
        "",
      ].join("\n"),
    );
  }

  return value;
}

export const contactEmail: string = readContactEmail();

/**
 * Canonical origin for canonical tags, hreflang, the sitemap, robots.txt and
 * structured data. The default is this project's production domain, so the
 * variable only needs setting if the site is hosted somewhere else.
 */
export const siteUrl: string = (
  process.env.SITE_URL?.trim() || "https://argonmodel.com"
).replace(/\/+$/, "");
