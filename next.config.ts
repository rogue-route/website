import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to serve images from the production domain.
    // localhost is included automatically by Next.js in dev.
    remotePatterns: [],
    // Local /public/images/* are served as-is; no remote patterns needed
    // for v1 (all hero images are local files, not remote URLs).
  },
};

export default nextConfig;
