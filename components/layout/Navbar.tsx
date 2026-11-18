import { getLocale, getTranslations } from "next-intl/server";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { NavbarClient, type NavFloor } from "./NavbarClient";

export async function Navbar() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");
  const floors: NavFloor[] = services.map((s) => ({ slug: s.slug, texture: s.texture, edge: s.edge, name: s.name[locale], use: s.use[locale] }));

  return (
    <NavbarClient
      floors={floors}
      labels={{
        main: t("main"),
        floors: t("floors"),
        allFloors: t("allFloors"),
        allFloorsBody: t("allFloorsBody"),
        projects: t("projects"),
        about: t("about"),
        contact: t("contact"),
        language: t("language"),
        openMenu: t("openMenu"),
        closeMenu: t("closeMenu"),
        home: t("home"),
        getQuote: tc("getQuote"),
      }}
    />
  );
}
