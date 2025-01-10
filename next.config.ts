import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enabling experimental app directory
  experimental: {},
  // Adding API route handling if needed
  api: {
    bodyParser: true, // Enables body parsing for API routes
    externalResolver: true, // Allows third-party resolvers
  },
  // Adding environment variables if required
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000", // Adjust as needed
  },
  // Optional for performance optimization
  reactStrictMode: true, // React Strict Mode
  swcMinify: true, // SWC-based minification for faster builds
};

export default nextConfig;
