import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
