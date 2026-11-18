import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The old cleaning-services app lives in legacy/ and is never built.
  outputFileTracingExcludes: { "*": ["legacy/**"] },
};

export default withNextIntl(nextConfig);
