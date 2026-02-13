import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@ojetp/ui", "@ojetp/api", "@ojetp/db"],
};

export default config;
