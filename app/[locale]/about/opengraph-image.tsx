import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Jaya Nexus";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return ogImage({ title: t("aboutTitle") });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
