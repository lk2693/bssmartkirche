/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.braunschweig.de',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig