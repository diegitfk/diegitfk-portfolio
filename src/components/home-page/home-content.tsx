"use client"

import { useIntro } from '@/providers/intro-provider'
import { PersonalPresentationAnimation } from '@/components/sections/text-effect-section'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { HorizontalExperienceScroll } from '@/components/sections/experience-showcase'
import { ContactSection } from '@/components/sections/contact-section'


import { FeaturedProjects } from '@/components/sections/featured-projects'
import Timeline from '@/components/sections/Timeline'

export function HomeContent() {
  const { hasIntroRun, setHasIntroRun, isLoaded } = useIntro()

  if (!isLoaded) return null

  return (
    <>
      {!hasIntroRun && (
        <div className="flex flex-col items-center justify-center">
          <PersonalPresentationAnimation 
            words={["Hola, soy", "Diego Cancino"]} 
            onComplete={() => setHasIntroRun(true)}
          />
        </div>
      )}

      {hasIntroRun && (
        <>
          <HeroSection />
          <AboutSection>
            <HorizontalExperienceScroll 
              sections={[
                {
                  id: "frontend",
                  title: "Experiencia Frontend",
                  subtitle: "Especialidad",
                  description: "Creando interfaces de usuario responsivas, accesibles y dinámicas utilizando frameworks modernos como React y Tailwind. Construyendo diseños pixel-perfect que entregan experiencias de usuario excepcionales en todos los dispositivos.",
                  projects: [
                    {
                      id: 1,
                      title: "SISA Médica",
                      description: "Centro de Imagenología con servicios de Resonancia Magnética, Tomografía Computada, Radiografía, Mamografía y Ecografía.",
                      status: "completed",
                      date: "2024",
                      image: "/images/projects/sisa-medica.png",
                      url: "https://sisamedica.cl/"
                    },
                    {
                      id: 2,
                      title: "San Fernando Salud",
                      description: "Centro Médico con más de 25 especialidades médicas, laboratorio clínico acreditado y servicios integrales de salud.",
                      status: "completed",
                      date: "2024",
                      image: "/images/projects/sanfernando-salud.png",
                      url: "https://sanfernandosalud.cl/"
                    },
                    {
                      id : 3,
                      title : "Portfolio Personal",
                      description : "Mi portfolio personal donde muestro mis proyectos y experiencia.",
                      status : "completed",
                      date : "2025",
                      image : "/images/projects/portfolio.png",
                      url : "/"
                    }
                  ]
                },
                {
                  id: "backend",
                  title: "Experiencia Backend",
                  subtitle: "Especialidad",
                  description: "Construyendo aplicaciones del lado del servidor robustas y escalables con Node.js, Python y bases de datos modernas. Diseñando APIs RESTful y arquitecturas de microservicios para sistemas de alto rendimiento.",
                  customComponent: "backend-stack",
                },
                {
                  id: "ai",
                  title: "Experiencia en IA",
                  subtitle: "Especialidad",
                  description: "Especializado en la construcción de arquitecturas de agentes de IA y workflows agénticos. Domino el desarrollo Code-first (LangChain + LangGraph, Agno, Mastra) para lógica compleja, complementado con soluciones NoCode (Make.com, n8n) para orquestaciones ágiles. Integro estos sistemas en estrategias multi-canal y frontends modernos mediante protocolos AGUI y el AI SDK de Vercel.",
                  customComponent: "ai-chat",
                },
              ]}
            />
          </AboutSection>
          <FeaturedProjects />
          <Timeline />
          <ContactSection />

        </>
      )}
    </>
  )
}
