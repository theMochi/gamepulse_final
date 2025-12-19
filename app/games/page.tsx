'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  Grid, 
  LayoutList, 
  Search,
  Star,
  Calendar,
  ChevronDown,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameFilters } from '@/components/games/GameFilters';

// ============================================================================
// TYPES
// ============================================================================

interface Platform {
  id: number;
  name: string;
  abbreviation?: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Game {
  id: number;
  name: string;
  cover?: { image_id: string };
  total_rating?: number;
  total_rating_count?: number;
  first_release_date?: number;
  genres?: { id: number; name: string }[];
  platforms?: { id: number; name: string; abbreviation?: string }[];
  summary?: string;
}

// ============================================================================
// MOCK DATA (for initial display)
// ============================================================================

const MOCK_GAMES = [
  {
    id: 1,
    name: 'Elden Ring: Nightreign',
    cover: { image_id: 'co5vmg' },
    total_rating: 96,
    total_rating_count: 128400,
    first_release_date: 1735689600,
    genres: [{ id: 12, name: 'Action' }, { id: 31, name: 'Adventure' }],
  },
  {
    id: 2,
    name: 'Grand Theft Auto VI',
    cover: { image_id: 'co8hl9' },
    total_rating: 95,
    total_rating_count: 245000,
    first_release_date: 1735689600,
    genres: [{ id: 12, name: 'Action' }, { id: 31, name: 'Adventure' }],
  },
  {
    id: 3,
    name: 'The Legend of Zelda: Echoes of Wisdom',
    cover: { image_id: 'co91zv' },
    total_rating: 93,
    total_rating_count: 89200,
    first_release_date: 1726444800,
    genres: [{ id: 31, name: 'Adventure' }, { id: 12, name: 'Action' }],
  },
  {
    id: 4,
    name: 'Black Myth: Wukong',
    cover: { image_id: 'co670h' },
    total_rating: 91,
    total_rating_count: 156800,
    first_release_date: 1724025600,
    genres: [{ id: 12, name: 'Action' }, { id: 5, name: 'RPG' }],
  },
  {
    id: 5,
    name: 'Monster Hunter Wilds',
    cover: { image_id: 'co7wif' },
    total_rating: 89,
    total_rating_count: 67300,
    first_release_date: 1740787200,
    genres: [{ id: 12, name: 'Action' }, { id: 5, name: 'RPG' }],
  },
  {
    id: 6,
    name: 'Metaphor: ReFantazio',
    cover: { image_id: 'co8loa' },
    total_rating: 94,
    total_rating_count: 43500,
    first_release_date: 1728691200,
    genres: [{ id: 5, name: 'RPG' }, { id: 16, name: 'Turn-based' }],
  },
  {
    id: 7,
    name: 'Silent Hill 2',
    cover: { image_id: 'co7l7p' },
    total_rating: 87,
    total_rating_count: 52100,
    first_release_date: 1728432000,
    genres: [{ id: 31, name: 'Adventure' }, { id: 25, name: 'Horror' }],
  },
  {
    id: 8,
    name: 'Indiana Jones and the Great Circle',
    cover: { image_id: 'co8f7b' },
    total_rating: 85,
    total_rating_count: 38700,
    first_release_date: 1733356800,
    genres: [{ id: 31, name: 'Adventure' }, { id: 12, name: 'Action' }],
  },
  {
    id: 9,
    name: 'Final Fantasy VII Rebirth',
    cover: { image_id: 'co6yp9' },
    total_rating: 92,
    total_rating_count: 94200,
    first_release_date: 1709164800,
    genres: [{ id: 5, name: 'RPG' }, { id: 12, name: 'Action' }],
  },
  {
    id: 10,
    name: 'Death Stranding 2: On the Beach',
    cover: { image_id: 'co8oou' },
    total_rating: 88,
    total_rating_count: 32100,
    first_release_date: 1751328000,
    genres: [{ id: 31, name: 'Adventure' }, { id: 12, name: 'Action' }],
  },
  {
    id: 11,
    name: 'Ghost of Yōtei',
    cover: { image_id: 'co9dv5' },
    total_rating: 90,
    total_rating_count: 28500,
    first_release_date: 1761868800,
    genres: [{ id: 12, name: 'Action' }, { id: 31, name: 'Adventure' }],
  },
  {
    id: 12,
    name: 'Civilization VII',
    cover: { image_id: 'co91xj' },
    total_rating: 86,
    total_rating_count: 45300,
    first_release_date: 1739145600,
    genres: [{ id: 4, name: 'Strategy' }, { id: 16, name: 'Turn-based' }],
  },
];

const MOCK_GENRES: Genre[] = [
  { id: 12, name: 'Action' },
  { id: 31, name: 'Adventure' },
  { id: 5, name: 'RPG' },
  { id: 32, name: 'Indie' },
  { id: 10, name: 'Racing' },
  { id: 14, name: 'Sport' },
  { id: 4, name: 'Strategy' },
  { id: 8, name: 'Platform' },
  { id: 9, name: 'Puzzle' },
  { id: 13, name: 'Simulator' },
  { id: 25, name: 'Horror' },
  { id: 7, name: 'Music' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatReviewCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
  return String(count);
}

function getCoverUrl(imageId?: string): string {
  if (!imageId) return '/placeholder-game-cover.svg';
  return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
}

function getReleaseYear(timestamp?: number): number | undefined {
  if (!timestamp) return undefined;
  return new Date(timestamp * 1000).getFullYear();
}

function getScoreColor(score: number) {
  if (score >= 90) return 'from-emerald-400 to-cyan-400 text-emerald-400 border-emerald-400/30';
  if (score >= 70) return 'from-yellow-400 to-orange-400 text-yellow-400 border-yellow-400/30';
  if (score >= 50) return 'from-orange-400 to-red-400 text-orange-400 border-orange-400/30';
  return 'from-red-400 to-red-600 text-red-400 border-red-400/30';
}

// ============================================================================
// GAME CARD COMPONENT
// ============================================================================

function GameCard({ game }: { game: Game }) {
  const rating = game.total_rating || 0;
  const releaseYear = getReleaseYear(game.first_release_date);

  return (
    <Link href={`/game/${game.id}`} className="group">
      <article className="game-card h-full flex flex-col overflow-hidden">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={getCoverUrl(game.cover?.image_id)}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Rating Badge */}
          {game.total_rating && (
            <div className={cn(
              "absolute right-2 top-2 flex items-center justify-center h-9 w-9 rounded-lg font-display font-bold text-sm",
              "bg-background/90 border backdrop-blur-sm",
              getScoreColor(rating)
            )}>
              {Math.round(rating / 10)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors">
            {game.name}
          </h3>

          {/* Release Year */}
          {releaseYear && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 text-primary" />
              <span>{releaseYear}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Rating & Reviews */}
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-3 w-3',
                    star <= Math.floor(rating / 20)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatReviewCount(game.total_rating_count || 0)} reviews
            </span>
          </div>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function GameCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[3/4] w-full shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="h-3 w-full shimmer rounded" />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE CONTENT
// ============================================================================

function GamesPageContent() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch platforms and genres for filters
  const { data: platforms = [] } = useSWR<Platform[]>('/api/igdb/platforms', fetcher);
  const { data: genres = MOCK_GENRES } = useSWR<Genre[]>('/api/igdb/genres', fetcher);

  const buildAPIUrl = () => {
    const params = new URLSearchParams();
    
    const type = searchParams.get('type');
    if (type) {
      params.set('type', type);
      return `/api/igdb/games?${params.toString()}`;
    }

    const minRating = searchParams.get('minRating');
    const platformIds = searchParams.get('platformIds');
    const genreIds = searchParams.get('genreIds');
    const developer = searchParams.get('developer');
    const yearStart = searchParams.get('yearStart');
    const yearEnd = searchParams.get('yearEnd');
    const sort = searchParams.get('sort') || 'hot';

    params.set('type', 'search');
    params.set('limit', '24');
    params.set('offset', ((page - 1) * 24).toString());

    if (minRating) params.set('minRating', minRating);
    if (platformIds) params.set('platformIds', platformIds);
    if (genreIds) params.set('genreIds', genreIds);
    if (developer) params.set('developer', developer);
    if (yearStart) params.set('yearStart', yearStart);
    if (yearEnd) params.set('yearEnd', yearEnd);
    params.set('sort', sort);

    return `/api/igdb/games?${params.toString()}`;
  };

  const fetchGames = async (isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      const url = buildAPIUrl();
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Game[] = await response.json();
      
      if (isNewSearch) {
        setGames(data.length > 0 ? data : MOCK_GAMES);
        setPage(1);
      } else {
        setGames(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 24);
    } catch (err) {
      console.error('Error fetching games:', err);
      // Fall back to mock data on error
      if (page === 1) {
        setGames(MOCK_GAMES);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch games when search params change
  useEffect(() => {
    setPage(1);
    fetchGames(true);
  }, [searchParams.toString()]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchGames(false);
    }
  }, [page]);

  const getPageTitle = () => {
    const sort = searchParams.get('sort');
    const minRating = searchParams.get('minRating');
    const genreIds = searchParams.get('genreIds');
    
    if (sort === 'rating' || (minRating && parseInt(minRating) >= 80)) {
      return 'Top Rated Games';
    }
    if (sort === 'newest') {
      return 'Latest Releases';
    }
    if (genreIds) {
      return 'Browse by Genre';
    }
    return 'Explore Games';
  };

  const activeFilterCount = [
    searchParams.get('minRating'),
    searchParams.get('platformIds'),
    searchParams.get('genreIds'),
    searchParams.get('developer'),
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-xs font-display font-bold uppercase tracking-widest text-primary">
              Browse
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight text-foreground uppercase">
            {getPageTitle()}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover your next favorite game from our curated collection
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                activeFilterCount > 0
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-card">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          <GameFilters
            platforms={platforms}
            genres={genres}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            isMobile={true}
          />

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <GameFilters
              platforms={platforms}
              genres={genres}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${games.length} games found`}
              </p>

              {/* Desktop View Toggle */}
              <div className="hidden items-center gap-1 rounded-lg border border-border p-1 bg-card lg:flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button
                  onClick={() => fetchGames(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Games Grid */}
                <div
                  className={cn(
                    'grid gap-4',
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}
                >
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}

                  {/* Loading Skeletons */}
                  {loading &&
                    [...Array(8)].map((_, i) => (
                      <GameCardSkeleton key={`skeleton-${i}`} />
                    ))}
                </div>

                {/* Load More */}
                {!loading && hasMore && games.length > 0 && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={loadMore}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-display font-semibold uppercase tracking-wide text-sm",
                        "text-foreground transition-all",
                        "hover:border-primary/50 hover:bg-primary/10"
                      )}
                    >
                      Load More Games
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Loading indicator for load more */}
                {loading && page > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {/* No Results */}
                {!loading && games.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-2 uppercase">
                      No games found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your filters or search criteria to find more games.
                    </p>
                  </div>
                )}

                {/* End of Results */}
                {!loading && !hasMore && games.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      You've reached the end of the list
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PAGE EXPORT
// ============================================================================

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
              <div className="h-10 w-48 shimmer rounded" />
              <div className="mt-2 h-5 w-72 shimmer rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(12)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <GamesPageContent />
    </Suspense>
  );
}
