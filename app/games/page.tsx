'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { IGDBGame } from '@/lib/igdb';
import { GameCard } from '@/components/game-card';
import { GameCardSkeleton } from '@/components/game-card-skeleton';
import { Filters } from '@/components/filters';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Platform {
  id: number;
  name: string;
  abbreviation?: string;
}

interface Genre {
  id: number;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GamesPage() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<IGDBGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch platforms and genres for filters
  const { data: platforms = [] } = useSWR<Platform[]>('/api/igdb/platforms', fetcher);
  const { data: genres = [] } = useSWR<Genre[]>('/api/igdb/genres', fetcher);

  const buildAPIUrl = () => {
    const params = new URLSearchParams();
    
    const type = searchParams.get('type');
    if (type) {
      params.set('type', type);
      return `/api/igdb/games?${params.toString()}`;
    }

    // Build search parameters with new parameter names
    const minRating = searchParams.get('minRating');
    const minReviewCount = searchParams.get('minReviewCount');
    const platformIds = searchParams.get('platformIds');
    const genreIds = searchParams.get('genreIds');
    const developerCompanyId = searchParams.get('developerCompanyId');
    const year = searchParams.get('year');
    const comingSoon = searchParams.get('comingSoon');
    const sort = searchParams.get('sort') || 'hot';

    params.set('type', 'search');
    params.set('limit', '48');
    params.set('offset', ((page - 1) * 48).toString());

    if (minRating) params.set('minRating', minRating);
    if (minReviewCount) params.set('minReviewCount', minReviewCount);
    if (platformIds) params.set('platformIds', platformIds);
    if (genreIds) params.set('genreIds', genreIds);
    if (developerCompanyId) params.set('developerCompanyId', developerCompanyId);
    if (year) params.set('year', year);
    if (comingSoon) params.set('comingSoon', comingSoon);
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
      
      const data: IGDBGame[] = await response.json();
      
      // Data is already sorted by the API
      
      if (isNewSearch) {
        setGames(data);
        setPage(1);
      } else {
        setGames(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 48);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games. Please try again.');
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

  // Load more when page changes (but not on initial load)
  useEffect(() => {
    if (page > 1) {
      fetchGames(false);
    }
  }, [page]);

  const getPageTitle = () => {
    const type = searchParams.get('type');
    const year = searchParams.get('year');
    const comingSoon = searchParams.get('comingSoon');
    const sort = searchParams.get('sort');
    
    if (year === '2025' && comingSoon === '1') {
      return 'Coming Soon in 2025';
    }
    if (year === '2025' && sort === 'rating') {
      return 'Featured Games - Best of 2025';
    }
    if (sort === 'hot') {
      return 'Top Games - Highest Reviewed';
    }
    
    switch (type) {
      case 'featured':
        return 'Featured Games - Best of 2025';
      case 'top':
        return 'Top Games - Highest Rated';
      case 'coming-soon':
        return 'Coming Soon in 2025';
      default:
        return 'Browse Games';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <Filters platforms={platforms} genres={genres} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-zinc-900">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-zinc-600">
              {games.length} games found
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchGames(true)}>Try Again</Button>
            </div>
          ) : (
            <>
              {/* Games Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} showSummary />
                ))}
                
                {/* Loading skeletons */}
                {loading && [...Array(8)].map((_, i) => (
                  <GameCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>

              {/* Load More Button */}
              {!loading && hasMore && games.length > 0 && (
                <div className="text-center py-8">
                  <Button onClick={loadMore} size="lg">
                    Load More Games
                  </Button>
                </div>
              )}

              {/* No more results */}
              {!loading && !hasMore && games.length > 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No more games to load.
                </div>
              )}

              {/* No results */}
              {!loading && games.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                      No games found
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      No games found matching your criteria.
                    </p>
                    <p className="text-sm text-zinc-400">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
