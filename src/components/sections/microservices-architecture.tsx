"use client"

import { forwardRef, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { 
  Nginx, 
  ElysiaJS, 
  FastAPI, 
  Docker, 
  Supabase, 
  Redis,
  Python,
  Bun
} from "@ridemountainpig/svgl-react"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; size?: "sm" | "md" | "lg" }
>(({ className, children, size = "md" }, ref) => {
  const sizeClasses = {
    sm: "size-8 sm:size-10 md:size-12",
    md: "size-10 sm:size-14 md:size-18",
    lg: "size-12 sm:size-18 md:size-22",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-xl border-2 border-white/20 bg-zinc-900/90 p-2 sm:p-3 shadow-lg backdrop-blur-sm transition-transform hover:scale-105",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"

const SmallIcon = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-5 sm:size-7 md:size-9 items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  )
})
SmallIcon.displayName = "SmallIcon"

const CloudIcon = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("z-10 flex items-center justify-center", className)}
    >
      <svg
        className="size-5 sm:size-7 md:size-9 text-white/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    </div>
  )
})
CloudIcon.displayName = "CloudIcon"

export function MicroservicesArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Refs para los nodos
  const nginxRef = useRef<HTMLDivElement>(null)
  const dockerNginxRef = useRef<HTMLDivElement>(null)
  const elysiaRef = useRef<HTMLDivElement>(null)
  const bunRef = useRef<HTMLDivElement>(null)
  const dockerElysiaRef = useRef<HTMLDivElement>(null)
  const fastapiRef = useRef<HTMLDivElement>(null)
  const pythonRef = useRef<HTMLDivElement>(null)
  const dockerFastapiRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<HTMLDivElement>(null)
  const cloudSupabaseRef = useRef<HTMLDivElement>(null)
  const redisRef = useRef<HTMLDivElement>(null)
  const cloudRedisRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-visible"
    >
      <div className="flex w-full items-center justify-between gap-4 sm:gap-6 md:gap-10 px-2 sm:px-4 md:px-6">
        {/* Columna izquierda - Nginx */}
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <SmallIcon ref={dockerNginxRef}>
            <Docker className="size-full" />
          </SmallIcon>
          <Circle ref={nginxRef} size="lg">
            <Nginx className="size-full" />
          </Circle>
        </div>

        {/* Columna central - Elysia y FastAPI */}
        <div className="flex flex-col items-center gap-6 sm:gap-10 md:gap-14">
          {/* Elysia con Bun y Docker */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <SmallIcon ref={bunRef}>
                <Bun className="size-full" />
              </SmallIcon>
              <SmallIcon ref={dockerElysiaRef}>
                <Docker className="size-full" />
              </SmallIcon>
            </div>
            <Circle ref={elysiaRef} size="md">
              <ElysiaJS className="size-full" />
            </Circle>
          </div>

          {/* FastAPI con Python y Docker */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <SmallIcon ref={pythonRef}>
                <Python className="size-full" />
              </SmallIcon>
              <SmallIcon ref={dockerFastapiRef}>
                <Docker className="size-full" />
              </SmallIcon>
            </div>
            <Circle ref={fastapiRef} size="md">
              <FastAPI className="size-full" />
            </Circle>
          </div>
        </div>

        {/* Columna derecha - Supabase y Redis (Cloud) */}
        <div className="flex flex-col items-center gap-6 sm:gap-10 md:gap-14">
          {/* Supabase */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <CloudIcon ref={cloudSupabaseRef} />
            <Circle ref={supabaseRef} size="md">
              <Supabase className="size-full" />
            </Circle>
          </div>

          {/* Redis */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <CloudIcon ref={cloudRedisRef} />
            <Circle ref={redisRef} size="md">
              <Redis className="size-full" />
            </Circle>
          </div>
        </div>
      </div>

      {/* Animated Beams - Solo en desktop para mejor rendimiento */}
      {!isMobile && (
        <>
          {/* Nginx -> Elysia */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={nginxRef}
            toRef={elysiaRef}
            curvature={-40}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#22c55e"
            gradientStopColor="#3b82f6"
            duration={4}
          />

          {/* Nginx -> FastAPI */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={nginxRef}
            toRef={fastapiRef}
            curvature={40}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#22c55e"
            gradientStopColor="#10b981"
            duration={4.5}
            delay={0.5}
          />

          {/* Elysia -> Supabase */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={elysiaRef}
            toRef={supabaseRef}
            curvature={-20}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#3b82f6"
            gradientStopColor="#22c55e"
            duration={3.5}
            delay={1}
          />

          {/* Elysia -> Redis */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={elysiaRef}
            toRef={redisRef}
            curvature={20}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#3b82f6"
            gradientStopColor="#ef4444"
            duration={4}
            delay={1.5}
          />

          {/* FastAPI -> Supabase */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={fastapiRef}
            toRef={supabaseRef}
            curvature={-20}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#10b981"
            gradientStopColor="#22c55e"
            duration={3.8}
            delay={2}
          />

          {/* FastAPI -> Redis */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={fastapiRef}
            toRef={redisRef}
            curvature={20}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#10b981"
            gradientStopColor="#ef4444"
            duration={4.2}
            delay={2.5}
          />
        </>
      )}
    </div>
  )
}
