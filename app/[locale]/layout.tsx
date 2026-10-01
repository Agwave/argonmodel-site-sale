import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { isLocale, localeTags, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/config/site";
import { siteUrl } from "@/lib/env";
import "../globals.css";

// Self-hosted at build time — no runtime request to Google.
// These expose CSS variables only (not a font-family class), so globals.css can
// compose them with a CJK fallback stack. Geist ships no CJK glyphs.
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#080b10" },
  ],
};

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: site.domain,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "zh-CN": "/zh",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: site.domain,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeTags[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeTags[locale]}
      className={cn(geistSans.variable, geistMono.variable, "font-sans")}
      // next-themes writes the theme class onto <html> before paint; that
      // deliberate mismatch is not a hydration bug.
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {/* Hairline grid. A fixed element rather than `background-attachment:
            fixed`, which janks on mobile Safari. Static — painted once, no JS. */}
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none fixed inset-0 -z-10"
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
