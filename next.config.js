/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Add transpilePackages to handle private class fields
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false // Disable undici to use node-fetch instead
    };
    return config;
  },
};

module.exports = nextConfig;