'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LinkedIn, Gmail, WhatsApp, XLight, XDark } from '@ridemountainpig/svgl-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface BlogHeaderProps {
  title: string
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({ title }) => {
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
    <motion.header 
      className="relative w-full min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white border-b border-gray-200 dark:border-gray-800 overflow-hidden flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background de puntos verdes tipo Supabase */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:24px_24px]",
          "[background-image:radial-gradient(circle,#3ECF8E_1.5px,transparent_1.5px)]",
          "dark:[background-image:radial-gradient(circle,#3ECF8E_1.5px,transparent_1.5px)]",
        )}
        style={{ opacity: 1 }}
      />
      
      {/* Gradiente radial para efecto fade */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-gray-950" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Título del artículo */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 sm:mb-10 md:mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h1>
          
          {/* Información del autor */}
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-gray-300/30 dark:ring-white/20 flex-shrink-0">
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
              <span className="text-sm sm:text-base font-semibold text-black dark:text-white">
                Diego Cancino
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                CTO & Founder of Tegma Solutions
              </span>
            </div>
          </motion.div>

          {/* Redes sociales */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
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
                  delay: 0.7 + (index * 0.1),
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20">
                  {social.icon}
                </div>
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
