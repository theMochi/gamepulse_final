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
  Loader2
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

// ============================================================================
// GAME CARD COMPONENT
// ============================================================================

function GameCard({ game }: { game: Game }) {
  const rating = (game.total_rating || 0) / 20; // Convert 0-100 to 0-5
  const releaseYear = getReleaseYear(game.first_release_date);

  return (
    <Link href={`/game/${game.id}`} className="group">
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={getCoverUrl(game.cover?.image_id)}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Rating Badge */}
          {game.total_rating && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-neutral-900">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug min-h-[2.5rem]">
            {game.name}
          </h3>

          {/* Release Year */}
          {releaseYear && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
              <Calendar className="h-3 w-3" />
              <span>{releaseYear}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Rating & Reviews */}
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-3 w-3',
                    star <= Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500">
              {formatReviewCount(game.total_rating_count || 0)} reviews
            </span>
          </div>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="aspect-[3/4] w-full animate-pulse bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
            {getPageTitle()}
          </h1>
          <p className="mt-2 text-neutral-500">
            Discover your next favorite game from our curated collection
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium transition-colors',
                activeFilterCount > 0
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-neutral-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-400 hover:text-neutral-600'
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
              <p className="text-sm text-neutral-500">
                {loading ? 'Loading...' : `${games.length} games found`}
              </p>

              {/* Desktop View Toggle */}
              <div className="hidden items-center gap-1 rounded-lg border border-neutral-200 p-1 lg:flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchGames(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Games Grid */}
                <div
                  className={cn(
                    'grid gap-5',
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
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      Load More Games
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Loading indicator for load more */}
                {loading && page > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  </div>
                )}

                {/* No Results */}
                {!loading && games.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                      <Search className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      No games found
                    </h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Try adjusting your filters or search criteria to find more games.
                    </p>
                  </div>
                )}

                {/* End of Results */}
                {!loading && !hasMore && games.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-sm text-neutral-400">
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
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="mb-12">
              <div className="h-10 w-48 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-5 w-72 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
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
