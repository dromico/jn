import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";
import { site, whatsappLink } from "@/content/site";
import { getService, services } from "@/content/services";
import { getSteps } from "@/content/process";
import { projectsForService } from "@/content/projects";
import { tr } from "@/content/types";
import { SwatchCanvas } from "@/components/ui/SwatchCanvas";
import { TiltSurface } from "@/components/ui/TiltSurface";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CtaBand } from "@/components/sections/CtaBand";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const s = getService(slug);
  if (!s) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: `/services/${slug}`, title: t("serviceTitle", { name: s.name[locale] }), description: s.intro[locale] });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const tp = await getTranslations("projects");
  const tc = await getTranslations("common");
  const name = service.name[locale];
  const message = t("whatsappText", { name: service.whatsappName[locale] });
  const steps = getSteps(service.steps);
  const related = projectsForService(service.slug);
  const anyTodo = service.specs.some((r) => r.todo);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({ "@type": "Question", name: f.q[locale], acceptedAnswer: { "@type": "Answer", text: f.a[locale] } })),
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: service.intro[locale],
    provider: { "@id": `${site.url}/#business` },
    areaServed: { "@type": "Country", name: "Malaysia" },
    serviceType: name,
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />

      {/* Hero: the floor itself fills the band */}
      <section className="relative overflow-hidden" aria-labelledby="service-title">
        <div aria-hidden="true" className="absolute inset-0">
          <TiltSurface className="absolute inset-0">
            <SwatchCanvas kind={service.texture} density={1.6} />
          </TiltSurface>
          <div className="absolute inset-x-0 bottom-0 h-2" style={{ background: service.edge }} />
        </div>
        <div className="wrap relative flex min-h-[460px] items-end pb-12 pt-24 sm:min-h-[520px]">
          <div className="max-w-[640px] rounded-md bg-slab/95 p-6 shadow-[0_10px_30px_rgba(35,49,45,0.12)] backdrop-blur-sm sm:p-9">
            <nav aria-label="Breadcrumb" className="mb-4 text-[14px] text-stone">
              <Link href="/services" className="text-stone hover:text-vinyl">
                {t("allServices")}
              </Link>
            </nav>
            <h1 id="service-title" className="display text-[36px] sm:text-[52px]">
              {name}
            </h1>
            <p className="mt-4 text-[17px] text-ink-soft sm:text-[18px]">{service.intro[locale]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon />}>
                {tc("whatsappQuote")}
              </ButtonLink>
              <Link href="/projects" className={buttonClass("outline")}>
                {tc("seeProjects")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview and applications */}
      <section className="wrap grid gap-12 py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
        <div>
          <h2 className="display text-[28px] sm:text-[36px]">{t("overview")}</h2>
          {service.overview.map((p, i) => (
            <p key={i} className="measure mt-5 text-[17px] leading-[1.65] text-ink-soft">
              {p[locale]}
            </p>
          ))}
        </div>
        <div>
          <h2 className="text-[18px] font-semibold">{t("applications")}</h2>
          <ul className="mt-4 border-t border-hairline">
            {service.applications.map((a, i) => (
              <li key={i} className="border-b border-hairline py-3 text-[16px]">
                {a[locale]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Spec table */}
      <section className="wrap pb-20" aria-labelledby="spec-title">
        <h2 id="spec-title" className="display text-[28px] sm:text-[36px]">
          {t("specs")}
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-[16px]">
            <tbody>
              {service.specs.map((row, i) => (
                <tr key={i} className="border-t border-hairline last:border-b">
                  <th scope="row" className="w-[40%] py-4 pr-6 font-normal text-stone">
                    {row.label[locale]}
                  </th>
                  <td className="py-4 tabular-nums">{row.value[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[14px] text-stone">{anyTodo ? t("specTodo") : t("specNote")}</p>
      </section>

      {/* Process */}
      <section className="on-dark bg-spruce py-20 text-on-dark" aria-labelledby="process-title">
        <div className="wrap">
          <h2 id="process-title" className="display text-[28px] text-on-dark sm:text-[36px]">
            {t("process")}
          </h2>
          <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.id} className="border-t border-dark-line pt-5">
                <span className="wide block text-[28px] font-bold leading-none text-[#9AA8A3]">{i + 1}</span>
                <h3 className="mb-2 mt-3 text-[18px] font-semibold">{s.title[locale]}</h3>
                <p className="text-[15px] text-on-dark-muted">{s.body[locale]}</p>
                {s.figure && <p className="mt-3 inline-block rounded-sm border border-dark-line px-2 py-1 text-[13px]">{s.figure[locale]}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related projects */}
      <section className="wrap py-20" aria-labelledby="related-title">
        <h2 id="related-title" className="display text-[28px] sm:text-[36px]">
          {t("related")}
        </h2>
        {related.length ? (
          <ul className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <ProjectCard
                  project={p}
                  locale={locale}
                  labels={{
                    placeholder: tp("placeholder"),
                    sector: p.sector ? tp(`sectors.${p.sector}`) : undefined,
                    photo: tc("placeholderPhoto", { what: tr(p.title, locale) }),
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-ink-soft">{t("noRelated")}</p>
        )}
      </section>

      {/* FAQ */}
      <section className="wrap grid gap-10 pb-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20" aria-labelledby="faq-title">
        <h2 id="faq-title" className="display text-[28px] sm:text-[36px]">
          {t("faq")}
        </h2>
        <Accordion items={service.faq.map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
      </section>

      <CtaBand title={t("ctaTitle", { name: service.whatsappName[locale] })} body={t("ctaBody")} button={tc("whatsappQuote")} message={message} />
    </>
  );
}
