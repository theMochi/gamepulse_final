import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

const footerLinks = {
  discover: {
    title: 'Discover',
    links: [
      { href: '/games', label: 'Browse Games' },
      { href: '/games?sort=trending', label: 'Trending' },
      { href: '/games?sort=new', label: 'New Releases' },
      { href: '/games?sort=top', label: 'Top Rated' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { href: '/lists', label: 'Lists' },
      { href: '/lists/favorites', label: 'Favorites' },
      { href: '/lists/wishlist', label: 'Wishlists' },
      { href: '/lists/reviewed', label: 'Reviews' },
    ],
  },
  account: {
    title: 'Account',
    links: [
      { href: '/profile/me', label: 'Profile' },
      { href: '/settings', label: 'Settings' },
      { href: '/auth/signin', label: 'Sign In' },
      { href: '/auth/signup', label: 'Sign Up' },
    ],
  },
};

const socialLinks = [
  { 
    href: 'https://twitter.com', 
    label: 'Twitter',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    href: 'https://discord.com', 
    label: 'Discord',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    )
  },
  { 
    href: 'https://twitch.tv', 
    label: 'Twitch',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    )
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/50 bg-background">
      {/* Grid pattern overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:py-16">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="relative">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-lg font-display font-bold tracking-wider text-foreground uppercase">
                  Game<span className="text-primary">Pulse</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your social gaming journal. Track your plays, share reviews, and discover what the community is playing.
              </p>
              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-all hover:bg-primary/20 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-primary mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-6 text-sm text-muted-foreground md:flex-row">
            <p className="flex items-center gap-1">
              © {currentYear} GamePulse. Made with 
              <span className="text-accent">♥</span> 
              for gamers.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
