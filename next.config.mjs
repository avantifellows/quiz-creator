// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.avantifellows.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
