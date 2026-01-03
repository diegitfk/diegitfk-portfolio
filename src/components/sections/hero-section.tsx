import { motion, Variants } from "framer-motion";
import { Github, Linkedin, Download, ArrowUpRight } from "lucide-react";
import LightRays from "@/components/LightRays";

export function HeroSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
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

    return (
        <section className="relative min-h-screen w-full bg-black overflow-hidden">
            {/* LightRays Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={0.5}
                    lightSpread={1.5}
                    rayLength={2.5}
                    pulsating={true}
                    fadeDistance={1.2}
                    saturation={0.3}
                    followMouse={true}
                    mouseInfluence={0.15}
                    noiseAmount={0.05}
                    distortion={0.1}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 border border-gray-700/50 rounded-full backdrop-blur-sm bg-black/30">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Disponible para trabajar
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center text-white leading-tight mb-4"
                >
                    Diego Cancino
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl md:text-2xl text-gray-400 text-center mb-8 max-w-2xl"
                >
                    Desarrollador Full Stack e Ingeniero de IA
                </motion.p>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base text-gray-500 text-center mb-12 max-w-xl leading-relaxed"
                >
                    Construyendo sistemas backend escalables, frontends modernos y agentes de IA inteligentes.
                    Apasionado por la arquitectura limpia y las soluciones innovadoras.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-12"
                >
                    <a
                        href="/cv-diego-cancino.pdf"
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        <Download size={18} />
                        Descargar CV
                        <ArrowUpRight size={16} />
                    </a>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-lg font-medium hover:bg-white/5 transition-colors"
                    >
                        Contáctame
                    </a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-4"
                >
                    <a
                        href="https://github.com/diegitfk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-gray-700/50 flex items-center justify-center hover:border-gray-500 hover:bg-white/5 transition-all backdrop-blur-sm"
                    >
                        <Github size={20} className="text-gray-400" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/diego-cancino-b19850294/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-gray-700/50 flex items-center justify-center hover:border-gray-500 hover:bg-white/5 transition-all backdrop-blur-sm"
                    >
                        <Linkedin size={20} className="text-gray-400" />
                    </a>
                    <a
                        href="https://x.com/diegitfk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-gray-700/50 flex items-center justify-center hover:border-gray-500 hover:bg-white/5 transition-all backdrop-blur-sm"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-gray-400 fill-current"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    variants={itemVariants}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <span className="text-xs uppercase tracking-wider">Desliza</span>
                        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}