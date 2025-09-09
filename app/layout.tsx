import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { GlobalSearch } from '@/components/global-search'
import { cn } from '@/lib/utils'

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
        <header className="border-b border-blue-200/40 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">GP</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GamePulse</span>
              </Link>
              
              <div className="flex items-center space-x-6">
                <GlobalSearch />
                <nav className="flex items-center space-x-6">
                  <Link 
                    href="/" 
                    className="text-zinc-600 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/games" 
                    className="text-zinc-600 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Browse Games
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="mt-24 border-t border-blue-200/40 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/20">
          <div className="mx-auto max-w-7xl px-4 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white grid place-items-center text-xs font-bold shadow-md">GP</div>
              <span>© {new Date().getFullYear()} GamePulse</span>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center gap-3 opacity-70 text-xs">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-purple-600 cursor-pointer transition-colors">GitHub</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
