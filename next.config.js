/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      preferRelative: true,
      alias: {
        ...config.resolve.alias,
        undici: false
      },
      fallback: {
        ...config.resolve.fallback,
        "http": false,
        "https": false,
        "url": false,
        "zlib": false,
        "net": false,
        "path": false,
        "stream": false,
        "util": false,
        "crypto": false
      }
    };
    return config;
  }
};

module.exports = nextConfig;