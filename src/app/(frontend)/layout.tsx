import React from 'react'
import { Inter } from 'next/font/google';
// import { cn } from "@/lib/utils"; // Tu utilidad para classnames
import '../globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: {
    default: 'Diego Cancino | Full Stack Developer & AI Engineer',
    template: '%s | Diego Cancino',
  },
  description:
    'Portfolio profesional de Diego Cancino, desarrollador Full Stack e Ingeniero de IA especializado en sistemas escalables, arquitecturas modernas y agentes inteligentes.',
  keywords: [
    'Diego Cancino',
    'Full Stack Developer',
    'AI Engineer',
    'Next.js',
    'Payload CMS',
    'Software Architecture',
    'Generative AI',
    'React',
    'Tailwind CSS',
  ],
  authors: [{ name: 'Diego Cancino' }],
  creator: 'Diego Cancino',
}
const _inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
