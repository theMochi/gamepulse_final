'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Gamepad2, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/lists', label: 'Lists' },
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
        'sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-all hover:opacity-80 group"
          >
            <div className="relative">
              <Gamepad2 className="h-7 w-7 text-primary transition-all group-hover:text-glow-cyan" />
              <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-display font-bold tracking-wider text-foreground uppercase">
              Game<span className="text-primary">Pulse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
                  "transition-all hover:text-foreground",
                  "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5",
                  "after:bg-primary after:transition-all after:duration-300",
                  "hover:after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex">
              <div
                className={cn(
                  'relative flex items-center transition-all duration-300',
                  isSearchFocused ? 'w-80' : 'w-64'
                )}
              >
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    'w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground',
                    'placeholder:text-muted-foreground/60',
                    'outline-none transition-all duration-300',
                    'focus:border-primary/50 focus:bg-muted focus:ring-2 focus:ring-primary/20'
                  )}
                />
                <kbd className="absolute right-3 hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent pulse-live" />
            </button>

            {/* User Avatar */}
            <Link 
              href="/profile/me"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-primary transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border/50 py-4 lg:hidden animate-fade-in">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-10 pr-4 text-sm',
                    'placeholder:text-muted-foreground/60 text-foreground',
                    'outline-none focus:border-primary/50 focus:bg-muted focus:ring-2 focus:ring-primary/20'
                  )}
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
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
