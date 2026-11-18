# Adding a project

Projects are built from folders. You never have to edit code to add one.

```
public/projects/<slug>/
  project.json     details (all optional except the folder name)
  cover.jpg        used on the project grid and the homepage
  sebelum/         before photos, any number, sorted by file name
  semasa/          during photos
  selepas/         after photos
```

## Steps

1. Copy `public/projects/_template/` and rename the copy. The folder name becomes the URL, so use lower case and dashes:
   `public/projects/sekolah-kebangsaan-seri-kembangan-hall/` → `/en/projects/sekolah-kebangsaan-seri-kembangan-hall`.
2. Fill in `project.json`. Leave out anything you don't know; missing fields are simply not shown.
3. Add `cover.jpg` (16:10, at least 1600 × 1000 px).
4. Drop photos into `sebelum/`, `semasa/` and `selepas/`. JPG, PNG, WebP and AVIF all work.
5. Run `npm run dev` to check it, then commit and push. Coolify rebuilds the site.

That's it. The project grid, the project page, the homepage featured project, the service pages' "Projects with this floor", the sitemap and the structured data all update from the folders.

## project.json fields

| Field | Example | Notes |
|---|---|---|
| `title` | `{ "en": "…", "ms": "…" }` | A plain string works too (used for both languages) |
| `client` | `"Hospital Jempol"` | |
| `location` | `"Jempol, Negeri Sembilan"` | |
| `services` | `["homogeneous-vinyl"]` | Any of `homogeneous-vinyl`, `vinyl-tiles-lvt`, `sports-flooring`, `gym-flooring`, `anti-static-esd`, `carpet` |
| `sector` | `"healthcare"` | One of `healthcare`, `education`, `commercial`, `data-centre`, `sports`, `hospitality`, `residential`, `religious`, `industrial` |
| `areaM2` | `850` | Number, no units |
| `startDate`, `endDate` | `"2026-10-22"` | `YYYY-MM-DD` |
| `duration` | `{ "en": "6 weeks", "ms": "6 minggu" }` | |
| `scope` | `{ "en": "…", "ms": "…" }` | One or two sentences |
| `phases` | `[{ "name": "Fasa 1", "zones": { "en": "…", "ms": "…" }, "startDate": "2026-10-22" }]` | |
| `summary` | `{ "en": "…", "ms": "…" }` | Shown on cards and the homepage |
| `challenge`, `approach`, `result` | `{ "en": "…", "ms": "…" }` | The case-study story |
| `featured` | `true` | The homepage shows the first featured project. If none is featured, it shows the newest by `startDate` |

## The before/after slider

The slider pairs `sebelum/` and `selepas/` photos **by position**: the first file in `sebelum/` with the first in `selepas/`.
Name matching shots the same, e.g. `sebelum/01-red-zone.jpg` and `selepas/01-red-zone.jpg`.

## When something is wrong

`scripts/build-projects.ts` checks every folder when you run `npm run dev` or `npm run build`.
If a field is wrong it prints a warning naming the folder and the field, ignores that field, and carries on. It never stops the build.

```
  ⚠ projects/my-job: "sector" invalid enum value…; field ignored
```

Folders starting with `_` (like `_template`) are ignored.

## Placeholder projects

The `placeholder-*` folders are examples so the grid isn't empty. Delete them once you have real jobs.
