/** @type {import('next').NextConfig} */
const nextConfig = {
  // Google OAuth client IDs are public. Reuse the server-side value when a
  // separate NEXT_PUBLIC_ variable has not been provided, so both sides cannot
  // accidentally disagree about whether Google login is configured.
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' }]
  },
}

export default nextConfig
