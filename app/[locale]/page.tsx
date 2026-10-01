import { notFound } from "next/navigation";
import { isLocale, localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { askingPrice } from "@/config/pricing";
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
        <TransferProcess dict={dict} />
        <Faq dict={dict} />
        <FinalCta dict={dict} />
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

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: site.domain,
    description: dict.meta.description,
    url: `${siteUrl}/${locale}`,
    inLanguage: localeTags[locale],
    ...(askingPrice.mode === "tbd"
      ? {}
      : {
          offers: {
            "@type": "Offer",
            // The native quote, in its own currency — the amount the seller is
            // actually asking. Converting it here would publish a number the
            // page never states.
            price: askingPrice.amount,
            priceCurrency: askingPrice.currency,
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/${locale}`,
            description: formatPrice(askingPrice.amount, askingPrice.currency),
          },
        }),
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
