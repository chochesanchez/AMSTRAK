/** @type {import('next').NextConfig} */
const nextConfig = {
  // A package-lock.json in the home folder otherwise makes Next guess the wrong workspace root.
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig
