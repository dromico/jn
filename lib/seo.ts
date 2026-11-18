import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/content/site";

/** Path without locale, e.g. "/services/carpet" ("" for home). */
export function localeUrl(locale: Locale, path = "") {
  return `${site.url}/${locale}${path}`;
}

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l === "ms" ? "ms-MY" : "en-MY", localeUrl(l, path)]));
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localeUrl(locale, path),
      languages: { ...languages, "x-default": localeUrl(routing.defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      siteName: site.legalName,
      locale: locale === "ms" ? "ms_MY" : "en_MY",
      url: localeUrl(locale, path),
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
