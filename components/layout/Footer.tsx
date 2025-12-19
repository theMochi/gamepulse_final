import Link from 'next/link';
import { Gamepad2, Twitter, Github, Instagram } from 'lucide-react';

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
      { href: '/community', label: 'Activity Feed' },
      { href: '/lists', label: 'Lists' },
      { href: '/reviews', label: 'Reviews' },
      { href: '/members', label: 'Members' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
      { href: '/contact', label: 'Contact' },
    ],
  },
};

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold tracking-tight text-neutral-900">
                Gamepulse
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              Your personal gaming journal. Track what you play, discover new games, and connect with fellow gamers.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 py-6 text-sm text-neutral-400 md:flex-row">
          <p>© {currentYear} Gamepulse. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-neutral-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-neutral-600">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-neutral-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

