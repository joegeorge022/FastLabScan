import withPWA from 'next-pwa';
import type { NextConfig } from "next";

const config = {
  /* config options here */
};

// @ts-ignore -- Ignoring type mismatch between next-pwa and next.js
const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(config);

export default nextConfig;
