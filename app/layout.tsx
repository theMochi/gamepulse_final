import type { Metadata } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AuthSessionProvider from '@/components/session-provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'GamePulse - The Social Network for Gamers',
  description: 'Track your gaming journey, share reviews, discover what your friends are playing, and connect with the gaming community. Letterboxd for gamers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className={cn(rajdhani.className, 'flex min-h-screen flex-col font-body')}>
        <AuthSessionProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
