import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  // Increase body size limit for file uploads
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  // For app router, we need to configure this differently
  serverRuntimeConfig: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
};

export default nextConfig;
