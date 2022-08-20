/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  async redirects() {
    return [
      {
        source: "/:slug*.md",
        destination: "/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
