import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  ChevronRight, 
  Calendar, 
  Monitor, 
  Gamepad2,
  Trophy,
  TrendingUp,
  Clock,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// MOCK DATA
// ============================================================================

const featuredGame = {
  id: 1,
  title: 'Elden Ring: Nightreign',
  tagline: 'Rise, Tarnished. Face the eternal night.',
  description: 'A standalone co-op experience set in the Elden Ring universe. Team up with friends to survive intense sessions in an ever-changing realm.',
  rating: 4.9,
  reviewCount: 128400,
  coverImage: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5vmg.jpg',
  releaseYear: 2025,
  developer: 'FromSoftware',
  awards: ['Game of the Year 2025', 'Best Action RPG'],
};

const topGames = [
  {
    id: 2,
    title: 'Grand Theft Auto VI',
    rating: 4.8,
    reviewCount: 245000,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8hl9.jpg',
  },
  {
    id: 3,
    title: 'The Legend of Zelda: Echoes of Wisdom',
    rating: 4.7,
    reviewCount: 89200,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co91zv.jpg',
  },
  {
    id: 4,
    title: 'Black Myth: Wukong',
    rating: 4.6,
    reviewCount: 156800,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
  },
  {
    id: 5,
    title: 'Monster Hunter Wilds',
    rating: 4.5,
    reviewCount: 67300,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7wif.jpg',
  },
  {
    id: 6,
    title: 'Metaphor: ReFantazio',
    rating: 4.8,
    reviewCount: 43500,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8loa.jpg',
  },
  {
    id: 7,
    title: 'Silent Hill 2',
    rating: 4.4,
    reviewCount: 52100,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7l7p.jpg',
  },
  {
    id: 8,
    title: 'Indiana Jones and the Great Circle',
    rating: 4.3,
    reviewCount: 38700,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8f7b.jpg',
  },
  {
    id: 9,
    title: 'Final Fantasy VII Rebirth',
    rating: 4.6,
    reviewCount: 94200,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yp9.jpg',
  },
];

const comingSoonGames = [
  {
    id: 10,
    title: 'Death Stranding 2: On the Beach',
    releaseDate: 'June 26, 2025',
    platforms: ['PS5'],
    developer: 'Kojima Productions',
    hypeScore: 4.9,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8oou.jpg',
  },
  {
    id: 11,
    title: 'Ghost of Yōtei',
    releaseDate: 'Fall 2025',
    platforms: ['PS5'],
    developer: 'Sucker Punch',
    hypeScore: 4.8,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co9dv5.jpg',
  },
  {
    id: 12,
    title: 'Civilization VII',
    releaseDate: 'February 11, 2025',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    developer: 'Firaxis Games',
    hypeScore: 4.6,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co91xj.jpg',
  },
  {
    id: 13,
    title: 'Assassin\'s Creed Shadows',
    releaseDate: 'March 20, 2025',
    platforms: ['PC', 'PS5', 'Xbox'],
    developer: 'Ubisoft Quebec',
    hypeScore: 4.4,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8htu.jpg',
  },
  {
    id: 14,
    title: 'Doom: The Dark Ages',
    releaseDate: 'May 15, 2025',
    platforms: ['PC', 'PS5', 'Xbox'],
    developer: 'id Software',
    hypeScore: 4.7,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co97q4.jpg',
  },
  {
    id: 15,
    title: 'Fable',
    releaseDate: '2025',
    platforms: ['PC', 'Xbox'],
    developer: 'Playground Games',
    hypeScore: 4.5,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jfe.jpg',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatReviewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M reviews`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k reviews`;
  }
  return `${count} reviews`;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={cn(sizeClasses[size], 'text-neutral-300')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn(sizeClasses[size], 'text-neutral-300')} />
      ))}
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = 'h-4 w-4 text-neutral-500';
  
  switch (platform.toLowerCase()) {
    case 'pc':
      return <Monitor className={iconClass} />;
    case 'ps5':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.153 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.393-1.502z"/>
        </svg>
      );
    case 'xbox':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417z"/>
          <path d="M12 4.5c1.035 0 2.023.176 2.947.495C13.553 3.395 12.759 2.4 12 2.4c-.759 0-1.553.995-2.947 2.595.924-.319 1.912-.495 2.947-.495z"/>
        </svg>
      );
    case 'switch':
      return <Gamepad2 className={iconClass} />;
    default:
      return <Gamepad2 className={iconClass} />;
  }
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function SectionHeader({ 
  eyebrow, 
  title, 
  description, 
  href,
  icon: Icon,
}: { 
  eyebrow?: string; 
  title: string; 
  description?: string; 
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-8 lg:mb-10">
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="h-4 w-4 text-accent" />}
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </span>
        </div>
      )}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-neutral-500 max-w-2xl">{description}</p>
          )}
        </div>
        {href && (
          <Link 
            href={href} 
            className="group flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURED HERO SECTION
// ============================================================================

function FeaturedHeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={featuredGame.coverImage}
          alt={featuredGame.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          {/* Awards Badge */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
              <Trophy className="h-3 w-3" />
              {featuredGame.awards[0]}
            </span>
            <span className="text-sm text-neutral-400">
              {featuredGame.releaseYear}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {featuredGame.title}
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-xl font-light italic text-neutral-300">
            "{featuredGame.tagline}"
          </p>

          {/* Description */}
          <p className="mt-6 text-base leading-relaxed text-neutral-400 lg:text-lg">
            {featuredGame.description}
          </p>

          {/* Rating & Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
                <StarRating rating={featuredGame.rating} size="lg" />
                <span className="text-lg font-bold text-white">
                  {featuredGame.rating}
                </span>
              </div>
              <span className="text-sm text-neutral-400">
                {formatReviewCount(featuredGame.reviewCount)}
              </span>
            </div>

            {/* Developer */}
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span className="text-neutral-500">by</span>
              <span className="font-medium text-neutral-300">
                {featuredGame.developer}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/game/${featuredGame.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl"
            >
              View Game
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all hover:border-neutral-500 hover:bg-white/5"
            >
              Browse All Games
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
    </section>
  );
}

// ============================================================================
// TOP GAMES SECTION
// ============================================================================

function TopGamesSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Most Popular"
          title="Top Rated Games"
          description="Games ranked by our weighted score combining ratings and review volume"
          href="/games?sort=top"
          icon={TrendingUp}
        />

        {/* Horizontal Scrollable List */}
        <div className="relative -mx-6 px-6">
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {topGames.map((game, index) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="group relative flex-shrink-0 snap-start"
              >
                <article className="relative w-44 overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50">
                  {/* Rank Badge */}
                  <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur-sm">
                    {index + 1}
                  </div>

                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="176px"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-tight min-h-[2.5rem]">
                      {game.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <StarRating rating={game.rating} size="sm" />
                      <span className="text-xs font-medium text-neutral-600">
                        {game.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {formatReviewCount(game.reviewCount)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMING SOON SECTION
// ============================================================================

function ComingSoonSection() {
  return (
    <section className="bg-neutral-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="2025 Releases"
          title="Coming Soon"
          description="The most anticipated games releasing this year"
          href="/games?comingSoon=1"
          icon={Clock}
        />

        {/* Grid of Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonGames.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
                {/* Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={game.coverImage}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hype Badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="text-neutral-900">{game.hypeScore}</span>
                    <span className="text-neutral-500">/ 5</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-neutral-900 line-clamp-2 leading-tight">
                    {game.title}
                  </h3>

                  {/* Developer */}
                  <p className="mt-1 text-sm text-neutral-500">{game.developer}</p>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Meta Row */}
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                    {/* Release Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="font-medium text-neutral-700">
                        {game.releaseDate}
                      </span>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-2">
                      {game.platforms.slice(0, 3).map((platform) => (
                        <div
                          key={platform}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100"
                          title={platform}
                        >
                          <PlatformIcon platform={platform} />
                        </div>
                      ))}
                      {game.platforms.length > 3 && (
                        <span className="text-xs text-neutral-400">
                          +{game.platforms.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Featured Hero Section */}
      <FeaturedHeroSection />

      {/* Top Games Section */}
      <TopGamesSection />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* Coming Soon Section */}
      <ComingSoonSection />
    </div>
  );
}
