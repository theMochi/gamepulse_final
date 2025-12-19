import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AuthSessionProvider from '@/components/session-provider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gamepulse - Your Personal Gaming Journal',
  description: 'Track your gaming journey, discover new games, share reviews, and connect with fellow gamers. A social platform for gaming enthusiasts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={cn(inter.className, 'flex min-h-screen flex-col')}>
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
