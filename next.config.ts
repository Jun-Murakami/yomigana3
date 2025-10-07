import type { NextConfig } from "next";

// Next.js を静的書き出しする設定。
// - Firebase Hosting へ `out/` を配備する前提
// - 画像最適化はビルド時に行わず、静的エクスポートに合わせて unoptimized
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
