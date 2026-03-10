"use client"

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Database, Code } from "lucide-react";
import { TechScrollSlider } from "./tech-scroll-slider";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ReactNode } from "react";

interface AboutSectionProps {
  children?: ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const skills = [
  { name: "Python", icon: Code },
  { name: "React", icon: Code },
  { name: "Node.js", icon: Code },
  { name: "OpenAI API", icon: Code },
  { name: "TypeScript", icon: Code },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Code },
  { name: "AWS", icon: Code },
  { name: "FastAPI", icon: Code },
  { name: "Tailwind CSS", icon: Code },
];



export function AboutSection({ children }: AboutSectionProps) {
  return (
    <section className="bg-black text-white">
      {/* Presentación */}
      <motion.div
        className="py-16 px-4 sm:px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.p variants={itemVariants} className="text-sm font-medium mb-8">
            Sobre Mí
          </motion.p>

          <div className="flex flex-col lg:flex-row gap-12">
          <motion.div 
            className="flex flex-col items-center justify-center bg-black order-2 lg:order-1 relative py-8 lg:py-0 lg:w-1/2"
            variants={itemVariants}>
              <div className="relative z-10 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[380px] xl:max-w-[420px] mx-auto">
                <Image 
                  src="/images/personal-hero-section.png" 
                  alt="Hero" 
                  width={500} 
                  height={500} 
                  priority 
                  className="w-full h-auto object-contain"
              />
              </div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <TechScrollSlider />
                </div>
              </motion.div>

          <motion.div variants={itemVariants} className="order-1 lg:order-2 lg:w-1/2">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Trayectoria Profesional
              <br />
              <span className="text-gray-400">&</span>
              <br />
              Visión Técnica
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Soy un ingeniero full-stack y especialista en IA dedicado a construir
              arquitecturas escalables y flujos de trabajo de automatización inteligente. Mi
              trabajo une la brecha entre sistemas backend robustos y
              experiencias frontend intuitivas. Con pasión por el código limpio y
              soluciones modernas, ayudo a las empresas a transformar requerimientos complejos
              en productos digitales fluidos. No solo escribo código; ingeniero soluciones. Ya sea optimizando una
              consulta de base de datos en un 50% o diseñando un agente de IA que reduce la
              carga de trabajo manual en 10 horas a la semana, me enfoco en el impacto tangible en el negocio.
              <br/>
              <span className="block mt-4 text-white font-medium">
                  ¿Quieres saber como lo hago?, visita mi blog.
              </span>
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
               <Link 
                href="/blog"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
               >
                 <Shimmer className="text-sm font-medium tracking-wide [--color-background:#ffffff] [--color-muted-foreground:#9ca3af]">
                    Visitar Blog
                 </Shimmer>
                 <span className="text-gray-400 group-hover:text-white transition-colors duration-300">→</span>
               </Link>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-bold">3+</p>
                <p className="text-gray-500 text-sm">AÑOS EXP.</p>
              </div>
              <div>
                <p className="text-4xl font-bold">5+</p>
                <p className="text-gray-500 text-sm">PROYECTOS</p>
              </div>
              <div>
                <p className="text-4xl font-bold">100%</p>
                <p className="text-gray-500 text-sm">CUMPLIMIENTO</p>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>

      {/* Experience Showcase (children) */}
      {children}

    </section>
  );
}
