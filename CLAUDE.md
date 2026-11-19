# jayanexus.com

Marketing site for Jaya Nexus Sdn Bhd, a flooring contractor. No backend, no CMS: content lives in typed files.

## Commands
- `npm run dev`: dev server (runs `scripts/build-projects.ts` first)
- `npm run build`: production build (also regenerates projects)
- `npm run lint`, `npm run typecheck`
- `/en?hero=0.5`: freeze the hero at a scroll position (for screenshots)

## Layout
- `app/[locale]/…`: pages (next-intl, `en` and `ms`, static)
- `content/`: site details, services, process, equipment, clients. Projects come from `public/projects/*` folders (see PROJECTS.md)
- `messages/en.json`, `messages/ms.json`: UI copy. Write natural BM, not word-for-word
- `components/hero/`: the R3F hero (`FloorBuildScene.tsx`: hospital ward cutaway, the floor built up layer by layer as you scroll; timings in `timeline()`) and the floor swatch textures
- `legacy/`: the old cleaning-services app. Not built, not linted

## Style rules
- Tokens in `app/globals.css`. Weld amber (#E07A1F) only for the weld: the hot glow at the hero's welder tip, the scroll seam, completed process and hero steps. The weld rod itself is the floor colour, a shade darker
- One font (Archivo). Headings `.display` (wdth 125). Sentence case. No monospace, no ALL-CAPS eyebrows, no "→" on links, no "A · B · C" strings
- Only the hero is loud. No fade-up on sections
- Respect `prefers-reduced-motion` everywhere
