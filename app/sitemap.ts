import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { site } from "@/config/site";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  // A fixed date rather than `new Date()`: the sitemap is prerendered, and a
  // build timestamp would change on every deploy without the content changing.
  const lastModified = new Date(`${site.lastReviewed}T00:00:00Z`);

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        zh: `${siteUrl}/zh`,
        "x-default": `${siteUrl}/en`,
      },
    },
  }));
}
