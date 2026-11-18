import data from "./projects.generated.json";
import type { Localized } from "./types";
import type { ServiceSlug } from "./services";

/**
 * Projects are built from the folders in public/projects/ by
 * scripts/build-projects.ts. Don't edit projects here: add a folder.
 * See PROJECTS.md.
 */
export type Sector =
  | "healthcare"
  | "education"
  | "commercial"
  | "data-centre"
  | "sports"
  | "hospitality"
  | "residential"
  | "religious"
  | "industrial";

export type Stage = "sebelum" | "semasa" | "selepas";
export const stages: Stage[] = ["sebelum", "semasa", "selepas"];

export interface Project {
  slug: string;
  title: Localized;
  client?: string;
  location?: string;
  services?: ServiceSlug[];
  sector?: Sector;
  areaM2?: number;
  startDate?: string;
  endDate?: string;
  duration?: Localized;
  scope?: Localized;
  phases?: { name: string; zones?: Localized; startDate?: string }[];
  summary?: Localized;
  challenge?: Localized;
  approach?: Localized;
  result?: Localized;
  featured?: boolean;
  placeholder?: boolean;
  cover: string | null;
  photos: Record<Stage, string[]>;
}

export const projects = data as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** First folder with "featured": true, otherwise the newest by start date. */
export function getFeaturedProject(): Project | undefined {
  return (
    projects.find((p) => p.featured) ??
    [...projects].sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""))[0]
  );
}

export function projectsForService(slug: ServiceSlug) {
  return projects.filter((p) => p.services?.includes(slug));
}

export function formatDate(iso: string | undefined, locale: string) {
  if (!iso) return undefined;
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
