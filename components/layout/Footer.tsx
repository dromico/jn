import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { LanguageToggle } from "./NavbarClient";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("contact");

  return (
    <footer className="on-dark bg-spruce text-[#C4CFCA]">
      <div className="wrap grid gap-10 pb-10 pt-16 text-[14px] leading-[1.9] sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="wide mb-2.5 flex items-center gap-3 text-lg font-bold text-on-dark">
            <Image src="/images/logo/jaya-nexus-mark.png" alt="" width={46} height={40} className="h-10 w-auto" />
            {site.legalName}
          </p>
          <p>{t("tagline")}</p>
          <ul className="mt-2.5">
            {site.registrations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-on-dark">{t("floors")}</p>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-[#C4CFCA] no-underline hover:text-white hover:underline">
                  {s.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-on-dark">{t("company")}</p>
          <ul>
            {(
              [
                ["/about", tn("about")],
                ["/projects", tn("projects")],
                ["/contact", tn("contact")],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-[#C4CFCA] no-underline hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-on-dark">{t("contact")}</p>
          <address className="not-italic">
            <p>{site.address}</p>
            <p>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="text-[#C4CFCA] hover:text-white" aria-label={`${tc("phone")} ${site.phone}`}>
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-[#C4CFCA] hover:text-white">
                {site.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-[#3A4A45] pb-8 pt-5 text-[13px]">
        <span>{t("rights", { year: new Date().getFullYear() })}</span>
        <LanguageToggle label={tn("language")} dark />
      </div>
    </footer>
  );
}
