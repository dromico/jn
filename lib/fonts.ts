import { Archivo } from "next/font/google";

// One family. Variable weight and width; headings use wdth 125.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
