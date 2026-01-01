"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type IntroContextType = {
  hasIntroRun: boolean
  setHasIntroRun: (value: boolean) => void
  isLoaded: boolean
}

const IntroContext = createContext<IntroContextType | undefined>(undefined)

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasIntroRun, setHasIntroRunState] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check session storage on mount
    const stored = sessionStorage.getItem('intro_animation_shown')
    if (stored === 'true') {
      setHasIntroRunState(true)
    }
    setIsLoaded(true)
  }, [])

  const setHasIntroRun = (value: boolean) => {
    setHasIntroRunState(value)
    if (value) {
      sessionStorage.setItem('intro_animation_shown', 'true')
    }
  }

  // Prevent flash of content/animation mismatch by waiting for mount check
  // However, for SSR we might want to default to false (show animation) or true?
  // If we default to false, it might flash animation for a split second for returning users before useEffect runs.
  // But since we are client side for this check, it's unavoidable without cookies.
  // We can return null until loaded if we want to be strict, but that blocks the whole app.
  // Better to just let it handle state.

  return (
    <IntroContext.Provider value={{ hasIntroRun, setHasIntroRun, isLoaded }}>
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  const context = useContext(IntroContext)
  if (context === undefined) {
    throw new Error('useIntro must be used within an IntroProvider')
  }
  return context
}
