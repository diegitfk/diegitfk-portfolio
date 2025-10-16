import React from 'react'
import { Inter } from 'next/font/google';
import { cn } from "@/lib/utils"; // Tu utilidad para classnames
import '../globals.css';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}>
        <main>{children}</main>
      </body>
    </html>
  )
}
