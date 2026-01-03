import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface TimelineEvent {
  date: string;
  title: string;
  company: string;
  description: string;
  link?: string;
  roles?: string[]; // Added roles array
}

const events: TimelineEvent[] = [
  {
    date: "Diciembre 2025",
    title: "Nueva Alianza Partner.Med",
    company: "Tegma Solutions SPA",
    description: "Consolidación de proyecto con nueva alianza Partner.Med (Aún en desarrollo)",
    roles: ["Backend", "Frontend"]
  },
  {
    date: "Octubre 2025",
    title: "Lanzamiento San Fernando Salud",
    company: "Tegma Solutions SPA",
    description: "Lanzamiento exitoso de la página web de San Fernando Salud",
    link: "https://sanfernandosalud.cl/",
    roles: ["Frontend", "Backend"]
  },
  {
    date: "Septiembre 2025",
    title: "Operatividad SISA Médica",
    company: "Tegma Solutions SPA",
    description: "Puesta en operación de la página web de SISA Médica",
    link: "https://sisamedica.cl/",
    roles: ["Frontend", "Backend" , "ADS Manager"]
  },
  {
    date: "Junio 2025",
    title: "Fundación de Tegma Solutions SPA",
    company: "Empresa Propia",
    description: "Iniciamos Tegma Solutions SPA, empresa de desarrollo de software, páginas web e inteligencia artificial junto a mi socio",
    roles: ["CTO-Founder", "Full Stack Developer"]
  },
  {
    date: "Diciembre 2024",
    title: "Clouding Drive",
    company: "Proyecto Universitario",
    description: "Presentamos Clouding Drive como proyecto universitario",
    link : "https://github.com/diegitfk/cloud_proyect",
    roles: ["Full Stack Developer"]
  }
];

const TimelineItem = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut" 
      }}
      className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-12 last:mb-0 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Spacer for Desktop (Left side for odd, Right side for even) */}
      <div className="hidden md:block w-5/12" />

      {/* Axis Point (The Dot) */}
      {/* Mobile: Left aligned at 2.5rem (left-10). Desktop: Centered (left-1/2) */}
      <div className="absolute left-10 md:left-1/2 transform -translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center w-8 h-8 z-10">
        <div className="w-3 h-3 bg-white rounded-full relative">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 duration-1000"></div>
          <div className="relative w-full h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </div>
      </div>

      {/* Content */}
      <div className={`w-full pl-20 md:pl-0 md:w-5/12 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
         <div className="flex flex-col space-y-2">
            <span className="text-sm font-light text-gray-500 tracking-wider uppercase">
              {event.date}
            </span>
            <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">
              {event.title}
            </h3>
            <span className="text-base font-light text-gray-400">
              {event.company}
            </span>
            
            {/* Roles */}
            {event.roles && event.roles.length > 0 && (
              <div className={`flex flex-wrap gap-2 mt-1 mb-2 ${isEven ? "md:justify-end" : "justify-start"}`}>
                {event.roles.map((role, rIndex) => (
                  <span 
                    key={rIndex} 
                    className="px-2 py-0.5 text-xs font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
              {event.description}
            </p>
            {event.link && (
              <div className={`pt-2 ${isEven ? "md:flex md:justify-end" : ""}`}>
                <a 
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <span className="border-b border-transparent group-hover:border-white transition-all duration-300 pb-0.5">
                    Ver proyecto
                  </span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            )}
         </div>
      </div>
    </motion.div>
  );
};

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="bg-black py-24 md:py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 relative max-w-7xl">
         <div className="mb-20 md:mb-32">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4 tracking-tight">
              Experience Journey
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
              Un recorrido por mi evolución profesional, cada hito representa un nuevo desafío técnico y un paso adelante en mi carrera como desarrollador.
            </p>
         </div>

        {/* Timeline Wrapper */}
        <div className="relative" ref={containerRef}>
          {/* Vertical Line Container */}
          {/* Start line a bit earlier (-top-12) */}
          <div className="absolute left-10 md:left-1/2 transform -translate-x-1/2 md:-translate-x-1/2 -top-12 bottom-0 w-[1px] z-0">
            {/* Static Background Line */}
            <div className="absolute inset-0 bg-gray-800/50" />
            {/* Animated Foreground Line */}
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 bg-white"
            />
          </div>

          <div className="relative flex flex-col space-y-16 md:space-y-24 z-10">
            {events.map((event, index) => (
              <TimelineItem key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
