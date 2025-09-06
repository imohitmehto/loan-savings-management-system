import path from "path";

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
};

export default nextConfig;

// import path from "path";

// export default nextConfig;
// // web/next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {

//   outputFileTracingRoot: path.join(__dirname, "..", ".."),
//   // Enable standalone output for Docker optimization
//   output: 'standalone',

//   // Experimental features
//   experimental: {
//     // Enable if you're using app directory
//     // appDir: true,
//   },

//   // Image optimization
//   images: {
//     domains: ['localhost', 'your-domain.com'],
//     // Disable image optimization for better Docker performance
//     unoptimized: process.env.NODE_ENV === 'production',
//   },

//   // API configuration
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
//       },
//     ];
//   },

//   // Headers configuration
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY',
//           },
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'origin-when-cross-origin',
//           },
//         ],
//       },
//     ];
//   },

//   // Webpack configuration
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     // Add any custom webpack configuration here
//     return config;
//   },

//   // Environment variables that should be available on the client side
//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//     NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
//   },
// };

// module.exports = nextConfig;
