'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Platform {
  id: number;
  name: string;
  abbreviation?: string;
}

interface Genre {
  id: number;
  name: string;
}

interface FiltersProps {
  platforms: Platform[];
  genres: Genre[];
  className?: string;
  isSticky?: boolean;
}

export function Filters({ platforms, genres, className, isSticky = true }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minRating, setMinRating] = useState(() => {
    const rating = searchParams.get('minRating');
    return rating ? parseInt(rating) : 0;
  });
  const [minReviewCount, setMinReviewCount] = useState(() => {
    const count = searchParams.get('minReviewCount');
    return count ? parseInt(count) : 0;
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(() => {
    const platformIds = searchParams.get('platformIds');
    return platformIds ? platformIds.split(',').map(Number).filter(Boolean) : [];
  });
  const [selectedGenres, setSelectedGenres] = useState<number[]>(() => {
    const genreIds = searchParams.get('genreIds');
    return genreIds ? genreIds.split(',').map(Number).filter(Boolean) : [];
  });
  const [developerCompanyId, setDeveloperCompanyId] = useState(() => {
    const id = searchParams.get('developerCompanyId');
    return id ? parseInt(id) : undefined;
  });
  const [sort, setSort] = useState(searchParams.get('sort') || 'hot');

  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (minRating > 0) params.set('minRating', minRating.toString());
    if (minReviewCount > 0) params.set('minReviewCount', minReviewCount.toString());
    if (selectedPlatforms.length > 0) params.set('platformIds', selectedPlatforms.join(','));
    if (selectedGenres.length > 0) params.set('genreIds', selectedGenres.join(','));
    if (developerCompanyId) params.set('developerCompanyId', developerCompanyId.toString());
    if (sort !== 'hot') params.set('sort', sort);

    const newURL = params.toString() ? `?${params.toString()}` : '/games';
    router.push(newURL);
  };

  useEffect(() => {
    const timeoutId = setTimeout(updateURL, 300);
    return () => clearTimeout(timeoutId);
  }, [minRating, minReviewCount, selectedPlatforms, selectedGenres, developerCompanyId, sort]);

  const handleReset = () => {
    setMinRating(0);
    setMinReviewCount(0);
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setDeveloperCompanyId(undefined);
    setSort('hot');
    router.push('/games');
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const hasActiveFilters = minRating > 0 || minReviewCount > 0 || selectedPlatforms.length > 0 || selectedGenres.length > 0 || developerCompanyId || sort !== 'hot';

  return (
    <Card className={cn(
      'w-full lg:w-80',
      isSticky && 'lg:sticky lg:top-6 lg:h-fit',
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sort by</label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Hot (Highest Reviewed)</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="count">Rating Count</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="release_asc">Release Date (Ascending)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Rating Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Minimum Rating: {minRating}/100
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Min Review Count Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Minimum Reviews: {minReviewCount.toLocaleString()}
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minReviewCount}
              onChange={(e) => setMinReviewCount(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>5K</span>
              <span>10K+</span>
            </div>
          </div>
        </div>

        {/* Platforms Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Platforms</label>
          <div className="relative">
            <button
              onClick={() => setPlatformsOpen(!platformsOpen)}
              className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-zinc-600">
                {selectedPlatforms.length > 0 
                  ? `${selectedPlatforms.length} selected`
                  : 'Select platforms...'
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            
            {platformsOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg">
                <div className="p-2 space-y-1">
                  {platforms.slice(0, 30).map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        {platform.abbreviation || platform.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Selected Platforms */}
          {selectedPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                if (!platform) return null;
                return (
                  <Badge
                    key={platformId}
                    variant="default"
                    className="text-xs cursor-pointer"
                    onClick={() => togglePlatform(platformId)}
                  >
                    {platform.abbreviation || platform.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Genres Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Genres</label>
          <div className="relative">
            <button
              onClick={() => setGenresOpen(!genresOpen)}
              className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-zinc-600">
                {selectedGenres.length > 0 
                  ? `${selectedGenres.length} selected`
                  : 'Select genres...'
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            
            {genresOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg">
                <div className="p-2 space-y-1">
                  {genres.map((genre) => (
                    <label
                      key={genre.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.id)}
                        onChange={() => toggleGenre(genre.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Selected Genres */}
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedGenres.map((genreId) => {
                const genre = genres.find(g => g.id === genreId);
                if (!genre) return null;
                return (
                  <Badge
                    key={genreId}
                    variant="outline"
                    className="text-xs cursor-pointer"
                    onClick={() => toggleGenre(genreId)}
                  >
                    {genre.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
