import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";
import { site } from "@/content/site";
import { getService } from "@/content/services";
import { formatDate, getProject, projects } from "@/content/projects";
import { tr } from "@/content/types";
import { Photo } from "@/components/ui/Placeholder";
import { Gallery } from "@/components/projects/Gallery";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { BeforeAfter } from "@/components/sections/FeaturedProject";
import { CtaBand } from "@/components/sections/CtaBand";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const p = getProject(slug);
  if (!p) return {};
  return buildMetadata({ locale, path: `/projects/${slug}`, title: tr(p.title, locale), description: tr(p.summary ?? p.scope ?? p.title, locale) });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const tc = await getTranslations("common");
  const title = tr(project.title, locale);
  const floors = (project.services ?? []).map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => !!s);
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  const facts: [string, React.ReactNode][] = [];
  if (project.client) facts.push([t("client"), project.client]);
  if (project.location) facts.push([t("location"), project.location]);
  if (floors.length)
    facts.push([
      t("floors"),
      floors.map((f, i) => (
        <span key={f.slug}>
          {i > 0 && ", "}
          <Link href={`/services/${f.slug}`}>{f.name[locale]}</Link>
        </span>
      )),
    ]);
  facts.push([t("area"), project.areaM2 ? `${project.areaM2.toLocaleString(locale === "ms" ? "ms-MY" : "en-MY")} m²` : tc("todo")]);
  if (project.startDate) facts.push([t("started"), formatDate(project.startDate, locale)]);
  if (project.duration) facts.push([t("duration"), tr(project.duration, locale)]);

  const story = (["challenge", "approach", "result"] as const).filter((k) => project[k]);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: tr(project.summary ?? project.scope, locale) || undefined,
    url: localeUrl(locale, `/projects/${project.slug}`),
    creator: { "@id": `${site.url}/#business` },
    locationCreated: project.location ? { "@type": "Place", name: project.location } : undefined,
    dateCreated: project.startDate,
    image: project.cover ? `${site.url}${project.cover}` : undefined,
  };

  return (
    <>
      <JsonLd data={ld} />
      <article>
        <header className="wrap pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-5 text-[14px]">
            <Link href="/projects" className="text-stone hover:text-vinyl">
              {t("back")}
            </Link>
          </nav>
          {project.placeholder && <p className="mb-4 inline-block rounded-sm border border-hairline-strong px-2 py-1 text-[13px] text-stone">{t("placeholder")}</p>}
          <h1 className="display max-w-[18em] text-[36px] sm:text-[56px]">{title}</h1>
          {project.summary && <p className="measure mt-6 text-[19px] leading-[1.55] text-ink-soft">{tr(project.summary, locale)}</p>}
        </header>

        <section className="wrap grid gap-10 pb-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
          <Photo src={project.cover} alt={title} label={tc("placeholderPhoto", { what: title })} className="aspect-[16/10]" priority sizes="(min-width: 1024px) 60vw, 100vw" />
          <div>
            <dl className="grid grid-cols-[8em_1fr] gap-x-5 gap-y-3 border-t border-hairline pt-5 text-[15px]">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-stone">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {project.scope && (
              <div className="mt-8 border-t border-hairline pt-5">
                <h2 className="text-[15px] text-stone">{t("scope")}</h2>
                <p className="mt-2 text-[16px]">{tr(project.scope, locale)}</p>
              </div>
            )}
            {project.phases && project.phases.length > 0 && (
              <div className="mt-8 border-t border-hairline pt-5">
                <h2 className="text-[15px] text-stone">{t("phases")}</h2>
                <ol className="mt-3 grid gap-3">
                  {project.phases.map((ph) => (
                    <li key={ph.name} className="rounded-sm border border-hairline bg-white px-4 py-3">
                      <p className="font-semibold">{ph.name}</p>
                      {ph.zones && <p className="text-[15px] text-ink-soft">{tr(ph.zones, locale)}</p>}
                      {ph.startDate && <p className="text-[14px] text-stone">{t("started")}: {formatDate(ph.startDate, locale)}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>

        {story.length > 0 && (
          <section className="border-y border-hairline bg-white/40">
            <div className="wrap grid gap-12 py-16 lg:grid-cols-3 lg:gap-10">
              {story.map((k) => (
                <div key={k}>
                  <h2 className="display text-[24px] sm:text-[28px]">{t(k)}</h2>
                  <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">{tr(project[k], locale)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(
          <section className="wrap py-16" aria-labelledby="compare-title">
            <h2 id="compare-title" className="display mb-8 text-[28px] sm:text-[36px]">
              {t("compareTitle")}
            </h2>
            <BeforeAfter project={project} locale={locale} className="h-[320px] sm:h-[480px] lg:h-[600px]" />
          </section>
        )}

        <section className="wrap pb-16" aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="display mb-6 text-[28px] sm:text-[36px]">
            {t("gallery")}
          </h2>
          <Gallery
            title={title}
            photos={project.photos}
            labels={{
              sebelum: t("sebelum"),
              semasa: t("semasa"),
              selepas: t("selepas"),
              sebelumLong: t("sebelumLong"),
              semasaLong: t("semasaLong"),
              selepasLong: t("selepasLong"),
              noPhotos: t("noPhotos"),
              close: t("close"),
              next: t("next"),
              prev: t("prev"),
              open: t("openPhoto", { n: "{n}" }),
              slot: t("photoSlot", { n: "{n}", stage: "{stage}" }),
            }}
          />
        </section>
      </article>

      {others.length > 0 && (
        <section className="wrap border-t border-hairline py-16" aria-labelledby="others-title">
          <h2 id="others-title" className="display mb-10 text-[28px] sm:text-[36px]">
            {t("otherProjects")}
          </h2>
          <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} locale={locale} labels={{ placeholder: t("placeholder"), sector: p.sector ? t(`sectors.${p.sector}`) : undefined, photo: tc("placeholderPhoto", { what: tr(p.title, locale) }) }} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand title={t("ctaTitle")} body={t("ctaBody")} button={tc("startQuote")} />
    </>
  );
}
