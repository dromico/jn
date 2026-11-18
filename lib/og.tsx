import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Flat versions of the six floors, end to end like the hero's finished floor.
const bands = ["#C2D6CE", "#C29870", "#DDB98A", "#232527", "#D9DCDA", "#5E6468"];

let fontCache: ArrayBuffer | null | undefined;

/** Archivo, wide bold, fetched from Google Fonts at build time. Falls back to the default font. */
async function archivo(): Promise<ArrayBuffer | null> {
  if (fontCache !== undefined) return fontCache;
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,700&text=" + encodeURIComponent("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:()?'-–&/²"))).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    fontCache = url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    fontCache = null;
  }
  return fontCache;
}

export async function ogImage({ title, kicker }: { title: string; kicker?: string }) {
  const font = await archivo();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#EEF0EE", color: "#23312D", fontFamily: font ? "Archivo" : undefined }}>
        <div style={{ height: 6, width: "100%", background: "#E07A1F", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 72px 40px" }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Jaya Nexus</div>
          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <div style={{ fontSize: title.length > 40 ? 64 : 80, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02, maxWidth: 1000 }}>{title}</div>
          </div>
          {kicker && <div style={{ fontSize: 26, color: "#5A6662", display: "flex" }}>{kicker}</div>}
        </div>
        <div style={{ display: "flex", height: 110 }}>
          {bands.map((c, i) => (
            <div key={c} style={{ flex: 1, background: c, display: "flex", borderLeft: i ? "4px solid #E07A1F" : "none" }} />
          ))}
        </div>
      </div>
    ),
    { ...ogSize, fonts: font ? [{ name: "Archivo", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
