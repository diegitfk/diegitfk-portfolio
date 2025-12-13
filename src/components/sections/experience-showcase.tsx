"use client"

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export interface ExperienceShowcaseProps {
  title: string;
  subtitle?: string;
  description: string;
  children: ReactNode;
  reversed?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function ExperienceShowcase({
  title,
  subtitle,
  description,
  children,
  reversed = false
}: ExperienceShowcaseProps) {
  return (
    <motion.section
      className="bg-black text-white py-20 px-4 sm:px-6 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div
            variants={itemVariants}
            className={`flex flex-col ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {subtitle && (
              <span className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                {subtitle}
              </span>
            )}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              {description}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`relative ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

interface PerspectiveContainerProps {
  children: ReactNode;
}

function PerspectiveContainer({ children }: PerspectiveContainerProps) {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ perspective: "2000px", perspectiveOrigin: "center center" }}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-12deg) rotateX(8deg) scale(0.95)",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `,
        }}
        whileHover={{
          transform: "rotateY(-4deg) rotateX(3deg) scale(1)",
          boxShadow: `
            0 35px 60px -15px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.15)
          `,
          transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
        {children}
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-blue-600/20 to-cyan-500/30 blur-[100px] opacity-40 -z-10"
        style={{
          transform: "translateY(20%) scale(1.2)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/50 blur-2xl -z-10"
        style={{
          transform: "translateY(100%) rotateX(80deg)",
        }}
      />
    </div>
  );
}

// Re-export components from other files for backward compatibility
export { StackedProjectCards, MockWebpage } from "./stacked-project-cards";
export { HorizontalExperienceScroll } from "./horizontal-experience-scroll";
export type { ProjectCardData, StackedProjectCardsProps } from "./stacked-project-cards";
export type { ExperienceSectionData, HorizontalExperienceScrollProps } from "./horizontal-experience-scroll";
