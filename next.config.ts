import type { NextConfig } from "next";
import packageJson from "./package.json" with { type: "json" };

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
