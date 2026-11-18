import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { SwatchCanvas } from "@/components/ui/SwatchCanvas";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/services", title: t("servicesTitle"), description: t("servicesDescription") });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("services");
  const th = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <>
      <header className="wrap pb-12 pt-14 sm:pt-20">
        <h1 className="display text-[40px] sm:text-[60px]">{t("title")}</h1>
        <p className="measure mt-5 text-[19px] text-ink-soft">{t("lead")}</p>
      </header>

      <ul className="wrap border-t border-hairline">
        {services.map((s) => (
          <li key={s.slug} className="border-b border-hairline">
            <Link href={`/services/${s.slug}`} className="group grid items-center gap-6 py-8 no-underline sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,18em)] lg:gap-10">
              <span className="block aspect-[4/5] w-[128px] overflow-hidden rounded-xs sm:w-full" style={{ borderBottom: `8px solid ${s.edge}` }}>
                <SwatchCanvas kind={s.texture} />
              </span>
              <span className="block">
                <span className="display block text-[26px] group-hover:text-vinyl sm:text-[32px]">{s.name[locale]}</span>
                <span className="measure mt-3 block text-ink-soft">{s.intro[locale]}</span>
              </span>
              <span className="block text-[15px] text-stone lg:text-right">
                {s.spec[locale]}
                <span className="mt-3 block font-semibold text-spruce group-hover:text-vinyl">{t("more", { name: s.name[locale] })}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <CtaBand title={th("ctaTitle")} body={th("ctaBody")} button={tc("startQuote")} />
    </>
  );
}
