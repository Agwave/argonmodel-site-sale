"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Dark-first: the palette is designed for the dark surface, so that is the
 * default rather than the visitor's OS preference. An explicit toggle still wins.
 *
 * Uses localStorage, not a cookie, so the footer's "no cookies" claim holds.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="argon-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
