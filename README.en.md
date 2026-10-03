# argonmodel.com — domain sale page

[中文](README.md) | [English](README.en.md)

A single-page, bilingual (English / Chinese) listing page for the domain
`argonmodel.com`. Static, no backend, no database. English shows prices in USD;
Chinese shows the same prices in CNY.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # then set CONTACT_EMAIL — the build needs it
pnpm dev                     # http://localhost:3000 → redirects to /en or /zh
```

> The **first** page load in dev takes ~12s: it fetches live comparable prices,
> spacing the requests to stay under the marketplace's rate limit. Results are
> memoised, so every load after that is instant.

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (runs the price check first) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm check-prices` | Report stale or unfilled comparable prices |
| `pnpm check-prices:strict` | Same, but exits non-zero when something is stale |

---

## Configuration

Deployment-specific values live in **environment variables**, so they are never
committed. Everything else lives in two files.

### Environment variables

```bash
cp .env.example .env.local     # then fill it in
```

| Variable | Required | Purpose |
|---|---|---|
| `CONTACT_EMAIL` | **yes** | The mailto link — a buyer's only way to reach you. **The build fails if this is unset or still the placeholder**, rather than publishing a page whose call-to-action goes nowhere. |
| `SITE_URL` | no | Canonical origin for canonical tags, hreflang, the sitemap, `robots.txt` and structured data. Defaults to `https://argonmodel.com`. |

`.env.local` is gitignored. For production, set the same keys in the Vercel
dashboard under **Project → Settings → Environment Variables**.

> ⚠️ **Every page is statically generated, so these are read at build time.**
> Changing a value in Vercel does nothing until you **redeploy**.

### 1. `config/site.ts`

Site identity (the domain wordmark), an optional marketplace listing URL, and
`lastReviewed` — the date you last verified the prices.

### 2. `config/pricing.ts`

Your asking price and the comparable listings.

**Your asking price is a four-state value, not a bare number:**

```ts
export const askingPrice: AskingPrice = { mode: "tbd" };
export const askingPrice: AskingPrice = { mode: "indicative", amount: 888, currency: "CNY" };
export const askingPrice: AskingPrice = { mode: "firm",       amount: 888, currency: "CNY" };
export const askingPrice: AskingPrice = { mode: "sold" };
```

- `tbd` — no number renders anywhere. The hero reads "Price on request".
- `indicative` / `firm` — the number renders *together with* a status chip. The
  two come from the same object, so the page structurally cannot show a figure
  without also showing what kind of figure it is.
- `sold` — the domain has gone. The price, every call to action, the trust
  strip, the transfer process, the FAQ and the closing CTA all disappear;
  structured data flips to `SoldOut`, and the meta title and description change
  to their sold variants.

> **Set this the moment a deal is agreed, not after the transfer completes.**
> Once the buyer repoints the DNS, nobody reaches this page any more and the
> edit is moot.

Adding a state produces a compile error at every render site that branches on
`mode`. That is deliberate — a site that was missed would otherwise quietly keep
rendering a buying prompt for a domain that is no longer for sale.

The FAQ answer to "is the asking price firm?" is derived from this same value, so
it can never contradict the hero.

**Comparable prices** each declare how their price cell should render, and the
type enforces that the price agrees with it:

```ts
{ …, display: "price", amount: 38_024, currency: "CNY", checkedAt: "2026-10-01", liveQuery: "astramodel.com" }
{ …, display: "make-offer", checkedAt: "2026-10-01", liveQuery: null }
{ …, display: "unchecked", liveQuery: null }
```

- `price` — requires `amount`, `currency` **and** `checkedAt`.
- `make-offer` — the seller publishes no price. Renders words, never a `0` or a
  `—` (a dash reads as "free").
- `unchecked` — you have not read the listing yet. Renders "Awaiting check", but
  still links out so a visitor can go look.

Store each amount **in the currency its source quoted** (`currency`) rather than
pre-converting. Converting here would bake today's rate into the data and make
the number impossible to check against the listing.

`checkedAt` is required by the type, so a comparable cannot exist without a date.
Once a date is more than 30 days old the row switches to a warning treatment
(icon **and** label — never colour alone) and the build prints a warning.

**Never estimate a comparable's price.** An invented figure in that table is the
one thing that would undermine the whole page — and the automatic refresh exists
precisely so that estimating is never necessary.

---

## How comparable prices refresh

Atom.com and Sedo both block automated access to their own listing pages, and
their seller APIs are gated behind volume thresholds a single domain will never
meet. Going direct is a dead end.

**But Aliyun's domain marketplace aggregates both.** Responses from
`domainapi.aliyun.com/onsale/saleSearch.jsonp` carry an `orgPlatForm` field that
is literally `"atom"` or `"sedo"` — so one free, unauthenticated JSON endpoint
covers the listings from both marketplaces at once. That is what `lib/prices.ts`
uses. It quotes RMB.

Three things to know about it:

- **It is undocumented and rate-limited.** A handful of rapid requests trips a
  bot challenge that answers with an HTML page instead of JSON; it clears in
  roughly 90 seconds. Requests are therefore spaced 6s apart, which is why a
  cold page render takes ~12s.
- **It is fuzzy.** Querying `astramodel.com` also returns `astramigo.com`. The
  code requires an exact `domainName` match — a near-miss is treated as "no
  answer", never as "close enough".
- **Every failure degrades to the manual value** in `config/pricing.ts`. A slow
  or hostile upstream cannot fail a build, and a stale-but-correct number always
  beats a missing one.

Prices that came from the feed are marked **`auto`** in the table and dated with
the fetch date. Everything else was read by hand and carries its own date. The
provenance note under the table says which is which.

To opt a domain out of the refresh, set its `liveQuery` to `null` — it will
always use the manual amount.

`pnpm check-prices` reports stale manual values and reminds you that the config
amounts are also the outage fallback.

---

## How prices and currency work

Display currency is bound to the locale — **English in USD, Chinese in CNY** —
but every price is stored in the currency its source actually quoted. That
distinction is the whole design:

| | Rendered as |
|---|---|
| **Native** — already in the display currency | the exact figure: `¥888`, `¥38,024` |
| **Converted** into the display currency | `≈` and rounded: `≈ $5,660`, `≈ ¥6,000` |

Rounding a conversion is not sloppiness — it is the honest presentation, because
a converted number has no precision of its own. The rate moves daily and is
itself an estimate. Showing `$5,660.87` would claim a precision that does not
exist. This matters most for the median and highest tiles, which are statistics
computed *across* currencies: they are marked approximate whenever any
contributing price was converted.

The upshot on the Chinese page is that the Aliyun-sourced comparables appear
**exactly as quoted** (`¥38,024`), because Aliyun quotes RMB natively. Only the
USD-denominated asking price is converted there.

- `lib/fx.ts` fetches `open.er-api.com/v6/latest/USD` (free, no key) with a 3s
  timeout and a 24h ISR revalidate, falling back to a fixed `6.72`. It never
  throws — a build must not fail because a currency API was slow.
- If the live rate is unavailable, the footer wording automatically changes to
  "reference rate" and names the fixed number. **A fallback is never presented
  as live.**
- Bar lengths and the summary tiles are computed on the display currency as a
  shared basis — comparing raw amounts across currencies would make the bars
  meaningless.
- The footer states **the currency the ask is denominated in**, and the English
  page restates a converted hero price in the currency it was quoted in. Both
  derive from `askingPrice.currency` rather than hardcoding one — a hardcoded
  label contradicts itself the moment the ask changes currency, which has
  already happened twice in this repo. Without it stated, a buyer cannot tell
  which currency's figure they would be agreeing to.

---

## Architecture notes

**i18n is hand-rolled, not next-intl.** `i18n/dictionaries/en.ts` exports the
`Dictionary` interface; `zh.ts` is typed as `Dictionary`, so a missing or
mistyped translation is a **compile error** rather than a silent fallback to
English. ~60 strings does not justify a library.

**`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the convention and the
exported function, and changed its default runtime to Node.js. It redirects
un-prefixed paths to a locale using `Accept-Language` (honouring q-values) and
returns **307, never 308** — the destination depends on a request header and must
not be cached permanently. It sets no cookies, so the footer's "no cookies" claim
holds.

**Three client components, everything else is a server component.**
`PriceCounter`, `ThemeToggle`, `CopyEmailButton`. Notably the FAQ uses native
`<details>/<summary>` and the comparison table is plain HTML — shadcn's `Table`
and `Separator` are marked `"use client"`, which would pull a client bundle in
for a static table. shadcn/ui is installed and configured (`components.json`) for
when you need real interactive primitives.

**The comparison renders as cards below `md` and a table above it.** A five-column
table cannot fit a phone, and the usual horizontal-scroll workaround leaks a
page-level horizontal scroll on narrow viewports — Chrome lets a scroll
container's extent escape into the root scroll width once the table is far wider
than the viewport. It was measured leaking at 320px and 360px. Cards remove the
scroll container entirely, so the bug is impossible rather than tuned away.

**CJK font fallback.** Geist ships no CJK glyphs, so the Chinese page would
render tofu boxes. `globals.css` appends a system CJK stack (PingFang SC, Hiragino
Sans GB, Microsoft YaHei, Noto Sans SC/CJK SC, WenQuanYi Micro Hei). A CJK webfont
would cost megabytes per weight — which is why essentially every Chinese site
uses a system stack instead.

**No-JS contract.** The hero price is server-rendered at its final value and only
animates on the client, so it is correct with scripting disabled. The FAQ, the
language switcher and every link work without JS.

### Data colours

The comparison uses an **emphasis** form: one subject, the rest as context. The
three data colours were run through the dataviz validator against both surfaces
and pass on lightness band, CVD separation (ΔE 15.0 light / 12.6 dark, target ≥ 8),
normal-vision separation (21.5 / 20.0, floor 15) and contrast (all ≥ 3:1).

| Token | Light | Dark | Role |
|---|---|---|---|
| `--data` | `#0891b2` | `#0891b2` | subject bar, rules, grid, glow |
| `--data-ink` | `#0e7490` | `#22d3ee` | links and small accent text |
| `--deemphasis` | `#64748b` | `#7d8998` | comparable bars |

The de-emphasis grey deliberately fails the validator's chroma floor — that is
what "de-emphasis" means, and it is legal here because grey is not an identity
hue. Text labels are present beside every bar, so nothing is encoded in colour
alone, and text never wears a data colour.

---

## Deploying

Build and lint run clean; the app is fully static with two ISR routes (the pages)
plus one dynamic route (the OG image).

### 1. Vercel

Push to a Git repo and import it at Vercel, or:

```bash
pnpm dlx vercel        # preview
pnpm dlx vercel --prod # production
```

**Set `CONTACT_EMAIL` in the Vercel project settings before the first deploy** —
the build stops without it. `SITE_URL` is optional and defaults to
`https://argonmodel.com`.

### 2. Domain and DNS

`argonmodel.com` is registered through Alibaba Cloud / HiChina. **The shipped
configuration is a direct connection to Vercel, with no Cloudflare in front:**

| Record | Type | Value | Proxy |
|---|---|---|---|
| `@` | CNAME | the target on Vercel's domain card | DNS only |
| `www` | CNAME | same | DNS only |

On Vercel, the **apex is set as the primary domain** and `www` uses "Redirect to"
to point at it.

> **Use the values Vercel's domain card shows** — they vary per project now; do
> not copy older guides. Vercel recommends a CNAME rather than an A record: DNS
> rules forbid CNAME at the apex, but Cloudflare supports **apex CNAME
> flattening**, so a CNAME works there too.

**Why the apex is primary rather than Vercel's recommended `www`:** Vercel's
reasoning is that the apex can't use a CNAME and would need DNS edits if the IP
changed. This project's apex *does* use a flattened CNAME, so that reason does
not apply. Meanwhile `canonical`, `hreflang` and the sitemap all declare the apex
canonical — making `www` primary would leave the canonical pointing somewhere the
site does not actually serve from.

### 3. About Cloudflare: a wrong turn worth recording

While deploying, `*.vercel.app` preview URLs turned out to be **DNS-poisoned** in
mainland China — `vercel.app` and every subdomain resolve to Facebook IP ranges
(`157.240.2.x` / `2a03:2880:…:face:b00c:…`). From that I concluded Cloudflare was
*required* for Chinese visitors.

**That conclusion was wrong.** What the measurements actually showed:

| Path | Result |
|---|---|
| `*.vercel.app` preview URL | ✗ DNS-poisoned (this part is real) |
| **Custom domain, direct to Vercel** | **✓ works, no proxy needed** |
| Through Cloudflare (orange cloud) | ✓ works, but ~0.1s slower (`cf-ray` showed routing via Los Angeles) |

The mistake was **experimental design**: every SNI used to test "are Vercel's IPs
reachable" was a domain Vercel does not serve (`example.com`, and `argonmodel.com`
*before* it was bound). The variable never changed, yet a constant failure was read
as "the IPs are blocked". The real cause is that **Vercel refuses unconfigured
SNIs** — normal behaviour, not censorship.

**And the orange cloud buys this site almost no CDN benefit:** the response carries
`cf-cache-status: DYNAMIC` (Vercel's `cache-control` tells Cloudflare not to cache),
so the real caching happens at Vercel's edge (`x-vercel-cache: HIT`). What remains
is WAF, DDoS protection, and hiding the origin IP.

**When Cloudflare genuinely is needed:** if Vercel's IPs become actually blocked in
mainland China — which has happened repeatedly over the years, though not in this
round of testing. In that case: keep the record grey-clouded so Vercel can complete
its ACME challenge and issue the certificate → wait for **Valid Configuration** →
only then switch to the orange cloud → set SSL/TLS to **Full (Strict)**
(*never* Flexible, which causes redirect loops). Keep verification TXT and MX
records grey-clouded — Cloudflare does not proxy mail.

### Redirect status codes: why both 307 and 308

This repo uses both. That is not an inconsistency — the two redirects differ in
kind:

| Redirect | Depends on | Code | Why |
|---|---|---|---|
| `www` → apex (configured in Vercel) | Host only — **every visitor goes to the same place** | **308** | A permanent structural redirect; search engines consolidate ranking signals on the target |
| `/` → `/en` or `/zh` (`proxy.ts`) | `Accept-Language` — **visitors land differently** | **307** | With 308, the CDN or browser would permanently cache "`/` means `/en`", sending Chinese readers to the English page |

### Two traps when debugging DNS

- **The local DNS cache lies.** After changing a record, `getent hosts` /
  `nslookup` may still return the old value. Confirm via DoH, which bypasses it:
  `curl -sS -H "accept: application/dns-json" "https://doh.pub/dns-query?name=<domain>&type=A"`
- **When testing whether an IP is reachable, the SNI must be the only variable.**
  Probing with a domain the provider does not serve, and that is not yours, only
  ever yields a constant failure. Test a custom domain with `curl --resolve`.

---

## Before you go live

- [x] `argonmodel.com` points at Vercel (direct, apex primary, `www` 308-redirects)
- [x] `CONTACT_EMAIL` is set in Vercel and live
- [x] `askingPrice` is set to `¥888` (`indicative`), matching the Aliyun listing
- [x] Live price fetching verified on Vercel (the page shows the `auto` tag)
- [x] Listed on Aliyun domain trading; the URL is set in `config/site.ts`
- [ ] Submit `https://argonmodel.com/sitemap.xml` to Google Search Console / Bing
      so the new site gets indexed sooner
- [ ] If you also list the domain on a marketplace, add it to `config/site.ts`;
      third-party proof of ownership is worth more than anything the page claims
