import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
 // swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
