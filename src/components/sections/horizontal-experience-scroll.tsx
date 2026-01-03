"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { StackedProjectCards } from "./stacked-project-cards";
import { AIChatPreview } from "./ai-chat-preview";
import { BackendExperienceCard } from "./backend-experience-card";
import { MicroservicesArchitecture } from "./microservices-architecture";
import { WorkflowAutomationArchitecture } from "./workflow-automation-architecture";
import { BackendExperienceStack } from "./backend-experience-stack";
import Link from "next/link";
import { Shimmer } from "@/components/ai-elements/shimmer";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ExperienceSectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  projects?: import("./stacked-project-cards").ProjectCardData[];
  customComponent?: "ai-chat" | "microservices-architecture" | "workflow-automation" | "backend-stack";
}

export interface HorizontalExperienceScrollProps {
  sections: ExperienceSectionData[];
}

export function HorizontalExperienceScroll({ sections }: HorizontalExperienceScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollContainerRef.current) return;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    // Use matchMedia for responsive animations/layout
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: Set width and enable horizontal scroll
      gsap.set(scrollContainer, { width: sections.length * 100 + "vw" });
      
      const totalWidth = scrollContainer.scrollWidth - window.innerWidth;

      gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [sections]);

  return (
    <div ref={containerRef} className="relative bg-black overflow-hidden -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32">
      {/* Ambient light effect on the left side - external */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at left, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        ref={scrollContainerRef}
        className="flex flex-col lg:flex-row"
      >
        {sections.map((section) => (
          <SectionPanel key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

import { useChatControl } from "@/providers/chat-provider";

// Componente separado para cada sección con animaciones useInView
function SectionPanel({ section }: { section: ExperienceSectionData }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.4 });
  const { toggleChat } = useChatControl();

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const componentVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 }
    }
  };

  return (
    <div
      ref={sectionRef}
      className="w-full lg:w-screen py-12 lg:py-0 lg:h-screen flex-shrink-0 flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div 
            className="flex flex-col text-center lg:text-left"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={textVariants}
          >
            <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-2 sm:mb-4">
              {section.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-white">
              {section.title}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              {section.description}
            </p>
            
            <div className="mt-8 flex justify-center lg:justify-start">
               {section.customComponent === "ai-chat" ? (
                 <button 
                   onClick={toggleChat}
                   className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                 >
                   <Shimmer className="text-sm font-medium tracking-wide [--color-background:#ffffff] [--color-muted-foreground:#9ca3af]">
                     Vive La Experiencia
                   </Shimmer>
                   <span className="text-gray-400 group-hover:text-white transition-colors duration-300">→</span>
                 </button>
               ) : (
                 <Link 
                   href="/projects"
                   className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                 >
                   <Shimmer className="text-sm font-medium tracking-wide [--color-background:#ffffff] [--color-muted-foreground:#9ca3af]">
                     Explorar todos los proyectos
                   </Shimmer>
                   <span className="text-gray-400 group-hover:text-white transition-colors duration-300">→</span>
                 </Link>
               )}
            </div>
          </motion.div>

          <motion.div 
            className="relative flex justify-center lg:justify-end"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={componentVariants}
          >
            {section.customComponent === "ai-chat" ? (
              <AIChatPreview />
            ) : section.customComponent === "microservices-architecture" ? (
              <BackendExperienceCard title="Arquitectura de MicroServicios">
                <MicroservicesArchitecture />
              </BackendExperienceCard>
            ) : section.customComponent === "workflow-automation" ? (
              <BackendExperienceCard title="Workflow Automatizations">
                <WorkflowAutomationArchitecture />
              </BackendExperienceCard>
            ) : section.customComponent === "backend-stack" ? (
              <BackendExperienceStack />
            ) : section.projects ? (
              <StackedProjectCards projects={section.projects} />
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
