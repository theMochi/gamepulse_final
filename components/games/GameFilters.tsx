'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  X, 
  Star, 
  Calendar, 
  Monitor, 
  Gamepad2, 
  Search,
  RotateCcw,
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface FilterState {
  minStars: number;
  yearRange: { start: number; end: number };
  platforms: string[];
  genres: number[];
  developer: string;
  sort: string;
}

interface GameFiltersProps {
  platforms: Platform[];
  genres: Genre[];
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

const PLATFORM_OPTIONS = [
  { id: 'playstation', name: 'PlayStation', icon: '🎮' },
  { id: 'xbox', name: 'Xbox', icon: '🎯' },
  { id: 'pc', name: 'PC', icon: '💻' },
  { id: 'nintendo', name: 'Nintendo', icon: '🕹️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
];

const SORT_OPTIONS = [
  { value: 'hot', label: 'Trending' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'count', label: 'Most Reviews' },
  { value: 'newest', label: 'Newest First' },
  { value: 'release_asc', label: 'Release Date' },
];

const PLATFORM_MAPPING: Record<string, number[]> = {
  'playstation': [48, 167, 169],
  'xbox': [49, 165, 169],
  'nintendo': [130, 131],
  'pc': [6, 14, 3],
  'mobile': [34, 39],
};

// ============================================================================
// FILTER SECTION COMPONENT
// ============================================================================

function FilterSection({ 
  title, 
  icon: Icon, 
  children,
  defaultOpen = true,
}: { 
  title: string; 
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 pb-5 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-neutral-400" />}
          <span className="text-sm font-medium text-neutral-900">{title}</span>
        </div>
        <ChevronDown 
          className={cn(
            'h-4 w-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ============================================================================
// STAR RATING SELECTOR
// ============================================================================

function StarRatingSelector({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(value === star ? 0 : star)}
            className="group p-0.5"
          >
            <Star 
              className={cn(
                'h-6 w-6 transition-colors',
                star <= value 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-neutral-300 group-hover:text-amber-300'
              )} 
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-neutral-500">{value}+ stars</span>
        )}
      </div>
      {value > 0 && (
        <button
          onClick={() => onChange(0)}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          Clear rating filter
        </button>
      )}
    </div>
  );
}

// ============================================================================
// YEAR RANGE SELECTOR
// ============================================================================

function YearRangeSelector({ 
  value, 
  onChange 
}: { 
  value: { start: number; end: number }; 
  onChange: (value: { start: number; end: number }) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1 block">From</label>
          <select
            value={value.start}
            onChange={(e) => onChange({ ...value, start: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <span className="text-neutral-300 pt-5">—</span>
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1 block">To</label>
          <select
            value={value.end}
            onChange={(e) => onChange({ ...value, end: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {YEAR_OPTIONS.filter(y => y >= value.start).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PLATFORM CHECKBOXES
// ============================================================================

function PlatformCheckboxes({ 
  selected, 
  onChange 
}: { 
  selected: string[]; 
  onChange: (platforms: string[]) => void;
}) {
  const togglePlatform = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(id => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-2">
      {PLATFORM_OPTIONS.map((platform) => (
        <label
          key={platform.id}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all',
            selected.includes(platform.id)
              ? 'border-accent bg-accent/5 text-neutral-900'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
          )}
        >
          <div
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border transition-colors',
              selected.includes(platform.id)
                ? 'border-accent bg-accent text-white'
                : 'border-neutral-300 bg-white'
            )}
          >
            {selected.includes(platform.id) && (
              <Check className="h-3 w-3" />
            )}
          </div>
          <span className="text-sm">{platform.icon}</span>
          <span className="text-sm font-medium">{platform.name}</span>
        </label>
      ))}
    </div>
  );
}

// ============================================================================
// GENRE PILLS
// ============================================================================

function GenrePills({ 
  genres,
  selected, 
  onChange 
}: { 
  genres: Genre[];
  selected: number[]; 
  onChange: (genres: number[]) => void;
}) {
  const toggleGenre = (genreId: number) => {
    if (selected.includes(genreId)) {
      onChange(selected.filter(id => id !== genreId));
    } else {
      onChange([...selected, genreId]);
    }
  };

  // Show popular genres first, then others
  const popularGenreIds = [12, 31, 32, 5, 10, 14, 7, 8, 9, 13]; // Action, Adventure, Indie, Shooter, Racing, Sport, Music, Platform, Puzzle, Simulator
  const sortedGenres = [...genres].sort((a, b) => {
    const aPopular = popularGenreIds.indexOf(a.id);
    const bPopular = popularGenreIds.indexOf(b.id);
    if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
    if (aPopular !== -1) return -1;
    if (bPopular !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sortedGenres.slice(0, 12).map((genre) => (
        <button
          key={genre.id}
          onClick={() => toggleGenre(genre.id)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
            selected.includes(genre.id)
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          )}
        >
          {genre.name}
        </button>
      ))}
      {sortedGenres.length > 12 && (
        <span className="px-2 py-1.5 text-xs text-neutral-400">
          +{sortedGenres.length - 12} more
        </span>
      )}
    </div>
  );
}

// ============================================================================
// DEVELOPER SEARCH
// ============================================================================

function DeveloperSearch({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search developer..."
        className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN FILTER COMPONENT
// ============================================================================

export function GameFilters({ 
  platforms, 
  genres, 
  isOpen = true, 
  onClose,
  isMobile = false,
}: GameFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [filters, setFilters] = useState<FilterState>(() => ({
    minStars: parseInt(searchParams.get('minRating') || '0') / 20, // Convert 0-100 to 0-5
    yearRange: {
      start: parseInt(searchParams.get('yearStart') || String(CURRENT_YEAR - 10)),
      end: parseInt(searchParams.get('yearEnd') || String(CURRENT_YEAR)),
    },
    platforms: searchParams.get('platformIds') 
      ? Object.entries(PLATFORM_MAPPING)
          .filter(([_, ids]) => 
            ids.some(id => searchParams.get('platformIds')?.split(',').includes(String(id)))
          )
          .map(([key]) => key)
      : [],
    genres: searchParams.get('genreIds')?.split(',').map(Number).filter(Boolean) || [],
    developer: searchParams.get('developer') || '',
    sort: searchParams.get('sort') || 'hot',
  }));

  // Debounced URL update
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.minStars > 0) {
      params.set('minRating', String(filters.minStars * 20)); // Convert 0-5 to 0-100
    }
    
    if (filters.yearRange.start !== CURRENT_YEAR - 10 || filters.yearRange.end !== CURRENT_YEAR) {
      params.set('yearStart', String(filters.yearRange.start));
      params.set('yearEnd', String(filters.yearRange.end));
    }

    if (filters.platforms.length > 0) {
      const platformIds = filters.platforms.flatMap(p => PLATFORM_MAPPING[p] || []);
      params.set('platformIds', platformIds.join(','));
    }

    if (filters.genres.length > 0) {
      params.set('genreIds', filters.genres.join(','));
    }

    if (filters.developer) {
      params.set('developer', filters.developer);
    }

    if (filters.sort !== 'hot') {
      params.set('sort', filters.sort);
    }

    const newURL = params.toString() ? `/games?${params.toString()}` : '/games';
    router.push(newURL, { scroll: false });
  }, [filters, router]);

  useEffect(() => {
    const timeoutId = setTimeout(updateURL, 400);
    return () => clearTimeout(timeoutId);
  }, [updateURL]);

  const handleReset = () => {
    setFilters({
      minStars: 0,
      yearRange: { start: CURRENT_YEAR - 10, end: CURRENT_YEAR },
      platforms: [],
      genres: [],
      developer: '',
      sort: 'hot',
    });
    router.push('/games');
  };

  const hasActiveFilters = 
    filters.minStars > 0 || 
    filters.platforms.length > 0 || 
    filters.genres.length > 0 || 
    filters.developer !== '' ||
    filters.sort !== 'hot';

  const activeFilterCount = [
    filters.minStars > 0,
    filters.platforms.length > 0,
    filters.genres.length > 0,
    filters.developer !== '',
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-5">
      {/* Sort Dropdown */}
      <div className="pb-5 border-b border-neutral-100">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 block">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <FilterSection title="Minimum Rating" icon={Star}>
        <StarRatingSelector
          value={filters.minStars}
          onChange={(minStars) => setFilters(prev => ({ ...prev, minStars }))}
        />
      </FilterSection>

      {/* Release Date Filter */}
      <FilterSection title="Release Year" icon={Calendar}>
        <YearRangeSelector
          value={filters.yearRange}
          onChange={(yearRange) => setFilters(prev => ({ ...prev, yearRange }))}
        />
      </FilterSection>

      {/* Platform Filter */}
      <FilterSection title="Platform" icon={Monitor}>
        <PlatformCheckboxes
          selected={filters.platforms}
          onChange={(platforms) => setFilters(prev => ({ ...prev, platforms }))}
        />
      </FilterSection>

      {/* Genre Filter */}
      <FilterSection title="Genre" icon={Gamepad2}>
        <GenrePills
          genres={genres}
          selected={filters.genres}
          onChange={(genreIds) => setFilters(prev => ({ ...prev, genres: genreIds }))}
        />
      </FilterSection>

      {/* Developer Search */}
      <FilterSection title="Developer" icon={Search} defaultOpen={false}>
        <DeveloperSearch
          value={filters.developer}
          onChange={(developer) => setFilters(prev => ({ ...prev, developer }))}
        />
      </FilterSection>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All Filters
        </button>
      )}
    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={onClose}
        />

        {/* Drawer */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 lg:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-neutral-900">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="h-[calc(100vh-65px)] overflow-y-auto p-5">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="sticky top-24 h-fit w-72 flex-shrink-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {filterContent}
    </aside>
  );
}

