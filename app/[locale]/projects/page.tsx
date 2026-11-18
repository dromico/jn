import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { getService, services } from "@/content/services";
import { projects, type Sector } from "@/content/projects";
import { tr } from "@/content/types";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/projects", title: t("projectsTitle"), description: t("projectsDescription") });
}

const SECTORS: Sector[] = ["healthcare", "education", "commercial", "data-centre", "sports", "hospitality", "residential", "religious", "industrial"];

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("projects");
  const tc = await getTranslations("common");

  return (
    <>
      <header className="wrap pb-10 pt-14 sm:pt-20">
        <h1 className="display text-[40px] sm:text-[60px]">{t("title")}</h1>
        <p className="measure mt-5 text-[19px] text-ink-soft">{t("lead")}</p>
      </header>
      <section className="wrap pb-8">
        <ProjectGrid
          projects={projects.map((p) => ({
            slug: p.slug,
            title: tr(p.title, locale),
            meta: [p.location, (p.services ?? []).map((s) => getService(s)?.name[locale]).join(", "), p.sector ? t(`sectors.${p.sector}`) : ""].filter(Boolean).join(". "),
            services: p.services ?? [],
            sector: p.sector,
            cover: p.cover,
            photoLabel: tc("placeholderPhoto", { what: tr(p.title, locale) }),
            placeholder: p.placeholder,
          }))}
          serviceOptions={services.filter((s) => projects.some((p) => p.services?.includes(s.slug))).map((s) => ({ value: s.slug, label: s.name[locale] }))}
          sectorOptions={SECTORS.map((s) => ({ value: s, label: t(`sectors.${s}`) }))}
          labels={{
            service: t("filterService"),
            sector: t("filterSector"),
            all: t("all"),
            empty: t("empty"),
            placeholder: t("placeholder"),
            countTemplate: { zero: t("count", { count: 0 }), one: t("count", { count: 1 }).replace("1", "#"), other: t("count", { count: 2 }).replace("2", "#") },
          }}
        />
      </section>
      <CtaBand title={t("ctaTitle")} body={t("ctaBody")} button={tc("startQuote")} />
    </>
  );
}
