import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate, type Project } from "@/content/projects";
import { getService } from "@/content/services";
import { tr } from "@/content/types";
import { ImageCompare } from "@/components/ui/ImageCompare";
import { Photo } from "@/components/ui/Placeholder";

/** The first before/after pair, or labelled placeholders until photos arrive. */
export async function BeforeAfter({ project, locale, className }: { project: Project; locale: Locale; className?: string }) {
  const t = await getTranslations("compare");
  const place = project.phases?.[0]?.zones ? tr(project.phases[0].zones, locale).split(/ and | dan /)[0] : tr(project.title, locale);
  const before = project.photos.sebelum[0];
  const after = project.photos.selepas[0];
  const title = tr(project.title, locale);
  return (
    <ImageCompare
      className={className}
      beforeLabel={t("before")}
      afterLabel={t("after")}
      handleLabel={t("handle")}
      before={<Photo src={before} alt={`${title}: ${t("beforePhoto", { place })}`} label={tr({ en: "Photo: ", ms: "Foto: " }, locale) + t("beforePhoto", { place })} tone="stone" labelAlign="start" className="size-full rounded-none" sizes="(min-width: 1024px) 58vw, 100vw" />}
      after={<Photo src={after} alt={`${title}: ${t("afterPhoto", { place })}`} label={tr({ en: "Photo: ", ms: "Foto: " }, locale) + t("afterPhoto", { place })} tone="mint" labelAlign="end" className="size-full rounded-none" sizes="(min-width: 1024px) 58vw, 100vw" />}
    />
  );
}

export async function FeaturedProject({ project, locale }: { project: Project; locale: Locale }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const floors = (project.services ?? []).map((s) => getService(s)?.name[locale]).filter(Boolean);

  return (
    <section className="wrap py-20 sm:py-24" aria-labelledby="featured-title">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <BeforeAfter project={project} locale={locale} className="h-[340px] sm:h-[460px] lg:h-[520px]" />
        <div>
          <p className="mb-3 text-[15px] text-stone">{t("featured")}</p>
          <h2 id="featured-title" className="display mb-5 text-[32px] leading-[1.05] sm:text-[40px]">
            {tr(project.title, locale)}
          </h2>
          {project.summary && <p className="mb-7 text-[17px] leading-[1.6] text-ink-soft">{tr(project.summary, locale)}</p>}
          {project.phases && project.phases.length > 0 && (
            <ul className="mb-7 flex flex-wrap gap-2">
              {project.phases.map((ph, i) => (
                <li key={ph.name} className={i === 0 ? "rounded-sm bg-spruce px-3 py-2 text-[13px] font-semibold text-slab" : "rounded-sm border border-hairline-strong px-3 py-[7px] text-[13px]"}>
                  {ph.name}
                  {ph.zones ? `: ${tr(ph.zones, locale)}` : ""}
                </li>
              ))}
            </ul>
          )}
          <dl className="mb-8 grid grid-cols-[7em_1fr] gap-x-5 gap-y-2.5 border-t border-hairline pt-5 text-[15px]">
            {project.client && (
              <>
                <dt className="text-stone">{t("site")}</dt>
                <dd>{project.client}</dd>
              </>
            )}
            {project.location && (
              <>
                <dt className="text-stone">{t("location")}</dt>
                <dd>{project.location}</dd>
              </>
            )}
            {floors.length > 0 && (
              <>
                <dt className="text-stone">{t("floor")}</dt>
                <dd>{floors.join(", ")}</dd>
              </>
            )}
            <dt className="text-stone">{t("area")}</dt>
            <dd>{project.areaM2 ? `${project.areaM2.toLocaleString(locale === "ms" ? "ms-MY" : "en-MY")} m²` : tc("todo")}</dd>
            {project.startDate && (
              <>
                <dt className="text-stone">{t("started")}</dt>
                <dd>{formatDate(project.startDate, locale)}</dd>
              </>
            )}
          </dl>
          <Link href={`/projects/${project.slug}`} className="text-[16px] font-semibold text-spruce hover:text-vinyl">
            {tc("readHow")}
          </Link>
        </div>
      </div>
    </section>
  );
}
