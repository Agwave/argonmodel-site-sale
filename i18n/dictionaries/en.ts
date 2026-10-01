/**
 * The English dictionary is the source of truth for the site's copy. `zh.ts` is
 * typed as `Dictionary`, so a missing or misspelled translation is a compile
 * error rather than a silent fallback to English.
 *
 * Functions are used where copy needs interpolation. They run on the server —
 * never pass one across the server/client boundary; resolve it to a string first.
 */
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
     * currency the ask is quoted in — the Chinese page shows a CNY conversion of
     * a USD price. Takes the label from `currencyNames` so the two cannot drift.
     */
    priceLabel: (currencyLabel: string) => string;
    /** Display names for the two display currencies, per locale. */
    currencyNames: Record<"USD" | "CNY", string>;
    priceOnRequest: string;
    /** Shown next to the number so the status can never be separated from it. */
    statusNote: {
      tbd: string;
      indicative: string;
      firm: string;
    };
    /**
     * Shown beneath a converted hero price, restating it in the currency the
     * seller actually quoted — the one the transaction settles in.
     */
    originalQuote: (formatted: string) => string;
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
    steps: { title: string; body: string }[];
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
    currencyNote: string;
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
  meta: {
    title: "argonmodel.com — premium domain for sale",
    description:
      "argonmodel.com is available for acquisition. Two dictionary words, one unmistakable meaning: the model layer of the AI era. Escrow-only transfer, replies within 24 hours.",
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
      "Two dictionary words. One unmistakable meaning — the model layer of the AI era.",
    priceLabel: (currencyLabel) => `Asking price · ${currencyLabel}`,
    currencyNames: { USD: "USD", CNY: "CNY" },
    priceOnRequest: "Price on request",
    statusNote: {
      tbd: "No public price — send an offer",
      indicative: "Indicative — subject to confirmation",
      firm: "Firm asking price",
    },
    originalQuote: (formatted) => `Quoted in USD: ${formatted}`,
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
    heading: "Why argonmodel.com works",
    lead: "It reads like a product, not a placeholder.",
    cards: [
      {
        title: "Argon — element 18",
        body: "A noble gas: stable, inert, unreactive. In security engineering, Argon2 is the password-hashing standard. The word says stability before it says anything else — a useful thing for a model to say.",
      },
      {
        title: "Model — the noun of the decade",
        body: "Foundation model. Language model. Diffusion model. Every company in the category organises itself around this one word. Owning it in a compound is owning a category descriptor.",
      },
      {
        title: "Together: the model layer",
        body: "argonmodel.com reads as a lab, a platform, or a product line. Category-descriptive and brandable at the same time — the rarest combination in naming, and the reason two-word .com compounds are the most contested space in the aftermarket.",
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
      "Priced alongside the comparable asks above, not above them.",
    ],
    closing:
      "Reasonable offers are considered. The number above is an opening position, not a threshold.",
  },

  transfer: {
    heading: "How the transfer works",
    lead: "No forms, no accounts, no payment on this site. Three steps, all of them reversible until you have the domain.",
    steps: [
      {
        title: "Agree on a price",
        body: "Email us. We reply within 24 hours with a yes, a counter, or a no.",
      },
      {
        title: "Escrow",
        body: "You choose the escrow provider — Escrow.com, Dan.com, or Afternic. Funds are held by the escrow service, not by us. We do not accept payment any other way.",
      },
      {
        title: "Transfer",
        body: "We push the domain to your registrar account or provide the authorization code. Minutes for a same-registrar push; up to 7 days for a cross-registrar transfer. Escrow releases funds after you confirm you control the name.",
      },
    ],
    feeNote:
      "Buyer covers the escrow fee unless we agree otherwise in writing before the transaction.",
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
        a: "Yes. Ownership is verifiable through the registrar's public WHOIS record and through the marketplace listing linked on this page.",
      },
      {
        id: "whySelling",
        q: "Why are you selling?",
        a: "The name deserves an operator. We are not one for this category.",
      },
      {
        id: "trademark",
        q: "Are there trademark conflicts?",
        a: "No trademark claim is made or implied by this listing. Buyers are responsible for their own trademark clearance in their jurisdiction.",
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
    currencyNote: "The transaction currency is USD.",
    copyright: "© 2026 · A private domain sale listing.",
    noTracking: "No cookies, no analytics, no third-party trackers.",
  },

  common: {
    externalLink: "External link",
    opensInNewTab: "opens in a new tab",
    backToTop: "Back to top",
  },
};
