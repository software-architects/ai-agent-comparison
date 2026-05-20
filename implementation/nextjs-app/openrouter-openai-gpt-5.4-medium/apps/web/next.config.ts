import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(configDirectory, "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/lib"],
  allowedDevOrigins: ["localhost"],
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
