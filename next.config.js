// ===========================================
// next.config.js (final fix untuk Vercel)
// ===========================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },           // Cloudinary
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }, // Firebase Storage
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }     // Profil Google Auth
    ],
  },

  env: {
    NEXT_PUBLIC_APP_NAME: 'Portal Karang Taruna Cilosari Barat'
  },

  experimental: {
    appDir: true,
    serverActions: true
  }
};

export default nextConfig;
