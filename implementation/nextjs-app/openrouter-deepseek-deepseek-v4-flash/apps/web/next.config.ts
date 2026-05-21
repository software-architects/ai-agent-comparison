import { resolve } from "node:path"
import type { NextConfig } from "next"

const rootDir = import.meta.dirname
if (!rootDir) throw new Error("import.meta.dirname is not available")

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/lib"],
  turbopack: {
    root: resolve(rootDir, "../.."),
  },
}

export default nextConfig
