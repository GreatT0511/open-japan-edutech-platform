import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ojetp/ui", "@ojetp/api", "@ojetp/db"],
};

export default nextConfig;
