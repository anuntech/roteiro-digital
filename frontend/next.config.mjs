/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'vuupt.s3.amazonaws.com' }],
  },
  reactStrictMode: false,
}

export default nextConfig
