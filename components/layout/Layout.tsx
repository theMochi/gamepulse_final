import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  /** Whether to include the footer (default: true) */
  showFooter?: boolean;
  /** Whether to include the navbar (default: true) */
  showNavbar?: boolean;
}

/**
 * Main Layout component for Gamepulse
 * 
 * Provides consistent structure across pages with:
 * - Sticky navigation header
 * - Flexible main content area
 * - Responsive footer
 */
export function Layout({
  children,
  className,
  showFooter = true,
  showNavbar = true,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {showNavbar && <Navbar />}
      
      <main className={cn('flex-1', className)}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

/**
 * Container component for consistent page padding and max-width
 */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16', className)}>
      {children}
    </div>
  );
}

/**
 * Section component for consistent vertical spacing
 */
export function Section({
  children,
  className,
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={cn('py-12 lg:py-16', className)}>
      {(title || description) && (
        <div className="mb-8 lg:mb-12">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-neutral-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

