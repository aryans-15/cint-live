import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
