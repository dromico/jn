import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/content/projects";
import { getService } from "@/content/services";
import { tr } from "@/content/types";
import { Photo } from "@/components/ui/Placeholder";

export interface ProjectCardLabels {
  placeholder: string;
  sector?: string;
  photo: string;
}

export function ProjectCard({ project, locale, labels, headingLevel = 3 }: { project: Project; locale: Locale; labels: ProjectCardLabels; headingLevel?: 2 | 3 }) {
  const title = tr(project.title, locale);
  const floors = (project.services ?? []).map((s) => getService(s)?.name[locale]).filter(Boolean).join(", ");
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/projects/${project.slug}`} className="group block no-underline">
      <div className="relative">
        <Photo src={project.cover} alt={title} label={labels.photo} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        {project.placeholder && <span className="absolute left-3 top-3 rounded-sm bg-white px-2 py-1 text-[12px] font-medium text-stone">{labels.placeholder}</span>}
      </div>
      <H className="mt-4 text-[18px] font-semibold leading-snug group-hover:text-vinyl">{title}</H>
      <p className="mt-1 text-[14px] text-stone">{[project.location, floors, labels.sector].filter(Boolean).join(". ")}</p>
    </Link>
  );
}
