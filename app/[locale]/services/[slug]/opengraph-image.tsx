import { routing } from "@/i18n/routing";
import { getService, services } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Jaya Nexus";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const s = getService(slug);
  return ogImage({ title: s ? s.name[locale as Locale] : "Jaya Nexus", kicker: s?.spec[locale as Locale] });
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}
