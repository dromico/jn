/**
 * Scans public/projects/* and writes content/projects.generated.json.
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * It never fails the build: a bad project.json is reported and skipped (or
 * partially used), and anything unexpected still writes a valid file.
 *
 * See PROJECTS.md for the folder layout.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, "public", "projects");
const OUT_FILE = path.join(ROOT, "content", "projects.generated.json");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const STAGES = ["sebelum", "semasa", "selepas"] as const;

const localized = z.union([
  z.string().transform((s) => ({ en: s, ms: s })),
  z.object({ en: z.string(), ms: z.string().optional() }).transform((v) => ({ en: v.en, ms: v.ms ?? v.en })),
]);

const SERVICES = [
  "homogeneous-vinyl",
  "vinyl-tiles-lvt",
  "sports-flooring",
  "gym-flooring",
  "anti-static-esd",
  "carpet",
] as const;

const SECTORS = ["healthcare", "education", "commercial", "data-centre", "sports", "hospitality", "residential", "religious", "industrial"] as const;

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD");

const schema = z.object({
  title: localized.optional(),
  client: z.string().optional(),
  location: z.string().optional(),
  services: z.array(z.enum(SERVICES)).optional(),
  sector: z.enum(SECTORS).optional(),
  areaM2: z.number().nonnegative().optional(),
  startDate: dateString.optional(),
  endDate: dateString.optional(),
  duration: localized.optional(),
  scope: localized.optional(),
  phases: z
    .array(
      z.object({
        name: z.string(),
        zones: localized.optional(),
        startDate: dateString.optional(),
      }),
    )
    .optional(),
  summary: localized.optional(),
  challenge: localized.optional(),
  approach: localized.optional(),
  result: localized.optional(),
  featured: z.boolean().optional(),
  placeholder: z.boolean().optional(),
});

type ProjectInput = z.infer<typeof schema>;

export interface GeneratedProject extends Omit<ProjectInput, "title"> {
  slug: string;
  title: { en: string; ms: string };
  cover: string | null;
  photos: Record<(typeof STAGES)[number], string[]>;
}

const warn = (folder: string, msg: string) => console.warn(`  ⚠ projects/${folder}: ${msg}`);

function listImages(dir: string, urlBase: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `${urlBase}/${encodeURIComponent(f)}`);
}

function titleFromSlug(slug: string) {
  const t = slug.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return { en: t, ms: t };
}

function readProject(folder: string): GeneratedProject | null {
  const dir = path.join(PROJECTS_DIR, folder);
  const urlBase = `/projects/${encodeURIComponent(folder)}`;
  const jsonPath = path.join(dir, "project.json");

  let data: ProjectInput = {};
  if (!fs.existsSync(jsonPath)) {
    warn(folder, "no project.json, showing the folder with defaults");
  } else {
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (e) {
      warn(folder, `project.json is not valid JSON (${(e as Error).message}); skipped`);
      return null;
    }
    const parsed = schema.safeParse(raw);
    if (parsed.success) {
      data = parsed.data;
    } else {
      // Keep the valid fields, drop the bad ones, and say which.
      const bad = new Set<string>();
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "(root)");
        bad.add(field);
        warn(folder, `"${issue.path.join(".")}" ${issue.message.toLowerCase()}; field ignored`);
      }
      const cleaned = Object.fromEntries(
        Object.entries((raw ?? {}) as Record<string, unknown>).filter(([k]) => !bad.has(k)),
      );
      const retry = schema.safeParse(cleaned);
      data = retry.success ? retry.data : {};
    }
  }

  const coverFile = fs.existsSync(dir)
    ? fs.readdirSync(dir).find((f) => /^cover\.(jpe?g|png|webp|avif)$/i.test(f))
    : undefined;

  const photos = Object.fromEntries(
    STAGES.map((stage) => [stage, listImages(path.join(dir, stage), `${urlBase}/${stage}`)]),
  ) as GeneratedProject["photos"];

  if (photos.sebelum.length && photos.selepas.length && photos.sebelum.length !== photos.selepas.length) {
    warn(folder, `sebelum has ${photos.sebelum.length} photos and selepas has ${photos.selepas.length}; the before/after slider pairs them by position`);
  }

  const { title, ...rest } = data;
  return {
    ...rest,
    slug: folder,
    title: title ?? titleFromSlug(folder),
    cover: coverFile ? `${urlBase}/${encodeURIComponent(coverFile)}` : null,
    photos,
  };
}

function main() {
  let projects: GeneratedProject[] = [];
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      console.warn("  ⚠ public/projects does not exist; writing an empty project list");
    } else {
      const folders = fs
        .readdirSync(PROJECTS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
        .map((d) => d.name)
        .sort();

      for (const folder of folders) {
        if (!/^[a-z0-9][a-z0-9-]*$/.test(folder)) {
          warn(folder, "folder names should be lower-case letters, numbers and dashes (it becomes the URL)");
        }
        try {
          const p = readProject(folder);
          if (p) projects.push(p);
        } catch (e) {
          warn(folder, `could not be read (${(e as Error).message}); skipped`);
        }
      }
    }

    // Featured first, then newest start date, then real projects before placeholders.
    projects = projects.sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      if (!!a.placeholder !== !!b.placeholder) return a.placeholder ? 1 : -1;
      return (b.startDate ?? "").localeCompare(a.startDate ?? "");
    });
  } catch (e) {
    console.warn(`  ⚠ build-projects failed unexpectedly (${(e as Error).message}); writing what was read`);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(projects, null, 2) + "\n");
  console.log(`  ✓ ${projects.length} project${projects.length === 1 ? "" : "s"} written to content/projects.generated.json`);
}

main();
