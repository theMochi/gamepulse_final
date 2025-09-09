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
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-gradient-to-b from-neutral-50/70 to-transparent" />
      
      <div className="mb-6">
        {eyebrow && (
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 mb-3">
            {eyebrow}
          </span>
        )}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
            {description && <p className="text-sm text-zinc-600 mt-1">{description}</p>}
          </div>
          {href && (
            <Link href={href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
              View all →
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {children}
      </div>
      
      {/* Subtle divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent mt-12" />
    </section>
  );
}
