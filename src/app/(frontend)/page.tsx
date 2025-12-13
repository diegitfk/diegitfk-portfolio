"use client"

import { useState } from 'react'
import { PersonalPresentationAnimation } from '@/components/sections/text-effect-section'
import { HeroSection } from '@/components/sections/hero-section'
import CardNav from '@/components/CardNav'
import { NameNavbarAnimated } from '@/components/sections/name-navbar'
import { AboutSection } from '@/components/sections/about-section'
import { HorizontalExperienceScroll, ExperienceSectionData } from '@/components/sections/experience-showcase'

export default function HomePage() {
  const [showContent, setShowContent] = useState(false)
  const items = [
    {
      label: "Acerca de",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Proyectos", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contacto",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email" , href : "https://mail.google.com/mail/?view=cm&fs=1&to=cancinod080@gmail.com" },
        { label: "X", ariaLabel: "X" , href : "https://x.com/diegitfk" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" , href : "https://www.linkedin.com/in/diego-cancino-b19850294/" }
      ]
    }
  ];
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
          <CardNav 
          logo={<NameNavbarAnimated />}
          items={items} 
          ease="power3.out"
          baseColor="#000"
          menuColor="#fff"
          buttonBgColor="#fff"
          buttonTextColor="#000"
          />
          <HeroSection />
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
                ]
              },
              {
                id: "backend",
                title: "Backend Experience",
                subtitle: "Expertise",
                description: "Building robust and scalable server-side applications with Node.js, Python, and modern databases. Designing RESTful APIs and microservices architectures for high-performance systems.",
                projects: [
                  {
                    id: 3,
                    title: "API Services",
                    description: "Backend services and API development for healthcare platforms.",
                    status: "completed",
                    date: "2024",
                  },
                ]
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
          <AboutSection />
        </>
      )}
    </>
  )
}