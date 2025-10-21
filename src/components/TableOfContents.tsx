'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { HeadingItem } from '@/lib/headingUtils'
import { motion, AnimatePresence } from 'framer-motion'

interface TableOfContentsProps {
  headings: HeadingItem[]
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  // Cerrar el menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Botón flotante */}
      <motion.div 
        className="fixed top-4 left-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:scale-110 transition-transform"
        >
          <motion.div
            initial={false}
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Menú lateral con AnimatePresence */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            {/* Overlay animado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            
            {/* Panel lateral animado */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="fixed top-0 left-0 h-full w-[85vw] sm:w-[350px] md:w-[400px] z-50"
            >
              <Card className="h-full rounded-none border-r shadow-xl overflow-y-auto">
                <CardHeader className="pb-3 space-y-1">
                  <CardTitle className="text-lg sm:text-xl">Contenido del artículo</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Navega rápidamente entre las secciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <nav>
                    <ul className="space-y-0.5">
                      {headings.map((heading, index) => {
                        const isActive = activeId === heading.id
                        const paddingLeft = `${(heading.level - 1) * 0.75}rem`
                        
                        return (
                          <motion.li 
                            key={heading.id} 
                            style={{ paddingLeft }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: index * 0.03,
                              duration: 0.2
                            }}
                          >
                            <button
                              onClick={() => scrollToHeading(heading.id)}
                              className={cn(
                                'flex items-center w-full text-left py-2 px-3 rounded-md transition-all duration-200 text-xs sm:text-sm',
                                'hover:bg-accent hover:text-accent-foreground hover:translate-x-1',
                                isActive && 'bg-accent text-accent-foreground font-medium shadow-sm'
                              )}
                            >
                              {heading.level > 1 && (
                                <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0 opacity-60" />
                              )}
                              <span className="truncate leading-tight">{heading.text}</span>
                            </button>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </nav>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
