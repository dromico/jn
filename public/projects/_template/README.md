# Project folder template

This folder is ignored by the site because its name starts with `_`.

1. Copy it and rename the copy, e.g. `sekolah-seri-kembangan-hall` (lower case, dashes). The folder name becomes the URL.
2. Edit `project.json`. Every field except the folder name is optional. Leave out anything you don't know yet.
   - `services`: any of `homogeneous-vinyl`, `vinyl-tiles-lvt`, `sports-flooring`, `gym-flooring`, `anti-static-esd`, `carpet`
   - `sector`: one of `healthcare`, `education`, `commercial`, `data-centre`, `sports`, `hospitality`, `residential`, `religious`, `industrial`
   - dates are `YYYY-MM-DD`
3. Add `cover.jpg` (16:10, at least 1600 px wide).
4. Put photos in `sebelum/`, `semasa/`, `selepas/`. They are sorted by file name.
   The before/after slider pairs `sebelum/01.jpg` with `selepas/01.jpg`, so name matching shots the same.
5. Run `npm run dev` (or `npm run build`). Done.
