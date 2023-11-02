/** @type {import('next').NextConfig} */
const withExportImages = require("next-export-optimize-images"); // 추가

//추가 module.exports
module.exports = withExportImages({
  reactStrictMode: false,
  output: "export",
  images: {
    domains: ["neighbrew.s3.ap-northeast-2.amazonaws.com", "*"],
  },
  // write your next.js configuration values.
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // ANOTHER_VARIABLE: process.env.ANOTHER_VARIABLE,
  },
});

//기존 module.exports
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/:path*",
//         destination: "/:path*",
//       },
//       {
//         source: "/api/v1/:path*",
//         destination: `https://flower-ly.co.kr/api/v1/:path*`,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
