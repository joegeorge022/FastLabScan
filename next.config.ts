import withPWA from 'next-pwa';
import type { NextConfig } from "next";

const config: NextConfig = {
  /* config options here */
};

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(config);

export default nextConfig;
