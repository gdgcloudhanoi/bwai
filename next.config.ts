import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "storage.googleapis.com",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;
