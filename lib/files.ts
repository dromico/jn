import "server-only";
import fs from "node:fs";
import path from "node:path";

/** True if a file exists under public/ (checked at build time). */
export function publicFileExists(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", decodeURIComponent(src)));
  } catch {
    return false;
  }
}
