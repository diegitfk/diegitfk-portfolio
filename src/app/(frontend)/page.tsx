"use client"

import { useState } from 'react'
import { PersonalPresentationAnimation } from '@/components/sections/text-effect-section'
import { HeroSection } from '@/components/sections/hero-section'
import CardNav from '@/components/CardNav'
import { NameNavbarAnimated } from '@/components/sections/name-navbar'

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
        </>
      )}
    </>
  )
}