import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { archivo } from "@/lib/fonts";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { businessJsonLd, JsonLd } from "@/lib/jsonld";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollSeam } from "@/components/ui/ScrollSeam";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    ...buildMetadata({ locale, title: t("siteTitle"), description: t("siteDescription"), absoluteTitle: true }),
    title: { default: t("siteTitle"), template: `%s | ${site.name}` },
    applicationName: site.legalName,
    keywords:
      locale === "ms"
        ? ["kontraktor lantai vinil", "lantai vinil", "vinil homogenus hospital", "lantai anti-statik", "lantai vinil sukan", "kimpalan panas vinil"]
        : ["vinyl flooring contractor Malaysia", "homogeneous vinyl hospital", "anti-static flooring", "sports vinyl flooring", "ESD flooring Malaysia", "lantai vinil"],
  };
}

export const viewport: Viewport = {
  themeColor: "#EEF0EE",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale === "ms" ? "ms-MY" : "en-MY"} className={archivo.variable}>
      <body className="min-h-screen bg-slab text-spruce">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-spruce focus:px-4 focus:py-3 focus:text-slab">
            {t("skip")}
          </a>
          <SmoothScroll />
          <ScrollSeam />
          <Navbar />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <WhatsAppFab />
        </NextIntlClientProvider>
        <JsonLd data={businessJsonLd(locale)} />
      </body>
    </html>
  );
}
