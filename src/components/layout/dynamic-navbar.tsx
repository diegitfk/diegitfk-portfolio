"use client"

import { usePathname } from 'next/navigation'
import { useIntro } from '@/providers/intro-provider'
import { BlurNavbar } from '@/components/BlurNavbar'

type Props = React.ComponentProps<typeof BlurNavbar>

export function DynamicNavbar(props: Props) {
  const pathname = usePathname()
  const { hasIntroRun, isLoaded } = useIntro()

  const isHome = pathname === '/'

  // Always show on non-home pages
  if (!isHome) {
    return <BlurNavbar {...props} />
  }

  // Prevent flash during loading on Home
  if (!isLoaded) {
    return null
  }

  // On Home, only show if intro has finished
  if (hasIntroRun) {
    return <BlurNavbar {...props} />
  }

  // Otherwise (Home + Intro animation running/pending), hide it
  return null
}
