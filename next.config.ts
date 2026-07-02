import type { NextConfig } from "next";

const strapiUrl = process.env.STRAPI_URL ?? "http://localhost:1337";
const strapiHost = (() => {
  try {
    return new URL(strapiUrl).hostname;
  } catch {
    return "localhost";
  }
})();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: strapiHost,
      },
      {
        protocol: "https",
        hostname: strapiHost,
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
