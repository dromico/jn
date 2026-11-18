import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { equipment } from "@/content/equipment";
import { Photo } from "@/components/ui/Placeholder";
import { ToolsGrid } from "@/components/sections/ToolsGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/about", title: t("aboutTitle"), description: t("aboutDescription") });
}

/** A cross-section of a welded seam: two sheets, a V-groove, and the weld rod fused into it. */
function WeldDiagram({ label, ms }: { label: string; ms: boolean }) {
  return (
    <svg viewBox="0 0 480 200" role="img" aria-label={label} className="h-auto w-full">
      <rect x="0" y="150" width="480" height="50" fill="#DCDFDC" />
      <rect x="0" y="142" width="480" height="8" fill="#C8CCC9" />
      <path d="M0 102 H222 L236 128 V142 H0 Z" fill="#C2D6CE" />
      <path d="M480 102 H258 L244 128 V142 H480 Z" fill="#C2D6CE" />
      <path d="M0 102 H222 L236 128 V142 H0 Z M480 102 H258 L244 128 V142 H480 Z" fill="none" stroke="#8FA19C" strokeWidth="1.5" />
      <path d="M222 102 L236 128 V142 H244 V128 L258 102 Z" fill="#E07A1F" />
      <line x1="0" y1="101" x2="480" y2="101" stroke="#23312D" strokeWidth="1" opacity="0.25" />
      <g fontFamily="var(--font-archivo), sans-serif" fontSize="13" fill="#23312D">
        <text x="24" y="90">{ms ? "Vinil" : "Vinyl"}</text>
        <text x="300" y="58">{ms ? "Rod kimpalan, dipotong rata" : "Weld rod, trimmed flush"}</text>
        <line x1="296" y1="62" x2="252" y2="100" stroke="#23312D" strokeWidth="1" />
        <text x="24" y="178" fill="#4B5753">{ms ? "Gam dan simen perata" : "Adhesive and levelled screed"}</text>
      </g>
    </svg>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("about");
  const th = await getTranslations("home");
  const tc = await getTranslations("common");
  const values = ["precision", "clean", "live"] as const;

  return (
    <>
      <header className="wrap grid gap-10 pb-16 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
        <div>
          <h1 className="display text-[38px] sm:text-[56px]">{t("title")}</h1>
          <p className="measure mt-6 text-[19px] text-ink-soft">{t("lead", { year: site.founded })}</p>
        </div>
        <Photo src={null} alt="" label={tc("placeholderPhoto", { what: locale === "ms" ? "kru kami di tapak" : "our crew on site" })} className="aspect-[4/3]" />
      </header>

      <section className="wrap grid gap-8 border-t border-hairline py-16 lg:grid-cols-2 lg:gap-16">
        <p className="text-[18px] leading-[1.65] text-ink-soft">{t("story1")}</p>
        <p className="text-[18px] leading-[1.65] text-ink-soft">{t("story2")}</p>
      </section>

      <section className="wrap pb-20" aria-labelledby="values-title">
        <h2 id="values-title" className="display text-[30px] sm:text-[40px]">
          {t("valuesTitle")}
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {values.map((v) => (
            <li key={v} className="border-t border-hairline pt-5">
              <h3 className="text-[19px] font-semibold">{t(`values.${v}.title`)}</h3>
              <p className="mt-2 text-[16px] text-ink-soft">{t(`values.${v}.body`)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-hairline bg-white/40 py-20" aria-labelledby="weld-title">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <h2 id="weld-title" className="display text-[30px] sm:text-[40px]">
              {t("weldTitle")}
            </h2>
            <p className="measure mt-6 text-[17px] leading-[1.65] text-ink-soft">{t("weld1")}</p>
            <p className="measure mt-4 text-[17px] leading-[1.65] text-ink-soft">{t("weld2")}</p>
            <p className="measure mt-4 text-[17px] leading-[1.65] text-ink-soft">{t("weld3")}</p>
          </div>
          <div className="rounded-md border border-hairline bg-slab p-6">
            <WeldDiagram label={t("weldTitle")} ms={locale === "ms"} />
          </div>
        </div>
      </section>

      <section id="equipment" className="wrap scroll-mt-28 py-20" aria-labelledby="equipment-title">
        <h2 id="equipment-title" className="display text-[30px] sm:text-[40px]">
          {t("equipmentTitle")}
        </h2>
        <p className="measure mt-3 text-[17px] text-ink-soft">{t("equipmentBody")}</p>
        <div className="mt-10">
          <ToolsGrid tools={equipment} locale={locale} columns={3} />
        </div>
      </section>

      <section className="wrap grid gap-12 border-t border-hairline py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <div aria-labelledby="team-title">
          <h2 id="team-title" className="display text-[30px] sm:text-[40px]">
            {t("teamTitle")}
          </h2>
          <p className="mt-3 text-[17px] text-ink-soft">{t("teamBody")}</p>
          {/* TODO: replace with real team members and photos (public/images/team/) */}
          <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <Photo src={null} alt="" label={tc("placeholderPhoto", { what: `${t("teamName")} ${n}` })} className="aspect-[4/5]" />
                <p className="mt-3 font-semibold">
                  {t("teamName")} {n}
                </p>
                <p className="text-[14px] text-stone">{t("teamRole")}</p>
              </li>
            ))}
          </ul>
        </div>
        <div aria-labelledby="reg-title">
          <h2 id="reg-title" className="display text-[30px] sm:text-[40px]">
            {t("registrationsTitle")}
          </h2>
          <p className="mt-3 text-[17px] text-ink-soft">{t("registrationsBody")}</p>
          <ul className="mt-8 border-t border-hairline">
            <li className="border-b border-hairline py-3">{site.legalName}</li>
            {site.registrations.map((r) => (
              <li key={r} className="border-b border-hairline py-3 tabular-nums">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={th("ctaTitle")} body={th("ctaBody")} button={tc("startQuote")} />
    </>
  );
}
