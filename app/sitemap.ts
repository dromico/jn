import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", "/projects", "/about", "/contact", ...services.map((s) => `/services/${s.slug}`), ...projects.map((p) => `/projects/${p.slug}`)];
  const now = new Date();
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: now,
      changeFrequency: path.startsWith("/projects/") ? "monthly" : "weekly",
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l === "ms" ? "ms-MY" : "en-MY", localeUrl(l, path)])) },
    })),
  );
}
