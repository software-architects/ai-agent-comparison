import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(process.cwd(), "../.."),
  },
  transpilePackages: ["@workspace/lib"],
};

export default nextConfig;
