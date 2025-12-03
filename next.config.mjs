import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  serverExternalPackages : ["@mastra/*"],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio HTTPS (para producción)
      },
    ],
    dangerouslyAllowSVG: true, // Permite SVGs en Next.js Image
    contentDispositionType: 'attachment', // Seguridad para SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // CSP para SVGs
    unoptimized: false, // Mantener optimización habilitada
  },
  // Configuración de Turbopack (Next.js 15+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Configuración de SVGR para importar SVGs como componentes React
    // Buscar la regla existente de archivos
    const fileLoaderRule = webpackConfig.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    webpackConfig.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            titleProp: true,
            ref: true,
          },
        },
      ],
    });
    
    webpackConfig.module.rules.push({
      test: /\.svg$/,
      type: "asset/resource",
      resourceQuery: /url/, // permite usar icon.svg?url
    });

    // Modificar la regla de archivos para ignorar archivos *.svg ya que tenemos reglas personalizadas
    fileLoaderRule.exclude = /\.svg$/i

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
