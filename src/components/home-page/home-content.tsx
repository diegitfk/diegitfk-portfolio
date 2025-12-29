"use client"

import { useState } from 'react'
import { PersonalPresentationAnimation } from '@/components/sections/text-effect-section'
import { HeroSection } from '@/components/sections/hero-section'
import { BlurNavbar } from '@/components/BlurNavbar'
import { AboutSection } from '@/components/sections/about-section'
import { HorizontalExperienceScroll } from '@/components/sections/experience-showcase'
import { ContactSection } from '@/components/sections/contact-section'
import { ChatBot } from '@/components/chat/chat-bot'

export function HomeContent() {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      {!showContent && (
        <div className="flex flex-col items-center justify-center">
          <PersonalPresentationAnimation 
            words={["Hola, Aquí", "Diego Cancino"]} 
            onComplete={() => setShowContent(true)}
          />
        </div>
      )}

      {showContent && (
        <>
          <BlurNavbar 
            items={[
              { label: "Home", href: "#" },
              { label: "Proyectos", href: "#projects" },
              { label: "Blog", href: "/blog" },
            ]}
            ctaLabel="Contacto"
            ctaHref="#contact"
          />
          <HeroSection />
          <AboutSection>
            <HorizontalExperienceScroll 
              sections={[
                {
                  id: "frontend",
                  title: "Frontend Experience",
                  subtitle: "Expertise",
                  description: "Creating responsive, accessible, and dynamic user interfaces using modern frameworks like React and Tailwind. Building pixel-perfect designs that deliver exceptional user experiences across all devices.",
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
                  title: "Backend Experience",
                  subtitle: "Expertise",
                  description: "Building robust and scalable server-side applications with Node.js, Python, and modern databases. Designing RESTful APIs and microservices architectures for high-performance systems.",
                  customComponent: "backend-stack",
                },
                {
                  id: "ai",
                  title: "AI Experience",
                  subtitle: "Expertise",
                  description: "Implementing machine learning models and AI-powered features. Working with LLMs, computer vision, and natural language processing to create intelligent applications.",
                  customComponent: "ai-chat",
                },
              ]}
            />
          </AboutSection>
          <ContactSection />
          <ChatBot visible={showContent} />
        </>
      )}
    </>
  )
}
