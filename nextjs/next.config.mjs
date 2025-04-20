/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXTAUTH_URL: "http://localhost:3000",
  }
};

export default nextConfig;
