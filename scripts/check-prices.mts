/**
 * Warns when a comparable price has gone stale, or when `site.lastReviewed` has
 * fallen behind the most recent `checkedAt`.
 *
 * Run directly by Node's built-in TypeScript support (no build step, no
 * dependencies) — it imports the real config, so it can never drift from what
 * the site actually renders.
 *
 *   node scripts/check-prices.ts            # warn only, never fails
 *   node scripts/check-prices.ts --strict   # exit 1 when something is stale
 */
import { comparables, stalenessThresholdDays } from "../config/pricing.ts";
import { site } from "../config/site.ts";

const MS_PER_DAY = 86_400_000;
const strict = process.argv.includes("--strict");

const today = new Date();
const warnings: string[] = [];

function daysSince(isoDate: string): number {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return Number.NaN;
  return Math.floor((today.getTime() - parsed.getTime()) / MS_PER_DAY);
}

const unchecked = comparables.filter((entry) => entry.display === "unchecked");
const live = comparables.filter((entry) => entry.liveQuery);

for (const entry of comparables) {
  if (entry.display === "unchecked") continue;

  const age = daysSince(entry.checkedAt);
  if (Number.isNaN(age)) {
    warnings.push(`${entry.domain}: checkedAt "${entry.checkedAt}" is not a valid ISO date`);
    continue;
  }
  if (age > stalenessThresholdDays) {
    warnings.push(
      `${entry.domain}: price last checked ${age} days ago (threshold ${stalenessThresholdDays})`,
    );
  }
}

const reviewedAge = daysSince(site.lastReviewed);
const newestCheck = comparables
  .filter((entry) => entry.display !== "unchecked")
  .map((entry) => entry.checkedAt)
  .sort()
  .at(-1);

if (Number.isNaN(reviewedAge)) {
  warnings.push(`site.lastReviewed "${site.lastReviewed}" is not a valid ISO date`);
} else if (newestCheck !== undefined && site.lastReviewed < newestCheck) {
  warnings.push(
    `site.lastReviewed (${site.lastReviewed}) is behind a checkedAt date (${newestCheck})`,
  );
}

if (warnings.length > 0) {
  console.warn("\n⚠️  Price data needs attention:\n");
  for (const warning of warnings) console.warn(`   • ${warning}`);
  console.warn("\n   Edit config/pricing.ts, then bump site.lastReviewed in config/site.ts.\n");
  if (strict) process.exit(1);
} else {
  console.log("✓ Price data is current.");
}

if (unchecked.length > 0) {
  console.log(
    `\nℹ️  ${unchecked.length} comparable(s) still marked "unchecked" — they render as ` +
      `"Awaiting check" until you read the listing and fill in a price:\n` +
      unchecked.map((entry) => `   • ${entry.domain}  ${entry.sourceUrl}`).join("\n") +
      "\n",
  );
}

if (live.length > 0) {
  console.log(
    `ℹ️  ${live.length} comparable(s) refresh automatically from the marketplace feed.\n` +
      "   The amounts in config/pricing.ts are the FALLBACK used when that refresh\n" +
      "   fails, so they still matter — a stale fallback is what a visitor sees\n" +
      "   during an outage. Re-check them if these warnings persist across deploys.\n",
  );
}
