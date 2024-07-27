/** @type {import('next').NextConfig} */
const nextConfig = {
  // For docker purpose
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// export default withNextVideo(nextConfig, { folder: "assets/videos/" });
export default nextConfig;
