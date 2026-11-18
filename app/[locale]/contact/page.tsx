import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { site, whatsappLink } from "@/content/site";
import { QuoteBuilder } from "@/components/contact/QuoteBuilder";
import { MapEmbed } from "@/components/contact/MapEmbed";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/contact", title: t("contactTitle"), description: t("contactDescription") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("contact");

  const details: [string, React.ReactNode][] = [
    ["WhatsApp", <a key="wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">+{site.whatsapp}</a>],
    [t("phone"), <a key="tel" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>],
    [t("email"), <a key="mail" href={`mailto:${site.email}`}>{site.email}</a>],
    [t("address"), site.address],
    [t("hours"), site.hours[locale]],
  ];

  return (
    <>
      <header className="wrap pb-10 pt-14 sm:pt-20">
        <h1 className="display text-[40px] sm:text-[60px]">{t("title")}</h1>
        <p className="measure mt-5 text-[19px] text-ink-soft">{t("lead")}</p>
      </header>

      <div className="wrap grid gap-14 pb-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <section aria-label={t("title")}>
          <QuoteBuilder services={services.map((s) => ({ value: s.slug, label: s.name[locale] }))} />
        </section>

        <aside aria-labelledby="details-title">
          <h2 id="details-title" className="text-[18px] font-semibold">
            {t("detailsTitle")}
          </h2>
          <dl className="mt-4 border-t border-hairline text-[15px]">
            {details.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5em_1fr] gap-4 border-b border-hairline py-3">
                <dt className="text-stone">{k}</dt>
                <dd className="break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <MapEmbed src={site.mapEmbed} title={t("mapTitle")} className="mt-8 aspect-[4/3] w-full" />
        </aside>
      </div>
    </>
  );
}
