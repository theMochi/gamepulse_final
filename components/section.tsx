import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ eyebrow, title, description, href, children, className }: SectionProps) {
  return (
    <section className={cn('relative mt-16 mb-20', className)}>
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-gradient-to-b from-card/70 to-transparent" />
      
      <div className="mb-6">
        {eyebrow && (
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mb-3">
            {eyebrow}
          </span>
        )}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {href && (
            <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {children}
      </div>
      
      {/* Subtle divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-12" />
    </section>
  );
}
