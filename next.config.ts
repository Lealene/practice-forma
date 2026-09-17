import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "strapi",
      },
      {
        protocol: "https",
        hostname: "strapi",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "host.docker.internal",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "host.docker.internal",
        port: "1337",
      },

      // Production Strapi on Railway
      {
        protocol: "https",
        hostname: "practice-forma-production.up.railway.app",
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