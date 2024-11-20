/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,  // Disable undici
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/text-to-speech']
  }
}

module.exports = nextConfig