"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { MicroservicesArchitecture } from "./microservices-architecture"
import { WorkflowAutomationArchitecture } from "./workflow-automation-architecture"

interface BackendCardData {
  id: string
  title: string
  component: React.ComponentType
}

const backendCards: BackendCardData[] = [
  {
    id: "microservices",
    title: "Arquitectura de MicroServicios",
    component: MicroservicesArchitecture,
  },
  {
    id: "workflow",
    title: "Workflow Automatizations",
    component: WorkflowAutomationArchitecture,
  },
]

export function BackendExperienceStack() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  const rotateCards = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % backendCards.length)
  }, [])

  useEffect(() => {
    if (isPaused || !isInView) return

    const interval = setInterval(rotateCards, 2000)
    return () => clearInterval(interval)
  }, [rotateCards, isPaused, isInView])

  const getCardPosition = (index: number) => {
    const totalCards = backendCards.length
    const relativePosition = (index - activeIndex + totalCards) % totalCards
    return relativePosition
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl h-[300px] sm:h-[380px] md:h-[420px] flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      <div className="relative w-full h-full">
        {backendCards.map((card, index) => {
          const Component = card.component
          const position = getCardPosition(index)
          const reversePosition = backendCards.length - 1 - position

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{
                x: reversePosition * -20,
                y: reversePosition * -25,
                zIndex: position,
                opacity: reversePosition === 0 ? 1 : Math.max(0.5, 1 - (reversePosition * 0.25)),
                scale: 1 - (reversePosition * 0.03),
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className={cn(
                  "relative w-full h-full rounded-2xl overflow-hidden",
                  "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/90 via-zinc-900/95 to-black",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_-8px_rgba(0,0,0,0.9),0_32px_64px_-16px_rgba(0,0,0,0.6)]"
                )}
              >
                {/* Outer glow border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent pointer-events-none" />
                
                {/* Inner border highlight */}
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-b from-zinc-800/80 via-zinc-900/90 to-zinc-950 pointer-events-none" />
                
                {/* Top shine effect */}
                <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-tl-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-2xl pointer-events-none" />
                
                {/* Content container */}
                <div className="relative z-10 h-full p-3 sm:p-6 flex flex-col">
                  {/* Header with subtle background */}
                  <div className="relative mb-3 sm:mb-5">
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300 text-center">
                      {card.title}
                    </h3>
                  </div>
                  
                  {/* Separator with glow */}
                  <div className="relative mb-3 sm:mb-5">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <div className="absolute inset-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
                  </div>
                
                  <div className="relative flex-1 min-h-[150px] sm:min-h-[220px] md:min-h-[260px]">
                    {reversePosition === 0 && <Component />}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/15 to-cyan-500/20 blur-[40px] sm:blur-[80px] opacity-30 sm:opacity-40 -z-10"
        style={{
          transform: "translateY(15%) scale(1.1)",
        }}
      />
    </div>
  )
}
