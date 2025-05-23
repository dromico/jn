import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true,

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  // Images configuration
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Environment variables with defaults
  env: {
    // Provide fallback empty values to prevent build errors
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Turbopack configuration (stable)
  turbopack: {
    // Configure turbopack-specific options if needed
  },

  // Custom webpack configuration (only for non-turbo builds)
  webpack: (config, { isServer, dev }) => {
    // Only show the warning once during build
    if (isServer && !dev) {
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!hasSupabaseUrl || !hasSupabaseKey) {
        console.warn('\n\n⚠️  WARNING: Missing Supabase environment variables!');
        console.warn('The application will use mock data and some features may not work correctly.');
        console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.\n\n');
      }
    }
    return config;
  },
};

export default nextConfig;
