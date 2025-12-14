"use client"

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface ProjectCardData {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  date: string;
  image?: string;
  url?: string;
}

export interface StackedProjectCardsProps {
  projects: ProjectCardData[];
}

export function StackedProjectCards({ projects }: StackedProjectCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const rotateCards = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = setInterval(rotateCards, 1500);
    return () => clearInterval(interval);
  }, [rotateCards, isPaused, isInView]);

  const getStatusConfig = (status: ProjectCardData["status"]) => {
    switch (status) {
      case "completed":
        return { color: "text-emerald-400", bg: "bg-emerald-500", label: "Completed" };
      case "in-progress":
        return { color: "text-amber-400", bg: "bg-amber-500", label: "In Progress" };
      case "planned":
        return { color: "text-red-400", bg: "bg-red-500", label: "Planned" };
    }
  };

  const getCardPosition = (index: number) => {
    const totalCards = projects.length;
    const relativePosition = (index - activeIndex + totalCards) % totalCards;
    return relativePosition;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] lg:h-[580px] xl:h-[620px] flex items-center justify-center pt-2 sm:pt-4 md:pt-6 lg:pt-8"
      style={{
        perspective: "1200px",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      {/* Sombreado derecho - oculto en mobile */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none z-10 hidden sm:block"
        style={{
          background: "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, transparent 100%)",
        }}
      />
      <div
        className="relative w-[320px] h-[200px] sm:w-[380px] sm:h-[237px] md:w-[450px] md:h-[281px] lg:w-[520px] lg:h-[325px] xl:w-[580px] xl:h-[362px]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-8deg) rotateY(35deg) rotateZ(0deg)"
        }}
      >
        {/* Glow effect - same as ai-chat-preview */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/20 via-gray-400/10 to-white/20 blur-[80px] -z-10"
          style={{ transform: "translateZ(-80px) scale(1.3)" }}
        />

        {/* Reflection/shadow underneath */}
        <div
          className="absolute -bottom-4 left-4 right-4 h-20 bg-gradient-to-t from-black/80 to-transparent blur-xl -z-10"
          style={{ transform: "translateZ(-100px) rotateX(60deg)" }}
        />

        {projects.map((project, index) => {
          const statusConfig = getStatusConfig(project.status);
          const position = getCardPosition(index);
          const reversePosition = projects.length - 1 - position;

          return (
            <motion.div
              key={project.id}
              className="absolute inset-0 w-full h-full cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
              initial={false}
              animate={{
                x: reversePosition * -20,
                y: reversePosition * -28,
                z: reversePosition * -40,
                zIndex: position,
                opacity: reversePosition === 0 ? 1 : Math.max(0.25, 1 - (reversePosition * 0.3)),
                scale: 1 - (reversePosition * 0.04),
                filter: reversePosition === 0 ? "blur(0px) brightness(1)" : `blur(${reversePosition * 1.5}px) brightness(${Math.max(0.3, 1 - reversePosition * 0.25)})`,
              }}
              whileHover={{
                x: reversePosition * -20 + 8,
                y: reversePosition * -28 - 15,
                z: reversePosition * -40 + 25,
                scale: 1.03,
                zIndex: projects.length + 10,
                opacity: 1,
                filter: "blur(0px) brightness(1)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                if (reversePosition === 0 && project.url) {
                  window.open(project.url, "_blank", "noopener,noreferrer");
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              <div
                className="w-full h-full bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-white/20 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b border-white/[0.06] bg-[#141414]">
                   <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${statusConfig.bg} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                   <span className={`text-[10px] sm:text-xs font-medium tracking-wide ${statusConfig.color}`}>
                     {statusConfig.label}
                   </span>
                   <span className="text-[8px] sm:text-[10px] text-white/30 ml-auto font-mono">
                     {project.date}
                   </span>
                </div>

                {/* Preview Image */}
                <div className="relative flex-1 overflow-hidden bg-[#050505] group">
                  {project.image ? (
                    <>
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top opacity-90 transition-all duration-500 group-hover:scale-105"
                        width={400}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-40" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3 md:p-4 bg-[#0f0f0f] border-t border-white/[0.06] relative z-10">
                  <h3 className="text-xs sm:text-sm font-semibold text-white/95 mb-0.5 sm:mb-1 flex items-center gap-1 sm:gap-2">
                    {project.title}
                    {project.url && (
                       <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                    )}
                  </h3>
                  <p className="text-white/60 text-[10px] sm:text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ambient light effect on the left side - external */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-1/3 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at left, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export function MockWebpage() {
  const projects: ProjectCardData[] = [
    {
      id: 1,
      title: "SISA Médica",
      description: "Centro de Imagenología con servicios de Resonancia Magnética, Tomografía Computada, Radiografía, Mamografía y Ecografía.",
      status: "completed",
      date: "2025",
      image: "/images/projects/sisa-medica.png",
      url: "https://sisamedica.cl/"
    },
    {
      id: 2,
      title: "San Fernando Salud",
      description: "Centro Médico con más de 25 especialidades médicas, laboratorio clínico acreditado y servicios integrales de salud.",
      status: "completed",
      date: "2025",
      image: "/images/projects/sanfernando-salud.png",
      url: "https://sanfernandosalud.cl/"
    }
  ];

  return <StackedProjectCards projects={projects} />;
}
