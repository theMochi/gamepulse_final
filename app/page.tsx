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
  Flame,
  Play,
  Heart,
  MessageCircle,
  Zap,
  Users,
  Sparkles,
  CheckCircle2
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
  genres: ['Action RPG', 'Souls-like', 'Co-op'],
};

// Featured Critics/Influencers
const featuredCritics = [
  {
    id: 1,
    name: 'SkillUp',
    username: 'skillup',
    avatar: 'https://yt3.googleusercontent.com/TLLh6-x3Vw_8D-T6y8Jq-x4IiSLX8hU4r2qFPqR7TlXyMvt_F8nLh5h-S5nCzZ9G4YGN5qE=s176-c-k-c0x00ffffff-no-rj',
    isVerified: true,
    followers: '2.4M',
    recentReview: {
      gameId: 2,
      gameName: 'Black Myth: Wukong',
      gameCover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
      rating: 9.5,
      snippet: "A visual masterpiece that delivers on its promise. The combat is brutal, the world is breathtaking, and the boss fights are some of the best I've experienced in years.",
      timeAgo: '2 hours ago',
      likes: 12400,
      comments: 892,
    }
  },
  {
    id: 2,
    name: 'Alanah Pearce',
    username: 'charalanahzard',
    avatar: 'https://yt3.googleusercontent.com/dC8ZQrBJkm1IIXMp_7E8h3h9rF9F0UlUh9x9-SXGY8h3HhTGCx4HlX3Qd9QfY_nZ8QT2rg=s176-c-k-c0x00ffffff-no-rj',
    isVerified: true,
    followers: '1.1M',
    recentReview: {
      gameId: 3,
      gameName: 'The Legend of Zelda: Echoes of Wisdom',
      gameCover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co91zv.jpg',
      rating: 9.0,
      snippet: "Finally, Zelda gets to be the hero she always deserved to be. The echo system is pure magic and completely changes how you approach every puzzle.",
      timeAgo: '5 hours ago',
      likes: 8200,
      comments: 445,
    }
  },
  {
    id: 3,
    name: 'videogamedunkey',
    username: 'dunkey',
    avatar: 'https://yt3.googleusercontent.com/a/ACg8ocI-rkZFXrchN_6xE4D5QTXr1hW7BuU6Q7IJz8zVjGKYZQ=s176-c-k-c0x00ffffff-no-rj',
    isVerified: true,
    followers: '7.8M',
    recentReview: {
      gameId: 4,
      gameName: 'Silent Hill 2',
      gameCover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7l7p.jpg',
      rating: 8.5,
      snippet: "Bloober Team finally did it. This is the remake fans have been waiting for. Atmospheric, terrifying, and faithful to the original.",
      timeAgo: '1 day ago',
      likes: 45600,
      comments: 2341,
    }
  },
];

// Latest community reviews
const latestReviews = [
  {
    id: 1,
    user: { name: 'GamerXtreme', username: 'gamerxtreme', avatar: null },
    game: { name: 'Grand Theft Auto VI', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8hl9.jpg', id: 5 },
    rating: 10,
    title: 'The greatest open world ever created',
    body: 'Rockstar has outdone themselves. Vice City has never looked better and the attention to detail is absolutely insane.',
    timeAgo: '15 minutes ago',
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    user: { name: 'NightOwlPlays', username: 'nightowl', avatar: null },
    game: { name: 'Metaphor: ReFantazio', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8loa.jpg', id: 6 },
    rating: 9.5,
    title: 'Atlus does it again',
    body: 'If you loved Persona 5, this is the evolution you\'ve been waiting for. The fantasy setting works perfectly with the social mechanics.',
    timeAgo: '32 minutes ago',
    likes: 189,
    comments: 28,
  },
  {
    id: 3,
    user: { name: 'RetroGamer88', username: 'retro88', avatar: null },
    game: { name: 'Final Fantasy VII Rebirth', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6yp9.jpg', id: 7 },
    rating: 9.0,
    title: 'The definitive JRPG experience',
    body: 'The open world exploration combined with the story beats from the original creates something truly special.',
    timeAgo: '1 hour ago',
    likes: 156,
    comments: 34,
  },
  {
    id: 4,
    user: { name: 'SoulsVeteran', username: 'soulsveteran', avatar: null },
    game: { name: 'Elden Ring: Nightreign', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg', id: 1 },
    rating: 9.5,
    title: 'Co-op done right',
    body: 'FromSoftware proves they can do roguelike co-op. The sessions are intense and the randomization keeps things fresh.',
    timeAgo: '2 hours ago',
    likes: 312,
    comments: 67,
  },
];

const trendingGames = [
  {
    id: 1,
    title: 'Elden Ring: Nightreign',
    rating: 4.9,
    reviewCount: 128400,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg',
    trending: '+15%',
  },
  {
    id: 2,
    title: 'Grand Theft Auto VI',
    rating: 4.8,
    reviewCount: 245000,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8hl9.jpg',
    trending: '+42%',
  },
  {
    id: 3,
    title: 'Black Myth: Wukong',
    rating: 4.6,
    reviewCount: 156800,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg',
    trending: '+8%',
  },
  {
    id: 4,
    title: 'Monster Hunter Wilds',
    rating: 4.5,
    reviewCount: 67300,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7wif.jpg',
    trending: '+23%',
  },
  {
    id: 5,
    title: 'Metaphor: ReFantazio',
    rating: 4.8,
    reviewCount: 43500,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8loa.jpg',
    trending: '+31%',
  },
  {
    id: 6,
    title: 'Silent Hill 2',
    rating: 4.4,
    reviewCount: 52100,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7l7p.jpg',
    trending: '+12%',
  },
];

const comingSoonGames = [
  {
    id: 10,
    title: 'Death Stranding 2',
    releaseDate: 'June 26, 2025',
    platforms: ['PS5'],
    hypeScore: 4.9,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8oou.jpg',
  },
  {
    id: 11,
    title: 'Ghost of Yōtei',
    releaseDate: 'Fall 2025',
    platforms: ['PS5'],
    hypeScore: 4.8,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co9dv5.jpg',
  },
  {
    id: 12,
    title: 'Doom: The Dark Ages',
    releaseDate: 'May 15, 2025',
    platforms: ['PC', 'PS5', 'Xbox'],
    hypeScore: 4.7,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co97q4.jpg',
  },
  {
    id: 13,
    title: 'Civilization VII',
    releaseDate: 'February 11, 2025',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    hypeScore: 4.6,
    coverImage: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co91xj.jpg',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatReviewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return `${count}`;
}

function formatLikes(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${count}`;
}

function ScoreDisplay({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'from-emerald-400 to-cyan-400 text-emerald-400';
    if (score >= 7) return 'from-yellow-400 to-orange-400 text-yellow-400';
    if (score >= 5) return 'from-orange-400 to-red-400 text-orange-400';
    return 'from-red-400 to-red-600 text-red-400';
  };

  return (
    <div className={cn(
      sizeClasses[size],
      'relative flex items-center justify-center rounded-lg font-display font-bold',
      'bg-gradient-to-br',
      getScoreColor(score),
      'bg-background border border-current/30'
    )}>
      <span className="relative z-10 text-current">{score}</span>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = 'h-4 w-4';
  
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
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0">
        <Image
          src={featuredGame.coverImage}
          alt={featuredGame.title}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines opacity-50" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left - Text Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge-hot flex items-center gap-1.5">
                <Flame className="h-3 w-3" />
                Featured
              </span>
              <span className="badge-neon flex items-center gap-1.5">
                <Trophy className="h-3 w-3" />
                Game of the Year
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground uppercase">
              {featuredGame.title}
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-xl font-light italic text-primary text-glow-cyan">
              "{featuredGame.tagline}"
            </p>

            {/* Description */}
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {featuredGame.description}
            </p>

            {/* Genres */}
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredGame.genres.map((genre) => (
                <span key={genre} className="chip">{genre}</span>
              ))}
            </div>

            {/* Stats Row */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <ScoreDisplay score={featuredGame.rating} size="lg" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {featuredGame.rating} / 5
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatReviewCount(featuredGame.reviewCount)} reviews
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {featuredGame.developer}
                </div>
                <div className="text-xs text-muted-foreground">
                  {featuredGame.releaseYear}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`/game/${featuredGame.id}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display font-semibold uppercase tracking-wide text-sm",
                  "bg-primary text-primary-foreground",
                  "transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-105",
                  "glow-cyan"
                )}
              >
                <Play className="h-4 w-4" />
                View Game
              </Link>
              <Link
                href="/games"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display font-semibold uppercase tracking-wide text-sm",
                  "border border-border bg-background/50 text-foreground",
                  "transition-all hover:border-primary/50 hover:bg-primary/10"
                )}
              >
                Browse Games
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right - Game Cover */}
          <div className="hidden lg:block animate-fade-in-up delay-200">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-border/50 game-card">
                <Image
                  src={featuredGame.coverImage}
                  alt={featuredGame.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}

// ============================================================================
// CRITIC SPOTLIGHT SECTION
// ============================================================================

function CriticSpotlightSection() {
  return (
    <section className="py-16 lg:py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-xs font-display font-bold uppercase tracking-widest text-accent">
                Critic Spotlight
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground uppercase tracking-wide">
              What the Pros Are Saying
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fresh reviews from top gaming voices and content creators
            </p>
          </div>
          <Link 
            href="/critics" 
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all critics
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Critics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCritics.map((critic, index) => (
            <article 
              key={critic.id}
              className={cn(
                "game-card p-6 animate-fade-in-up",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300"
              )}
            >
              {/* Critic Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/50 bg-muted">
                      <Image 
                        src={critic.avatar} 
                        alt={critic.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    {critic.isVerified && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-primary bg-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-foreground">{critic.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">@{critic.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{critic.followers} followers</div>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex gap-4">
                {/* Game Cover */}
                <Link href={`/game/${critic.recentReview.gameId}`} className="flex-shrink-0">
                  <div className="relative w-16 h-24 rounded-lg overflow-hidden border border-border/50 group">
                    <Image
                      src={critic.recentReview.gameCover}
                      alt={critic.recentReview.gameName}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                </Link>

                {/* Review Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      href={`/game/${critic.recentReview.gameId}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {critic.recentReview.gameName}
                    </Link>
                    <ScoreDisplay score={critic.recentReview.rating} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    "{critic.recentReview.snippet}"
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-accent" />
                      {formatLikes(critic.recentReview.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {critic.recentReview.comments}
                    </span>
                    <span>{critic.recentReview.timeAgo}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LATEST REVIEWS SECTION
// ============================================================================

function LatestReviewsSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-neon-yellow" />
              <span className="text-xs font-display font-bold uppercase tracking-widest text-neon-yellow">
                Live Feed
              </span>
              <span className="flex items-center gap-1 text-xs text-accent">
                <span className="h-2 w-2 rounded-full bg-accent pulse-live" />
                Live
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground uppercase tracking-wide">
              Latest Reviews
            </h2>
            <p className="mt-2 text-muted-foreground">
              Real-time reviews from the GamePulse community
            </p>
          </div>
          <Link 
            href="/reviews" 
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all reviews
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {latestReviews.map((review, index) => (
            <article 
              key={review.id}
              className={cn(
                "game-card p-5 animate-fade-in-up",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300",
                index === 3 && "delay-400"
              )}
            >
              <div className="flex gap-4">
                {/* Game Cover */}
                <Link href={`/game/${review.game.id}`} className="flex-shrink-0">
                  <div className="relative w-16 h-24 rounded-lg overflow-hidden border border-border/50 group">
                    <Image
                      src={review.game.cover}
                      alt={review.game.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {review.user.name}
                        </span>
                        <span className="text-muted-foreground text-sm">reviewed</span>
                        <Link 
                          href={`/game/${review.game.id}`}
                          className="font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          {review.game.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <ScoreDisplay score={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {review.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  {review.title && (
                    <h3 className="font-semibold text-foreground mb-1">{review.title}</h3>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {review.body}
                  </p>

                  {/* Social Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{review.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-8 text-center">
          <Link
            href="/reviews"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-6 py-3 font-display font-semibold uppercase tracking-wide text-sm",
              "border border-border bg-card text-foreground",
              "transition-all hover:border-primary/50 hover:bg-primary/10"
            )}
          >
            Load More Reviews
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TRENDING GAMES SECTION
// ============================================================================

function TrendingGamesSection() {
  return (
    <section className="py-16 lg:py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-neon-green" />
              <span className="text-xs font-display font-bold uppercase tracking-widest text-neon-green">
                Trending Now
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground uppercase tracking-wide">
              Hot on GamePulse
            </h2>
            <p className="mt-2 text-muted-foreground">
              Most discussed games this week
            </p>
          </div>
          <Link 
            href="/games?sort=trending" 
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal Scroll */}
        <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {trendingGames.map((game, index) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="group flex-shrink-0 snap-start"
              >
                <article className="relative w-40 sm:w-44 game-card overflow-hidden">
                  {/* Rank Badge */}
                  <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 border border-primary/30 text-xs font-display font-bold text-primary backdrop-blur-sm">
                    {index + 1}
                  </div>

                  {/* Trending Badge */}
                  <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-neon-green/20 px-2 py-0.5 text-[10px] font-bold text-neon-green">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {game.trending}
                  </div>

                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="176px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          {game.rating}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatReviewCount(game.reviewCount)} reviews
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
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
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-neon-orange" />
              <span className="text-xs font-display font-bold uppercase tracking-widest text-neon-orange">
                Coming Soon
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground uppercase tracking-wide">
              Most Anticipated
            </h2>
            <p className="mt-2 text-muted-foreground">
              Games the community can't wait to play
            </p>
          </div>
          <Link 
            href="/games?upcoming=true" 
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comingSoonGames.map((game, index) => (
            <Link key={game.id} href={`/game/${game.id}`} className="group">
              <article className={cn(
                "game-card overflow-hidden animate-fade-in-up",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300",
                index === 3 && "delay-400"
              )}>
                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={game.coverImage}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  
                  {/* Hype Score */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 border border-accent/30 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
                    <Flame className="h-3 w-3 text-accent" />
                    <span className="text-accent">{game.hypeScore}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>

                  {/* Meta Row */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    {/* Release Date */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-neon-orange" />
                      <span>{game.releaseDate}</span>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {game.platforms.slice(0, 3).map((platform) => (
                        <PlatformIcon key={platform} platform={platform} />
                      ))}
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
// COMMUNITY STATS SECTION
// ============================================================================

function CommunityStatsSection() {
  const stats = [
    { label: 'Active Gamers', value: '2.4M', icon: Users },
    { label: 'Games Tracked', value: '847K', icon: Gamepad2 },
    { label: 'Reviews Written', value: '12.3M', icon: MessageCircle },
    { label: 'Hours Logged', value: '1.2B', icon: Clock },
  ];

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground uppercase tracking-wide">
            Join the Community
          </h2>
          <p className="mt-2 text-muted-foreground">
            Track your games, share your opinions, connect with fellow gamers
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={cn(
                "text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm",
                "animate-fade-in-up",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300",
                index === 3 && "delay-400"
              )}
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl lg:text-4xl font-display font-bold text-foreground text-glow-cyan">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/auth/signup"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-8 py-4 font-display font-semibold uppercase tracking-wide",
              "bg-gradient-to-r from-primary to-accent text-primary-foreground",
              "transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
            )}
          >
            Get Started Free
            <ChevronRight className="h-5 w-5" />
          </Link>
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
    <div className="min-h-screen">
      {/* Featured Hero Section */}
      <HeroSection />

      {/* Critic Spotlight - What influencers are saying */}
      <CriticSpotlightSection />

      {/* Latest Community Reviews */}
      <LatestReviewsSection />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Trending Games */}
      <TrendingGamesSection />

      {/* Coming Soon */}
      <ComingSoonSection />

      {/* Community Stats */}
      <CommunityStatsSection />
    </div>
  );
}
