'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/community', label: 'Community' },
  { href: '/profile/me', label: 'Profile' },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-xl',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Gamepulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden flex-1 justify-end md:flex">
            <div
              className={cn(
                'relative flex w-full max-w-xs items-center transition-all duration-200',
                isSearchFocused && 'max-w-sm'
              )}
            >
              <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  'w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400',
                  'outline-none transition-all duration-200',
                  'focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20'
                )}
              />
              <kbd className="absolute right-3 hidden rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 lg:inline-block">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-neutral-100 py-4 md:hidden">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

