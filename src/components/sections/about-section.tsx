"use client"

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Download, Linkedin, Database, Layout, Bot, Briefcase, Code } from "lucide-react";
import { TechScrollSlider } from "./tech-scroll-slider";
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

const services = [
  {
    icon: Database,
    title: "Backend Architecture",
    description: "Building scalable, secure APIs and complex database schemas optimized for high performance and low latency."
  },
  {
    icon: Layout,
    title: "Frontend Experience",
    description: "Creating responsive, accessible, and dynamic user interfaces using modern frameworks like React and Tailwind."
  },
  {
    icon: Bot,
    title: "AI Agent Development",
    description: "Designing and deploying intelligent agents that automate complex workflows using LLMs and custom RAG pipelines."
  }
];

const experience = [
  {
    icon: Briefcase,
    title: "Senior Full Stack Developer",
    period: "2022 - Present",
    current: true,
    description: "Leading backend architecture and frontend integration for high-scale enterprise applications. Mentoring junior developers and establishing CI/CD best practices."
  },
  {
    icon: Bot,
    title: "AI Integration Specialist",
    period: "2020 - 2022",
    current: false,
    description: "Spearheaded the adoption of LLMs and automated workflows. Developed internal tools that improved team efficiency by 40% using Python and OpenAI APIs."
  },
  {
    icon: Code,
    title: "Frontend Developer",
    period: "2018 - 2020",
    current: false,
    description: "Focused on building responsive, pixel-perfect user interfaces and accessible web components. Translated Figma designs into high-quality React code."
  }
];

export function AboutSection() {
  return (
    <motion.section
      className="bg-black text-white py-16 px-4 sm:px-6 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.p variants={itemVariants} className="text-sm font-medium mb-8">
          About Me
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Professional Background
              <br />
              <span className="text-gray-400">&</span>
              <br />
              Technical Vision
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              I am a full-stack engineer and AI specialist dedicated to building
              scalable architectures and intelligent automation workflows. My
              work bridges the gap between robust backend systems and
              intuitive frontend experiences. With a passion for clean code and
              modern solutions, I help businesses transform complex
              requirements into seamless digital products.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                <Download size={18} />
                Download Resume
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                <Linkedin size={18} />
                LinkedIn
              </button>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-bold">5+</p>
                <p className="text-gray-500 text-sm">YEARS EXP.</p>
              </div>
              <div>
                <p className="text-4xl font-bold">20+</p>
                <p className="text-gray-500 text-sm">PROJECTS</p>
              </div>
              <div>
                <p className="text-4xl font-bold">100%</p>
                <p className="text-gray-500 text-sm">DELIVERY</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center justify-center bg-black order-2 lg:order-1 relative py-8 lg:py-0"
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
        </div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <service.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-6">
              <Code size={20} />
              <h3 className="text-lg font-semibold">Technical Arsenal</h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-white/5 transition-colors"
                >
                  <skill.icon size={14} />
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 relative">
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <h4 className="font-semibold">Why Work With Me?</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                I don&apos;t just write code; I engineer solutions. Whether it&apos;s optimizing a
                database query by 50% or designing an AI agent that reduces
                manual workload by 10 hours a week, I focus on tangible business
                impact.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase size={20} />
              <h3 className="text-lg font-semibold">Experience Journey</h3>
            </div>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-8 border-l border-white/10">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <exp.icon size={12} />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{exp.title}</h4>
                    {exp.current && (
                      <span className="px-3 py-1 text-xs rounded-full border border-white/20">
                        Present
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{exp.period}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
