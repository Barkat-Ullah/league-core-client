import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Cloudinary is already serving optimized images (CDN transforms), so we
    // bypass Next.js image optimization entirely to avoid double-processing
    // and proxy issues with remote (Cloudinary / DigitalOcean Spaces) images.
    unoptimized: true,
    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
