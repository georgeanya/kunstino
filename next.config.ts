/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "placehold.co",
      "kunstino-backend-production.up.railway.app",
      "storage.googleapis.com",
      "placehold.net",
      "beyondthesinglestory.wordpress.com",
      "latitudes.online",
      // Add other domains your images might come from
    ],
  },
};

module.exports = nextConfig;
