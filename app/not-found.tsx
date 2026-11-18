import Link from "next/link";
import { archivo } from "@/lib/fonts";

// Only reached for paths outside /en and /ms that the middleware didn't redirect.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={archivo.variable}>
      <body style={{ fontFamily: "var(--font-archivo), sans-serif", background: "#EEF0EE", color: "#23312D", padding: "64px 24px" }}>
        <h1 style={{ fontStretch: "125%", fontWeight: 700, letterSpacing: "-0.03em" }}>There&apos;s a tile missing here</h1>
        <p>
          <Link href="/en">Back to the homepage</Link>
        </p>
      </body>
    </html>
  );
}
