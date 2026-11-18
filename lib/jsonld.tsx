import { site } from "@/content/site";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { localeUrl } from "./seo";

export function businessJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${site.url}/#business`,
    name: site.legalName,
    alternateName: site.name,
    url: localeUrl(locale),
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    image: `${site.url}/${locale}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      postalCode: site.postalCode || undefined,
      addressCountry: "MY",
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    knowsAbout: services.map((s) => s.name[locale]),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "ms" ? "Pemasangan lantai" : "Flooring installation",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name[locale],
          description: s.intro[locale],
          url: localeUrl(locale, `/services/${s.slug}`),
          areaServed: "Malaysia",
        },
      })),
    },
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
