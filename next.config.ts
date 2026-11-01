import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: "6mb" },
    globalNotFound: true,
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    deviceSizes: [640, 828, 1080, 1440, 1920],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        source: "/audio/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
