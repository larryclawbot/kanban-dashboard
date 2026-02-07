import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3001/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://backend:3001/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
