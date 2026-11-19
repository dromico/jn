import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { process } from "@/content/process";
import { equipment } from "@/content/equipment";
import { site } from "@/content/site";
import { clients } from "@/content/clients";
import { getFeaturedProject } from "@/content/projects";
import { Hero } from "@/components/hero/Hero";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { SampleSwatch } from "@/components/ui/SampleSwatch";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { ToolsGrid } from "@/components/sections/ToolsGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("siteTitle"), description: t("siteDescription"), absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const featured = getFeaturedProject();

  const stats = [
    { value: site.stats.years, label: t("statYears") },
    { value: site.stats.squareMetres, label: t("statM2") },
    { value: site.stats.projects, label: t("statProjects") },
  ];

  return (
    <>
      <Hero />

      <section className="wrap grid items-end gap-10 border-t border-hairline pb-10 pt-12 lg:grid-cols-[minmax(0,6fr)_repeat(3,minmax(0,2fr))]" aria-label={t("intro")}>
        <p className="max-w-[24em] text-[22px] leading-[1.3] tracking-[-0.015em] sm:text-[28px]">{t("intro")}</p>
        <dl className="contents">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-[14px] text-stone">{s.label}</dt>
              <dd className="display text-[40px] sm:text-[44px]">
                <NumberTicker value={s.value} locale={locale} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap pb-24 pt-16 sm:pt-20" aria-labelledby="board-title">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="board-title" className="display max-w-[14em] text-[32px] sm:text-[44px]">
            {t("boardTitle")}
          </h2>
          <Link href="/services" className="text-[15px] font-semibold text-spruce hover:text-vinyl">
            {t("boardLink")}
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-6">
          {services.map((s) => (
            <li key={s.slug}>
              <SampleSwatch slug={s.slug} texture={s.texture} edge={s.edge} name={s.name[locale]} use={s.use[locale]} />
            </li>
          ))}
        </ul>
        <p className="mt-6 hidden text-[13px] text-stone sm:block">{t("boardHint")}</p>
      </section>

      <ProcessTimeline
        title={t("processTitle")}
        sub={t("processSub")}
        steps={process.map((s, i) => ({ n: i + 1, title: s.title[locale], body: s.body[locale], figure: s.figure?.[locale] }))}
      />

      {featured && <FeaturedProject project={featured} locale={locale} />}

      <section className="wrap pb-20 pt-6 sm:pb-24" aria-labelledby="tools-title">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="tools-title" className="display text-[32px] sm:text-[44px]">
              {t("toolsTitle")}
            </h2>
            <p className="mt-3 max-w-[34em] text-[17px] text-ink-soft">{t("toolsSub")}</p>
          </div>
          <Link href="/about#equipment" className="text-[15px] font-semibold text-spruce hover:text-vinyl">
            {t("toolsLink")}
          </Link>
        </div>
        <ToolsGrid tools={equipment.filter((e) => e.featured)} locale={locale} />
      </section>

      <section className="border-y border-hairline">
        <div className="wrap flex flex-wrap items-center gap-x-10 gap-y-4 py-8">
          <p className="shrink-0 text-[15px] text-stone">{t("clients")}</p>
          <LogoMarquee className="min-w-0 flex-1" label={t("clients")} items={clients.map((c, i) => ({ ...c, name: c.src ? c.name : `${t("clientLogo")} ${i + 1}` }))} />
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} body={t("ctaBody")} button={tc("startQuote")} />
    </>
  );
}
