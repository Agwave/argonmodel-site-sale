import { notFound } from "next/navigation";
import { isLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { askingPrice, publishedPrice } from "@/config/pricing";
import { site } from "@/config/site";
import { siteUrl } from "@/lib/env";
import { formatDate, makePriceFormatter } from "@/lib/format";
import { getUsdCny, type FxRate } from "@/lib/fx";
import { fetchLivePrices } from "@/lib/prices";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { NameBreakdown } from "@/components/sections/NameBreakdown";
import { Comparables } from "@/components/sections/Comparables";
import { PricingRationale } from "@/components/sections/PricingRationale";
import { TransferProcess } from "@/components/sections/TransferProcess";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteFooter } from "@/components/sections/SiteFooter";

/**
 * Daily, so the exchange rate and the "rate as of" date stay current. The page
 * is otherwise static — there is no per-request work.
 */
export const revalidate = 86_400;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  // Both are best-effort: each degrades to a documented fallback, so a slow or
  // hostile upstream can never fail the build.
  const [fx, livePrices] = await Promise.all([getUsdCny(), fetchLivePrices()]);

  // One clock for the whole render, so staleness and the review date agree.
  const now = new Date();
  const lastReviewed = formatDate(site.lastReviewed, locale);
  const isSold = askingPrice.mode === "sold";

  return (
    <>
      <StructuredData
        dict={dict}
        locale={locale}
        fx={fx}
        lastReviewed={site.lastReviewed}
      />

      <SiteHeader dict={dict} locale={locale} lastReviewed={lastReviewed} />

      <main>
        <Hero dict={dict} locale={locale} fx={fx} />
        <NameBreakdown dict={dict} />
        <Comparables
          dict={dict}
          locale={locale}
          fx={fx}
          now={now}
          livePrices={livePrices}
        />
        <PricingRationale dict={dict} />
        {/* The remaining sections exist to transact. With the domain sold there
            is nothing to buy, so they are dropped rather than left to advertise
            a purchase that cannot happen. */}
        {!isSold && (
          <>
            <TransferProcess dict={dict} />
            <Faq dict={dict} />
            <FinalCta dict={dict} />
          </>
        )}
      </main>

      <SiteFooter dict={dict} locale={locale} fx={fx} lastReviewed={lastReviewed} />
    </>
  );
}

/**
 * Schema.org listing data. An offer is only emitted when a price is actually
 * published — a `tbd` asking price must not become a price in structured data
 * either, or search engines would surface a number the page never states.
 */
function StructuredData({
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
  const formatPrice = makePriceFormatter(locale, fx);
  const published = publishedPrice(askingPrice);
  const isSold = askingPrice.mode === "sold";

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: site.domain,
    // Must agree with `availability` below — a description still reading
    // "for sale" next to a SoldOut offer is self-contradictory structured data.
    description: isSold ? dict.meta.soldDescription : dict.meta.description,
    url: `${siteUrl}/${locale}`,
    inLanguage: localeTags[locale],
    /**
     * A sold domain must not advertise itself as available anywhere, structured
     * data included. Note this is a top-level branch on `mode`, not a ternary
     * inside the `published` case — `published` is null once sold, so putting the
     * SoldOut branch there would make it unreachable. TypeScript does not flag an
     * unreachable ternary, so only rendering the page catches it.
     */
    ...(askingPrice.mode === "sold"
      ? {
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/SoldOut",
            url: `${siteUrl}/${locale}`,
          },
        }
      : published
        ? {
            offers: {
              "@type": "Offer",
              // The native quote, in its own currency — the amount the seller is
              // actually asking. Converting it here would publish a number the
              // page never states.
              price: published.amount,
              priceCurrency: published.currency,
              availability: "https://schema.org/InStock",
              url: `${siteUrl}/${locale}`,
              description: formatPrice(published.amount, published.currency),
            },
          }
        : {}),
    ...(site.marketplaceListingUrl
      ? { sameAs: [site.marketplaceListingUrl] }
      : {}),
    dateModified: lastReviewed,
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escaping "<" guards against a
      // "</script>" sequence in any config-provided string.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
