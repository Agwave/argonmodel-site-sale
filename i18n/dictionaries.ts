import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { zh } from "./dictionaries/zh";

export type { Dictionary };

/** Both locales are statically imported, so this stays compatible with SSG. */
const dictionaries: Record<Locale, Dictionary> = { en, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
