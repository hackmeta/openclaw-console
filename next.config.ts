import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://192.168.31.104:8081/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
