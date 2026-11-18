import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { Hero } from "@/components/hero/Hero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("siteTitle"), description: t("siteDescription"), absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return (
    <>
      <Hero floors={services.map((s) => ({ name: s.name[locale], spec: s.spec[locale] }))} />
      <div className="h-[100vh]" />
    </>
  );
}
