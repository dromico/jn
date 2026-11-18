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

All 4:5 or wider, ≥ 1000 px on the short side, tool on a plain background or in use on site.

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
| `public/images/logo/` | SVG | Real logo. Until then the navbar uses the text "Jaya Nexus" and `public/images/logo/wordmark.svg` is a placeholder |
| `public/images/clients/*.svg` | SVG or PNG, transparent | Client logos for the marquee. List them in `content/clients.ts` (and get permission first) |
| About page: crew photo | 4:3, ≥ 1600 px | Our crew on site. Slot is in `app/[locale]/about/page.tsx` (`Photo src={null}`): set `src` to e.g. `/images/team/crew.jpg` |
| About page: team members | 4:5 | Supervisors and installers. Same file, "The team" section |
| `public/images/hero-poster.png` | 1050 × 960 | Reduced-motion and no-WebGL version of the hero. It's a render of the hero's last frame; regenerate it if the hero changes |

## Hero and swatch textures

The six floor textures (hero roll, sample board, mega menu, service heroes) are **procedural**: drawn in code in `components/hero/textures.ts`. No image files are needed.
The hero turns each texture's height layer into a normal map, and gives each floor its own roughness and clearcoat (glossy vinyl wear layer, matte rubber and carpet).

The brief asked for CC0 maps from ambientCG. The build sandbox could not reach ambientCG, so none are bundled. If you'd like to use them (or photos of your own floors) later:

| Floor | Suggested ambientCG material (CC0) |
|---|---|
| Homogeneous vinyl | `Plastic` / `Terrazzo` speckle sets |
| Vinyl tiles (LVT) | `WoodFloor` sets |
| Sports | `WoodFloor` (maple/beech) |
| Gym | `Rubber` sets |
| ESD | `Plastic` (light grey) |
| Carpet | `Carpet` / `Fabric` sets |
| Concrete slab | `Concrete` sets |

Download the 1K JPG versions into `public/textures/<floor>/` (color, normal, roughness), and replace the matching painter in `textures.ts` with an image draw into the same rectangle. Credit isn't required for CC0, but note the source here.
