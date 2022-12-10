const withTM = require('next-transpile-modules')(['wikipedia']) // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: { ignoreBuildErrors: true },
}

module.exports = withTM(nextConfig)
