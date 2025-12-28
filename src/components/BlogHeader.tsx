'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LinkedIn, Gmail, WhatsApp, XLight, XDark } from '@ridemountainpig/svgl-react'
import { useTheme } from 'next-themes'
import { PixelImage } from '@/components/ui/pixel-image'

interface BlogHeaderProps {
  title: string
  previewImage?: string | null
}

// Tiempo base para que el efecto pixel termine antes de mostrar el contenido
const PIXEL_EFFECT_DURATION = 1.5 // segundos

export const BlogHeader: React.FC<BlogHeaderProps> = ({ title, previewImage }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  // Redes sociales
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/diego-cancino-b19850294/',
      icon: <LinkedIn className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      name: 'Gmail',
      url: 'mailto:cancinod080@gmail.com',
      icon: <Gmail className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/56969070939',
      icon: <WhatsApp className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      name: 'X',
      url: 'https://x.com/diegitfk',
      icon: isDark 
        ? <XDark className="w-5 h-5 sm:w-6 sm:h-6" />
        : <XLight className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ]

  return (
    <header className="relative w-full min-h-screen bg-black text-white border-b border-gray-800 overflow-hidden flex items-center">
      {/* PixelImage Background - Full Screen - Renderiza primero */}
      {previewImage && (
        <div className="absolute inset-0 z-0">
          <PixelImage 
            src={previewImage}
            grid="8x8"
            grayscaleAnimation={true}
            pixelFadeInDuration={1200}
            maxAnimationDelay={1500}
            colorRevealDelay={2000}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Gradient overlays - aparecen después del efecto pixel */}
      <motion.div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: PIXEL_EFFECT_DURATION - 0.5 }}
      />
      <motion.div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: PIXEL_EFFECT_DURATION - 0.5 }}
      />

      {/* Contenido - aparece DESPUÉS de que el efecto pixel termine */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: PIXEL_EFFECT_DURATION }}
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: PIXEL_EFFECT_DURATION + 0.1, duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 border border-gray-700/50 rounded-full backdrop-blur-sm bg-black/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Blog Post
            </span>
          </motion.div>

          {/* Título del artículo */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 sm:mb-10 md:mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: PIXEL_EFFECT_DURATION + 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h1>
          
          {/* Información del autor */}
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: PIXEL_EFFECT_DURATION + 0.4, duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
              <Image
                src="/images/portfolio-image.webp"
                alt="Diego Cancino"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Nombre y cargo */}
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-semibold text-white">
                Diego Cancino
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                CTO & Founder of Tegma Solutions
              </span>
            </div>
          </motion.div>

          {/* Redes sociales */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: PIXEL_EFFECT_DURATION + 0.6, duration: 0.6 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name !== 'Gmail' ? '_blank' : undefined}
                rel={social.name !== 'Gmail' ? 'noopener noreferrer' : undefined}
                className="group relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: PIXEL_EFFECT_DURATION + 0.7 + (index * 0.1),
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
                  {social.icon}
                </div>
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </header>
  )
}
