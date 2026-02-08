/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // ⚠️ Permite que el build de producción se complete aunque haya errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Permite que el build de producción se complete aunque haya errores de ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
