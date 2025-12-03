"use client";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

type SplitType = "chars" | "words" | "lines";
type AnimationType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "blur";

interface SplitTextProps {
  text: string;
  className?: string;
  splitType?: SplitType;
  animation?: AnimationType;
  duration?: number;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
}

const getAnimationVariants = (animation: AnimationType): Variants => {
  const animations: Record<AnimationType, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-down": {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  };
  return animations[animation];
};

const splitText = (text: string, type: SplitType): string[] => {
  switch (type) {
    case "chars":
      return text.split("");
    case "words":
      return text.split(" ");
    case "lines":
      return text.split("\n");
    default:
      return text.split(" ");
  }
};

export const SplitText = ({
  text,
  className,
  splitType = "words",
  animation = "slide-up",
  duration = 0.4,
  staggerDelay = 0.03,
  initialDelay = 0,
  once = true,
}: SplitTextProps) => {
  const segments = splitText(text, splitType);
  const animationVariants = getAnimationVariants(animation);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: animationVariants.hidden,
    visible: {
      ...animationVariants.visible,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn("text-2xl leading-snug tracking-wide font-bold dark:text-white text-black", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      variants={containerVariants}
    >
      {segments.map((segment, idx) => (
        <motion.span
          key={`${segment}-${idx}`}
          className="inline-block"
          variants={itemVariants}
        >
          {segment}
          {splitType === "words" && <span>&nbsp;</span>}
          {splitType === "lines" && <br />}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Alias para compatibilidad con el componente anterior
export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => (
  <SplitText
    text={words}
    className={className}
    animation={filter ? "blur" : "fade"}
    duration={duration}
    staggerDelay={0.02}
  />
);
