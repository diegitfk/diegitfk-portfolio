import { useState } from "react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import ReasoningSection from "@/components/sections/thinking-component";
import { SplitText } from "@/components/ui/text-generate-effect";
import { TechScrollSlider } from "@/components/sections/tech-scroll-slider";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export function HeroSection() {
    const [isThinkingStreaming, setIsThinkingStreaming] = useState(true)
    const words = `Soy Diego Cancino, ingeniero de sistemas con enfoque integral en Backend, Frontend y agentes de IA. Trabajo con Python, JavaScript y TypeScript para 
    crear soluciones escalables, desde microservicios con Docker hasta aplicaciones modernas en Next.js. Mis proyectos combinan arquitectura sólida, tecnologías como LangChain/Agno y diseño 
    orientado a sistemas eficientes e innovadores.
    `;

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

    const staggerItemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };



    return (
        <motion.section 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-black min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div 
                className="min-h-[40vh] sm:min-h-[50vh] lg:min-h-screen flex flex-col items-center justify-center bg-black order-2 lg:order-1 relative py-8 lg:py-0"
                variants={itemVariants}
            >
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
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0">
                    <TechScrollSlider />
                </div>
            </motion.div>
            <motion.div 
                className="flex flex-col justify-start pt-36 sm:pt-40 lg:pt-32 xl:pt-40 px-4 sm:px-6 lg:px-8 xl:px-12 order-1 lg:order-2"
                variants={staggerItemVariants}
            >
                <motion.div 
                    className="flex flex-row items-center justify-center lg:justify-start"
                    variants={itemVariants}
                >
                    <LayoutTextFlip text='Desarrollador ' words={[
                    "Backend",
                    "AI Agents",
                    "Frontend",
                    ]} />
                </motion.div>
                <motion.div 
                    className="flex flex-col items-center lg:items-start mt-6 sm:mt-8"
                    variants={itemVariants}
                >
                    <div className="p-3 sm:p-4 w-full lg:w-11/12 xl:w-full">
                        <ReasoningSection isStreaming={isThinkingStreaming} setIsStreaming={setIsThinkingStreaming} />
                    </div>
                    {!isThinkingStreaming && (
                        <motion.div 
                            className="w-full lg:w-11/12 xl:w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SplitText 
                                className='w-full p-3 sm:p-4 text-white text-base sm:text-lg lg:text-xl leading-relaxed' 
                                text={words} 
                                animation="blur"
                                staggerDelay={0.02}
                                duration={0.5}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </motion.section>
    )
}