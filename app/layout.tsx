import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { GlobalSearch } from '@/components/global-search'
import { cn } from '@/lib/utils'
import AuthSessionProvider from '@/components/session-provider'
import AuthNav from '@/components/auth-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GamePulse - Discover Amazing Games',
  description: 'Discover the best games of 2025, browse by genre and platform, and stay updated with the latest releases.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <AuthSessionProvider>
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-foreground">GamePulse</span>
              </Link>
              
              <div className="flex items-center space-x-6">
                <GlobalSearch />
                <nav className="flex items-center space-x-6">
                  <Link 
                    href="/" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/games" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                  >
                    Browse Games
                  </Link>
                </nav>
                <AuthNav />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="mt-24 border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground grid place-items-center text-xs font-bold">GP</div>
              <span>© {new Date().getFullYear()} GamePulse</span>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/about" className="hover:text-foreground transition-colors">About</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </nav>
            <div className="flex items-center gap-3 opacity-70 text-xs">
              <span className="hover:text-primary cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-primary cursor-pointer transition-colors">GitHub</span>
            </div>
          </div>
        </footer>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
