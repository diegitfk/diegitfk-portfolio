"use client"

import { ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface BackendExperienceCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function BackendExperienceCard({
  title,
  children,
  className,
}: BackendExperienceCardProps) {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ perspective: "1500px", perspectiveOrigin: "center center" }}
    >
      <motion.div
        className={cn(
          "relative w-full rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 p-6 backdrop-blur-sm",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
        initial={{ 
          opacity: 0, 
          y: 20,
          rotateY: -15,
          rotateX: 5,
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          rotateY: 0,
          rotateX: 40,
        }}
        whileHover={{
          rotateY: 0,
          rotateX: 0,
          scale: 1.02,
          boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
        
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
          {title}
        </h3>
        
        <div className="relative min-h-[300px] sm:min-h-[350px]">
          {children}
        </div>
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/15 to-cyan-500/20 blur-[80px] opacity-40 -z-10"
        style={{
          transform: "translateY(15%) scale(1.1)",
        }}
      />
    </div>
  )
}
