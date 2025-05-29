/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    outputFileTracingExcludes: {
      "*": ["./generated/prisma/**/*"],
    },
  },
};

export default nextConfig;
