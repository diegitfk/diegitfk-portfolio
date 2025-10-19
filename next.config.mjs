import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
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

    webpackConfig.module.rules.push(
      // Reutilizar la configuración existente de Next.js para SVGs importados con ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convertir todos los demás imports de *.svg a componentes React
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // excluir si tiene ?url
        use: ['@svgr/webpack'],
      },
    )

    // Modificar la regla de archivos para ignorar archivos *.svg ya que tenemos reglas personalizadas
    fileLoaderRule.exclude = /\.svg$/i

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
