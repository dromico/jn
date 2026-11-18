import { routing } from "@/i18n/routing";
import { getProject, projects } from "@/content/projects";
import { tr } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Jaya Nexus";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getProject(slug);
  return ogImage({ title: p ? tr(p.title, locale as Locale) : "Jaya Nexus", kicker: p?.location });
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}
