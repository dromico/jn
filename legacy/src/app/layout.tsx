import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
export const metadata: Metadata = {
  title: "Jaya Nexus Sdn Bhd | Professional Cleaning Services",
  description:
    "Professional cleaning services for schools and commercial buildings in Malaysia. Pristine results guaranteed with eco-friendly solutions.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-oid="-cbp28s">
      <body className="antialiased" data-oid="ovy1apu">
        <LanguageProvider data-oid="zu_x61.">{children}</LanguageProvider>
      </body>
    </html>
  );
}
