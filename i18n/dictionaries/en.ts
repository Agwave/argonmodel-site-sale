/**
 * The English dictionary is the source of truth for the site's copy. `zh.ts` is
 * typed as `Dictionary`, so a missing or misspelled translation is a compile
 * error rather than a silent fallback to English.
 *
 * Functions are used where copy needs interpolation. They run on the server —
 * never pass one across the server/client boundary; resolve it to a string first.
 */
/** Identifies the step that carries the recommended-marketplace link. */
export type TransferStepId = "agree" | "escrow" | "transfer";

/** Only `firmness` is substituted at render time; the rest render as written. */
export type FaqId =
  | "negotiable"
  | "firmness"
  | "escrowFee"
  | "timeline"
  | "traffic"
  | "ownership"
  | "whySelling"
  | "trademark";

export interface Dictionary {
  /**
   * Display names for the currencies a price can be denominated in. Lives at the
   * top level because the hero, the comparison table and the footer all need it.
   */
  currencyNames: Record<"USD" | "CNY", string>;
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  header: {
    wordmark: string;
    available: string;
    availableAria: (date: string) => string;
    themeToggle: string;
    languageLabel: string;
    otherLocaleName: string;
  };
  hero: {
    eyebrow: string;
    subhead: string;
    /**
     * Labels the currency the locale *displays*, which is not necessarily the
     * currency the ask is quoted in — the English page shows a USD conversion of
     * a CNY price. Takes the label from `currencyNames` so the two cannot drift.
     */
    priceLabel: (currencyLabel: string) => string;
    priceOnRequest: string;
    /** Shown next to the number so the status can never be separated from it. */
    statusNote: {
      tbd: string;
      indicative: string;
      firm: string;
    };
    /**
     * Shown beneath a converted hero price, restating it in the currency the
     * ask is actually quoted in. Takes the currency name rather than hardcoding
     * one — a hardcoded label silently contradicts itself the moment the ask
     * changes currency.
     */
    originalQuote: (formatted: string, currencyLabel: string) => string;
    ctaPrimary: string;
    ctaSecondary: string;
    copied: string;
    mailSubject: string;
    trust: [string, string, string];
    element: {
      category: string;
      state: string;
    };
  };
  name: {
    heading: string;
    lead: string;
    cards: { title: string; body: string }[];
    stats: string[];
  };
  comparables: {
    heading: string;
    subhead: string;
    columns: {
      domain: string;
      price: string;
      marketplace: string;
      status: string;
      checked: string;
    };
    thisDomain: string;
    forSale: string;
    activeListing: string;
    parked: string;
    makeOffer: string;
    noPublicPrice: string;
    checkedOn: (date: string) => string;
    checkedDaysAgo: (days: number) => string;
    /** Marks a row whose price came from the automatic feed, not a manual read. */
    autoTag: string;
    autoTagTitle: string;
    /**
     * Shown only when this domain is priced below every comparable. An
     * unexplained gap that large reads as a mistake or a scam, so it is better
     * to name the reason. Rendered conditionally — see Comparables.tsx.
     */
    lowPriceTitle: string;
    lowPriceBody: string;
    staleWarning: string;
    provenanceTitle: string;
    provenanceBody: string;
    tiles: {
      median: string;
      medianSub: string;
      highest: string;
      count: string;
      countSub: string;
    };
    barAria: (domain: string, price: string) => string;
    /** Shown when the listing exists but its price has not been read yet. */
    awaitingCheck: string;
  };
  rationale: {
    heading: string;
    lead: string;
    points: string[];
    closing: string;
  };
  transfer: {
    heading: string;
    lead: string;
    steps: { id: TransferStepId; title: string; body: string }[];
    /** Label for the link to the recommended marketplace, shown on `escrow`. */
    aliyunLinkLabel: string;
    feeNote: string;
    noPaymentNote: string;
  };
  faq: {
    heading: string;
    items: { id: FaqId; q: string; a: string }[];
    /**
     * The firmness answer is stored per asking-price mode and substituted in by
     * the component, so it can never contradict what the hero is showing.
     */
    firmnessAnswers: Record<"tbd" | "indicative" | "firm", string>;
  };
  finalCta: {
    heading: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  footer: {
    reviewed: (date: string) => string;
    dataNote: string;
    fxNoteLive: (rate: string, date: string) => string;
    fxNoteFallback: (rate: string) => string;
    /** States the currency the ask is denominated in. Takes the name, not a constant. */
    currencyNote: (currencyLabel: string) => string;
    copyright: string;
    noTracking: string;
  };
  common: {
    externalLink: string;
    opensInNewTab: string;
    backToTop: string;
  };
}

export const en: Dictionary = {
  currencyNames: { USD: "USD", CNY: "CNY" },

  meta: {
    title: "argonmodel.com — premium domain for sale",
    description:
      "argonmodel.com is available for acquisition. Two dictionary words — and since 30 September 2026, one specific meaning: Google's new frontier model is named Argon. Escrow-only transfer, replies within 24 hours.",
    ogAlt: "argonmodel.com — premium domain for sale",
  },

  header: {
    wordmark: "argonmodel.com",
    available: "Available",
    availableAria: (date) => `Available for acquisition, as of ${date}`,
    themeToggle: "Toggle theme",
    languageLabel: "Language",
    otherLocaleName: "中文",
  },

  hero: {
    eyebrow: "Premium domain name · Available for acquisition",
    subhead:
      "Two dictionary words — and since 30 September 2026, one specific meaning: Google's new frontier model is named Argon.",
    priceLabel: (currencyLabel) => `Asking price · ${currencyLabel}`,
    priceOnRequest: "Price on request",
    statusNote: {
      tbd: "No public price — send an offer",
      indicative: "Indicative — subject to confirmation",
      firm: "Firm asking price",
    },
    originalQuote: (formatted, currencyLabel) =>
      `Quoted in ${currencyLabel}: ${formatted}`,
    ctaPrimary: "Email your offer",
    ctaSecondary: "Copy email address",
    copied: "Copied",
    mailSubject: "Offer for argonmodel.com",
    trust: [
      "Escrow-only transactions",
      "Transfer in 1–7 days",
      "Replies within 24 hours",
    ],
    element: {
      category: "Noble gas",
      state: "Inert · unreactive",
    },
  },

  name: {
    heading: "Why this name, why now",
    lead: "It has always read like a product rather than a placeholder. As of 30 September 2026, it also reads as something current.",
    cards: [
      {
        title: "Argon is now a model name",
        body: "On 30 September 2026, Google announced Gemini 4 Argon, describing it as its most capable model to date; early coverage placed it at the top of several reasoning and security benchmarks. A word that previously meant only a chemical element is now also the name of a frontier AI model.",
      },
      {
        title: "And the word already means something",
        body: "Argon is a noble gas: inert, unreactive, stable. It is the element that refuses to react with anything — which is exactly why it fills light bulbs and shields welds. In security engineering, Argon2 is the password-hashing standard. The word carried a meaning long before it carried a brand.",
      },
      {
        title: "Model — the noun of the decade",
        body: "Foundation model. Language model. Diffusion model. Every company in the category organises itself around this one word. Owning it in a compound is owning a category descriptor.",
      },
      {
        title: "Together: a stable model",
        body: "Read literally, argonmodel says “stable model” — inert in the sense of not degrading, not drifting, not reacting to what it should not. That is a claim nearly every AI company is trying to make, and very few names make it by accident. Category-descriptive and brandable at once: the rarest combination in naming, and why two-word .com compounds are the most contested space in the aftermarket.",
      },
    ],
    stats: [
      "11 characters",
      "2 words",
      "Both dictionary words",
      ".com",
      "No hyphens",
      "No numbers",
    ],
  },

  comparables: {
    heading: "What comparable names are asking",
    subhead:
      "Asking prices for similar .com names, each dated to when it was last verified. A listing price is what a seller hopes to get — it is not a sale price.",
    columns: {
      domain: "Domain",
      price: "Asking price",
      marketplace: "Listed on",
      status: "Status",
      checked: "Price checked",
    },
    thisDomain: "This domain",
    forSale: "For sale",
    activeListing: "Active listing",
    parked: "Parked",
    makeOffer: "Make offer",
    noPublicPrice: "no public price",
    checkedOn: (date) => `Checked ${date}`,
    checkedDaysAgo: (days) =>
      days === 1 ? "checked 1 day ago" : `checked ${days} days ago`,
    autoTag: "auto",
    autoTagTitle:
      "Refreshed automatically from a public marketplace feed; the date shown is when it was last fetched.",
    lowPriceTitle: "Why this one is priced below the rest",
    lowPriceBody:
      "It is a deliberate quick-sale price — not a valuation, and not a markdown from a higher ask. The figures above are other sellers' opening positions; this one is set to close. A low price here says nothing about the quality of the name, and it is the same number you will find on the public listing.",
    staleWarning:
      "Some prices below were last checked more than 30 days ago and may have changed.",
    provenanceTitle: "Where these numbers come from",
    provenanceBody:
      "Rows marked “auto” are refreshed from Aliyun's public domain-marketplace feed, which aggregates listings from Atom, Sedo and others; the date shown is when it was last fetched. The rest were read by hand from the listing linked above. Every figure here is another seller's asking price — not an appraised value and not a completed sale — and any of them can change or disappear at any time. Verify at the source before relying on them.",
    tiles: {
      median: "Median of the listings shown",
      medianSub: "Not an appraisal",
      highest: "Highest listing shown",
      count: "Listings compared",
      countSub: "Includes this domain",
    },
    barAria: (domain, price) => `${domain} asking price ${price}`,
    awaitingCheck: "Awaiting check",
  },

  rationale: {
    heading: "How the asking price was set",
    lead: "This is a seller's asking price. Domain values are opinion, not fact — which is why every number on this page is labelled as an ask.",
    points: [
      "Two dictionary words in a .com compound — the scarcest and most contested format in the aftermarket.",
      "A second word that names the category. “Model” is not decoration; it is the noun the AI industry is built on.",
      "Passes the radio test: say it once, and the listener can spell it.",
      "No hyphens, no numbers, no misspellings to explain.",
      "The name is now specific. A generic compound is worth one thing; one that points at a live frontier model is worth another.",
    ],
    closing:
      "Reasonable offers are considered. The number above is an opening position, not a threshold.",
  },

  transfer: {
    heading: "How the transfer works",
    lead: "No forms, no accounts, no payment on this site. Two routes, and we recommend the first.",
    steps: [
      {
        id: "agree",
        title: "Agree on a price",
        body: "Email us. We reply within 24 hours with a yes, a counter, or a no.",
      },
      {
        id: "escrow",
        title: "Pay into escrow",
        body: "We recommend Aliyun's domain trading service: the domain is already registered there, so escrow and transfer happen in one step and the handover takes minutes. If you would rather use an international provider, Escrow.com, Dan.com and Afternic are equally acceptable. Whoever holds the funds, it is never us.",
      },
      {
        id: "transfer",
        title: "Transfer",
        body: "Aliyun to Aliyun is a same-registrar push — minutes, and outside ICANN's transfer window. Any other route is a cross-registrar transfer, which ICANN permits only 60 days after registration; this domain was registered on 1 October 2026. Funds are released once you confirm you control the name.",
      },
    ],
    aliyunLinkLabel: "Aliyun domain trading",
    feeNote:
      "Any platform or escrow fee is agreed in writing before the transaction starts. Nothing is ever paid to us directly.",
    noPaymentNote:
      "This site takes no payment and collects no personal data. There is no form to fill in.",
  },

  faq: {
    heading: "Questions",
    items: [
      {
        id: "negotiable",
        q: "Is the price negotiable?",
        a: "Yes. Send an offer. Reasonable offers get a real answer, not a form letter.",
      },
      {
        id: "firmness",
        q: "Is the asking price firm?",
        // Replaced at render time by firmnessAnswers[askingPrice.mode].
        a: "",
      },
      {
        id: "escrowFee",
        q: "Who pays escrow fees?",
        a: "The buyer, unless we agree otherwise in writing first.",
      },
      {
        id: "timeline",
        q: "How long does the transfer take?",
        a: "A same-registrar push can complete the same day. A cross-registrar transfer typically takes 5–7 days, governed by ICANN rules.",
      },
      {
        id: "traffic",
        q: "Does the domain have traffic or revenue?",
        a: "No traffic or revenue claims are made on this page. This listing is about the name, not a business. If that changes, it will be stated here with evidence.",
      },
      {
        id: "ownership",
        q: "Are you the owner?",
        a: "Yes. The strongest check available is the public listing: this domain is offered through Aliyun's domain trading service, linked at the foot of this page, and a listing there is created only after the seller proves control of the domain. Two weaker signals are also visible — the registrar's WHOIS record is redacted so it proves nothing on its own, and this page being served from the domain shows only that its publisher controls the DNS. The decisive verification still happens at the transfer: escrow confirms the seller controls the name before releasing funds.",
      },
      {
        id: "whySelling",
        q: "Why are you selling?",
        a: "The name deserves an operator. We are not one for this category.",
      },
      {
        id: "trademark",
        q: "Are there trademark conflicts?",
        a: "This listing makes no trademark claim, and implies no affiliation with, sponsorship by, or endorsement from any company that uses “Argon” as a product name. Trademark rights are territorial and fact-specific. Buyers are responsible for their own clearance in the jurisdictions they intend to operate in, before putting the name to commercial use.",
      },
    ],
    firmnessAnswers: {
      tbd: "No price is published yet, so there is nothing to hold firm to. Send an offer and we will respond with a concrete number or a counter.",
      indicative:
        "It is an indicative asking price, not a final quote. The binding number is whatever we agree to in writing before escrow opens.",
      firm: "It is the asking price. We will consider offers below it, but we will not treat the number itself as a starting bid.",
    },
  },

  finalCta: {
    heading: "Make an offer on argonmodel.com",
    body: "One email is enough. No forms, no accounts, no obligation.",
    ctaPrimary: "Email your offer",
    ctaSecondary: "Copy email address",
    note: "Replies within 24 hours, usually much sooner.",
  },

  footer: {
    reviewed: (date) => `Data last reviewed: ${date}`,
    dataNote:
      "Comparable prices are manually checked public asking prices — not appraisals and not completed sale prices.",
    fxNoteLive: (rate, date) =>
      `CNY figures are converted at 1 USD = ${rate} CNY from open.er-api.com, last updated ${date}.`,
    fxNoteFallback: (rate) =>
      `CNY figures are converted at a fixed reference rate of 1 USD = ${rate} CNY. The live rate was unavailable when this page was last built.`,
    currencyNote: (currencyLabel) =>
      `The asking price is denominated in ${currencyLabel}.`,
    copyright: "© 2026 · A private domain sale listing.",
    noTracking: "No cookies, no analytics, no third-party trackers.",
  },

  common: {
    externalLink: "External link",
    opensInNewTab: "opens in a new tab",
    backToTop: "Back to top",
  },
};
