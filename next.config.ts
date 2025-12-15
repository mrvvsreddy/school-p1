import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Skip Next.js image optimization to avoid IPv6/private IP restrictions
    unoptimized: true,
  },
};

export default nextConfig;
