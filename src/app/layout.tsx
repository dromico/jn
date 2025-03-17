import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaya Nexus Sdn Bhd | Professional Cleaning Services",
  description: "Professional cleaning services for schools and commercial buildings in Malaysia. Pristine results guaranteed with eco-friendly solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
