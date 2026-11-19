# Image slots and texture sources

Every image on the site is a slot. Until a real file is there, the site shows a pale-grey block labelled with the photo that belongs in it.
Drop a file at the path below and rebuild. `next/image` converts everything to AVIF/WebP and resizes it, so upload good-quality JPGs.

## Projects

See `PROJECTS.md`. Per project folder:

| Path | Size / aspect | What it shows |
|---|---|---|
| `public/projects/<slug>/cover.jpg` | 16:10, ≥ 1600 × 1000 | The finished floor, wide, in good light |
| `public/projects/<slug>/sebelum/*.jpg` | 4:3, ≥ 1600 × 1200 | Before work: old floor, damage, lifted seams |
| `public/projects/<slug>/semasa/*.jpg` | 4:3 | During: grinding, screed, laying, welding |
| `public/projects/<slug>/selepas/*.jpg` | 4:3 | After: the same views as `sebelum/`, same order |

**Hospital Jempol** (`public/projects/hospital-jempol/`) needs: a cover, and matched before/after pairs for the Yellow Zone, Red Zone, OBS, Sari and Green Zone. The homepage slider uses `sebelum/` file 1 and `selepas/` file 1 (label it "Yellow Zone" or rename the first phase).

## Equipment (homepage row and About page)

Product shots on a white background work best: each is shown whole, centred on a white tile. Square, at least 800 × 800 px. The first four are in (supplied 19 Nov 2026, trimmed and placed on white).

| Path | Shows |
|---|---|
| `public/images/equipment/hot-air-welder.jpg` | Hot-air welding gun (homepage) |
| `public/images/equipment/levelling-mixer.jpg` | Self-levelling mixer and paddle (homepage) |
| `public/images/equipment/seam-groover.jpg` | Seam groover (homepage) |
| `public/images/equipment/moisture-meter.jpg` | Moisture meter on a slab (homepage) |
| `public/images/equipment/floor-grinder.jpg` | Floor grinder |
| `public/images/equipment/spiked-roller.jpg` | Spiked roller on fresh screed |
| `public/images/equipment/floor-roller.jpg` | 45 kg / 68 kg floor roller |
| `public/images/equipment/floor-scraper.jpg` | Floor scraper |
| `public/images/equipment/laser-level.jpg` | Laser level |

Paths are set in `content/equipment.ts`.

## Other slots

| Path | Size | Shows |
|---|---|---|
| `public/images/logo/logo jaya.jpeg` | JPEG | The original logo as supplied. The files below are made from it; if the logo changes, replace this and regenerate them (or send a transparent PNG or SVG, which is better) |
| `public/images/logo/jaya-nexus-mark.png` | 320 px, transparent | The triangle mark, used in the navbar and footer next to the name, and on the social preview images |
| `public/images/logo/jaya-nexus-logo.png` | Transparent | The full logo with the arched name, used in search results (structured data) |
| `app/icon.png`, `app/apple-icon.png` | 512 px, 180 px | Browser tab icon and phone home-screen icon, made from the mark |
| `public/images/clients/*.svg` | SVG or PNG, transparent | Client logos for the marquee. List them in `content/clients.ts` (and get permission first) |
| About page: crew photo | 4:3, ≥ 1600 px | Our crew on site. Slot is in `app/[locale]/about/page.tsx` (`Photo src={null}`): set `src` to e.g. `/images/team/crew.jpg` |
| About page: team members | 4:5 | Supervisors and installers. Same file, "The team" section |
| `public/images/hero-poster.png`, `hero-start.png` | 1050 × 960 | Stills of the hero's last and first frames (reduced motion / first paint on phones). Regenerate them if the hero changes |

## Hero and swatch textures

**Photo textures.** The hero, the sample board, the mega menu and the service-page heroes use six 1024 px tiles in `public/textures/`, generated with Google's Nano Banana 2.1 image model (through OpenRouter) on 18 Nov 2026. They are AI-generated, so there is no third-party licence to credit.

| File | Floor | Covers | Notes |
|---|---|---|---|
| `public/textures/homogeneous.webp` | Homogeneous vinyl | 0.9 m | |
| `public/textures/lvt.webp` | Vinyl tiles (LVT) | 1.15 m | Planks run top to bottom (across the roll) |
| `public/textures/sports.webp` | Sports | 1.1 m | Strips run top to bottom. Court lines are drawn on top in code |
| `public/textures/gym.webp` | Gym rubber | 0.7 m | |
| `public/textures/esd.webp` | Anti-static | 1.0 m | The copper grid is drawn on top in code |
| `public/textures/concrete.webp` | Slab under the roll | 2.4 m | |

Carpet stays procedural: the image model's filter refused every carpet prompt.

**To use photos of your own floors:** shoot straight down in even light, crop square, save as 1024 × 1024 WebP over the file above. Tiles are mirrored when repeated, so they don't need to be seamless. The size each tile covers and its bump strength are set in `floorPhotos` in `components/hero/textures.ts`. The hero derives the normal map from the photo's brightness. If a file is missing, that floor falls back to its procedural texture.

After changing a texture, regenerate the two stills (`public/images/hero-start.png` for the first paint on phones, `public/images/hero-poster.png` for reduced motion) by screenshotting the canvas at `/en?hero=0` and `/en?hero=1`.

**Sample board, mega menu and service heroes** use the same photo files, so replacing a file updates every place that floor appears. Carpet is drawn in code everywhere. The procedural painters in `components/hero/textures.ts` stay as the fallback if a file is missing.
