import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module; keep it out of the bundler and use
  // a native require at runtime. (It's auto-externalized too, but explicit is safer.)
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
