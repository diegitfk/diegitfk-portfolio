"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type Grid = {
  rows: number
  cols: number
}

const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
}

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS

interface PixelImageProps {
  src: string
  grid?: PredefinedGridKey
  customGrid?: Grid
  grayscaleAnimation?: boolean
  pixelFadeInDuration?: number // in ms
  maxAnimationDelay?: number // in ms
  colorRevealDelay?: number // in ms
  className?: string
  /** Object position for responsive image positioning (e.g., "center", "top", "center top") */
  objectPosition?: string
  /** Additional classes for the image element itself */
  imageClassName?: string
}

export const PixelImage = ({
  src,
  grid = "6x4",
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  className,
  objectPosition = "center",
  imageClassName,
}: PixelImageProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [delays, setDelays] = useState<number[]>([])

  const MIN_GRID = 1
  const MAX_GRID = 16

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid) => {
      if (!grid) return false
      const { rows, cols } = grid
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      )
    }

    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid]
  }, [customGrid, grid])

  // Generate random delays only on client side to avoid hydration mismatch
  useEffect(() => {
    const total = rows * cols
    const generatedDelays = Array.from({ length: total }, () => 
      Math.random() * maxAnimationDelay
    )
    setDelays(generatedDelays)
    setIsMounted(true)
  }, [rows, cols, maxAnimationDelay])

  useEffect(() => {
    if (!isMounted) return
    setIsVisible(true)
    const colorTimeout = setTimeout(() => {
      setShowColor(true)
    }, colorRevealDelay)
    return () => clearTimeout(colorTimeout)
  }, [isMounted, colorRevealDelay])

  // Generate clip paths (these are deterministic, no random)
  const pieces = useMemo(() => {
    const total = rows * cols
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`

      return { clipPath }
    })
  }, [rows, cols])

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className={cn("relative select-none", className || "h-72 w-72 md:h-96 md:w-96")}>
        <img
          src={src}
          alt="Loading..."
          className={cn(
            "w-full h-full object-cover opacity-0",
            imageClassName
          )}
          style={{ objectPosition }}
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div className={cn("relative select-none", className || "h-72 w-72 md:h-96 md:w-96")}>
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${delays[index] || 0}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <img
            src={src}
            alt={`Pixel image piece ${index + 1}`}
            className={cn(
              "z-1 w-full h-full object-cover",
              grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale"),
              imageClassName
            )}
            style={{
              objectPosition,
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}

