/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "placehold.co",
      "kunstino-backend-production.up.railway.app",
      // Add other domains your images might come from
    ],
  },
};

module.exports = nextConfig;
