"use client"

import { forwardRef, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { 
  GoogleDrive,
  Slack,
  Gmail,
  Svgl
} from "@ridemountainpig/svgl-react"

const WorkflowNode = forwardRef<
  HTMLDivElement,
  { 
    className?: string
    children?: React.ReactNode
    label?: string
    sublabel?: string
    size?: "sm" | "md" | "lg"
    hasTrigger?: boolean
  }
>(({ className, children, label, sublabel, size = "md", hasTrigger = false }, ref) => {
  const sizeClasses = {
    sm: "size-6 xs:size-8 sm:size-10 md:size-12",
    md: "size-7 xs:size-9 sm:size-12 md:size-14",
    lg: "size-8 xs:size-10 sm:size-14 md:size-16",
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        {hasTrigger && (
          <div className="absolute -left-2 xs:-left-3 -top-1 text-orange-500">
            <svg className="size-2 xs:size-3 sm:size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "z-10 flex items-center justify-center rounded-lg xs:rounded-xl border border-white/20 xs:border-2 bg-zinc-800/90 p-1 xs:p-2 shadow-lg backdrop-blur-sm transition-transform hover:scale-105",
            sizeClasses[size],
            className
          )}
        >
          {children}
        </div>
      </div>
      {label && (
        <div className="text-center mt-1">
          <p className="text-[6px] xs:text-[8px] sm:text-[10px] md:text-xs text-white font-medium leading-tight max-w-[45px] xs:max-w-[60px] sm:max-w-[80px] md:max-w-[100px]">
            {label}
          </p>
          {sublabel && (
            <p className="text-[5px] xs:text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 leading-tight hidden xs:block">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
WorkflowNode.displayName = "WorkflowNode"

const ConditionalNode = forwardRef<
  HTMLDivElement,
  { 
    className?: string
    label?: string
    sublabel?: string
  }
>(({ className, label, sublabel }, ref) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-7 xs:size-9 sm:size-12 md:size-14 items-center justify-center rounded-lg xs:rounded-xl border border-white/20 xs:border-2 bg-zinc-800/90 p-1 xs:p-1.5 sm:p-2 shadow-lg backdrop-blur-sm transition-transform hover:scale-105",
          className
        )}
      >
        <div className="flex flex-col items-center">
          <div className="flex gap-0.5">
            <div className="w-2 h-1 bg-emerald-500 rounded-sm" />
            <div className="w-2 h-1 bg-emerald-500 rounded-sm" />
          </div>
          <div className="flex gap-0.5 mt-0.5">
            <div className="w-2 h-1 bg-emerald-500 rounded-sm" />
            <div className="w-2 h-1 bg-emerald-500 rounded-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-0.5 xs:gap-1 sm:gap-2 text-[5px] xs:text-[7px] sm:text-[8px] md:text-[9px]">
        <span className="text-emerald-400">true</span>
        <span className="text-red-400">false</span>
      </div>
      {label && (
        <div className="text-center">
          <p className="text-[6px] xs:text-[8px] sm:text-[10px] md:text-xs text-white font-medium leading-tight max-w-[45px] xs:max-w-[60px] sm:max-w-[80px] md:max-w-[100px]">
            {label}
          </p>
          {sublabel && (
            <p className="text-[5px] xs:text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 leading-tight hidden xs:block">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
ConditionalNode.displayName = "ConditionalNode"

const ConnectionDot = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-10 size-1.5 xs:size-2 rounded-full bg-gray-500 border border-gray-400",
        className
      )}
    />
  )
)
ConnectionDot.displayName = "ConnectionDot"

export function WorkflowAutomationArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Refs para los nodos
  const googleDriveRef = useRef<HTMLDivElement>(null)
  const googleFormsRef = useRef<HTMLDivElement>(null)
  const mergePointRef = useRef<HTMLDivElement>(null)
  const slackRef = useRef<HTMLDivElement>(null)
  const conditionalRef = useRef<HTMLDivElement>(null)
  const splitPointRef = useRef<HTMLDivElement>(null)
  const googleSheetsRef = useRef<HTMLDivElement>(null)
  const gmailConfirmRef = useRef<HTMLDivElement>(null)
  const gmailFeedbackRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-visible py-4"
    >
      <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 md:gap-4 px-0.5 xs:px-1 sm:px-2">
        {/* Columna 1 - Triggers */}
        <div className="flex flex-col items-center gap-2 xs:gap-3 sm:gap-6 md:gap-8">
          <WorkflowNode 
            ref={googleDriveRef} 
            label="Check for new documents"
            hasTrigger
          >
            <GoogleDrive className="size-full" />
          </WorkflowNode>
          
          <WorkflowNode 
            ref={googleFormsRef} 
            label="On form submission"
            hasTrigger
          >
            <Svgl name="Google Forms" className="size-full" />
          </WorkflowNode>
        </div>

        {/* Punto de merge */}
        <div className="flex items-center">
          <ConnectionDot ref={mergePointRef} />
        </div>

        {/* Columna 2 - Slack */}
        <WorkflowNode 
          ref={slackRef} 
          label="Request approval"
          sublabel="sendAndWait: message"
        >
          <Slack className="size-full" />
        </WorkflowNode>

        {/* Columna 3 - Condicional */}
        <ConditionalNode 
          ref={conditionalRef}
          label="Check if request was approved"
        />

        {/* Punto de split */}
        <div className="flex items-center">
          <ConnectionDot ref={splitPointRef} />
        </div>

        {/* Columna 4 - Resultados */}
        <div className="flex flex-col items-center gap-2 xs:gap-3 sm:gap-6 md:gap-8">
          {/* Rama true */}
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 md:gap-4">
            <WorkflowNode 
              ref={googleSheetsRef} 
              label="Capture approval"
              sublabel="append: sheet"
            >
              <Svgl name="Google Sheets" className="size-full" />
            </WorkflowNode>
            
            <WorkflowNode 
              ref={gmailConfirmRef} 
              label="Send confirmation email"
              sublabel="send: message"
            >
              <Gmail className="size-full" />
            </WorkflowNode>
          </div>
          
          {/* Rama false */}
          <WorkflowNode 
            ref={gmailFeedbackRef} 
            label="Send feedback"
            sublabel="send: message"
          >
            <Gmail className="size-full" />
          </WorkflowNode>
        </div>
      </div>

      {/* Animated Beams - Solo en desktop para mejor rendimiento */}
      {!isMobile && (
        <>
          {/* Google Drive -> Merge Point */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={googleDriveRef}
            toRef={mergePointRef}
            curvature={30}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#4285f4"
            gradientStopColor="#34a853"
            duration={3}
          />

          {/* Google Forms -> Merge Point */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={googleFormsRef}
            toRef={mergePointRef}
            curvature={-30}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#673ab7"
            gradientStopColor="#34a853"
            duration={3}
            delay={0.5}
          />

          {/* Merge Point -> Slack */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={mergePointRef}
            toRef={slackRef}
            curvature={0}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#34a853"
            gradientStopColor="#4a154b"
            duration={2.5}
            delay={1}
          />

          {/* Slack -> Conditional */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={slackRef}
            toRef={conditionalRef}
            curvature={0}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#4a154b"
            gradientStopColor="#22c55e"
            duration={2.5}
            delay={1.5}
          />

          {/* Conditional -> Split Point */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={conditionalRef}
            toRef={splitPointRef}
            curvature={0}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#22c55e"
            gradientStopColor="#6b7280"
            duration={2}
            delay={2}
          />

          {/* Split Point -> Google Sheets (true branch) */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={splitPointRef}
            toRef={googleSheetsRef}
            curvature={-30}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#22c55e"
            gradientStopColor="#0f9d58"
            duration={2.5}
            delay={2.5}
          />

          {/* Google Sheets -> Gmail Confirm */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={googleSheetsRef}
            toRef={gmailConfirmRef}
            curvature={0}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#0f9d58"
            gradientStopColor="#ea4335"
            duration={2}
            delay={3}
          />

          {/* Split Point -> Gmail Feedback (false branch) */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={splitPointRef}
            toRef={gmailFeedbackRef}
            curvature={30}
            pathColor="rgba(255,255,255,0.15)"
            pathWidth={2}
            gradientStartColor="#ef4444"
            gradientStopColor="#ea4335"
            duration={2.5}
            delay={2.5}
          />
        </>
      )}
    </div>
  )
}
