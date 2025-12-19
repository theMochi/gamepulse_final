'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Game {
  id: number;
  title: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  releaseYear?: number;
  platforms?: string[];
  genres?: string[];
}

interface GameGridCardProps {
  game: Game;
  className?: string;
}

function formatReviewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return String(count);
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const fullStars = Math.floor(rating);
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= fullStars
              ? 'fill-amber-400 text-amber-400'
              : star <= rating
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-neutral-300'
          )}
        />
      ))}
    </div>
  );
}

export function GameGridCard({ game, className }: GameGridCardProps) {
  return (
    <Link href={`/game/${game.id}`} className="group">
      <article
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-xl bg-white border border-neutral-200 transition-all duration-300',
          'hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-1',
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Rating Badge */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-neutral-900">{game.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug min-h-[2.5rem]">
            {game.title}
          </h3>

          {/* Release Year */}
          {game.releaseYear && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
              <Calendar className="h-3 w-3" />
              <span>{game.releaseYear}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Rating & Reviews */}
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
            <StarRating rating={game.rating} />
            <span className="text-xs text-neutral-500">
              {formatReviewCount(game.reviewCount)} reviews
            </span>
          </div>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// Skeleton for loading state
export function GameGridCardSkeleton() {
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

