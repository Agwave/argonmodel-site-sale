"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Light by default. The site has no server-side notion of a visitor's
 * preference, so `enableSystem` is off and the toggle is the only thing that
 * switches to dark — the default is then exactly what the config says rather
 * than a guess from the OS.
 *
 * Uses localStorage, not a cookie, so the footer's "no cookies" claim holds.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="argon-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
