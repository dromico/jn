import type { Locale } from "@/i18n/routing";

/** A string written in both site languages. */
export type Localized = Record<Locale, string>;

export function tr(value: Localized | string | undefined, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en;
}
