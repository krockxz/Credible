import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for serverless deployments (pdf-parse compatibility)
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
