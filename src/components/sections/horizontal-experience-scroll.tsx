"use client"

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StackedProjectCards } from "./stacked-project-cards";
import { AIChatPreview } from "./ai-chat-preview";

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
  customComponent?: "ai-chat";
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
    const totalWidth = scrollContainer.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
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
    }, container);

    return () => ctx.revert();
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
        className="flex"
        style={{ width: `${sections.length * 100}vw` }}
      >
        {sections.map((section) => (
          <div
            key={section.id}
            className="w-screen h-screen flex-shrink-0 flex items-center"
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="flex flex-col text-center lg:text-left">
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-2 sm:mb-4">
                    {section.subtitle}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-white">
                    {section.title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {section.description}
                  </p>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  {section.customComponent === "ai-chat" ? (
                    <AIChatPreview />
                  ) : section.projects ? (
                    <StackedProjectCards projects={section.projects} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
