'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedBlockProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const AnimatedBlock: React.FC<AnimatedBlockProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.95, y: 30 }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: React.ReactNode
  index: number
  className?: string
}

export const AnimatedListItem: React.FC<AnimatedListProps> = ({
  children,
  index,
  className = '',
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
