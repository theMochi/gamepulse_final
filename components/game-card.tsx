'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IGDBGame } from '@/lib/igdb';
import { getGameCoverUrl } from '@/utils/img';
import { starsFromTotal, compact, fmtDate } from '@/lib/score';
import { buildGamesUrl } from '@/lib/links';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stars } from '@/components/stars';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: IGDBGame;
  className?: string;
  showSummary?: boolean;
}

export function GameCard({ game, className, showSummary = false }: GameCardProps) {
  const coverUrl = getGameCoverUrl(game.cover?.image_id);
  const rating = game.total_rating;
  const ratingCount = game.total_rating_count;
  const stars = starsFromTotal(rating);
  
  const platforms = game.platforms?.slice(0, 3) || [];
  const genres = game.genres?.slice(0, 2) || [];

  return (
    <Link href={`/game/${game.id}`} className="group">
      <article className="group flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
        {/* Cover with square aspect ratio */}
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <Image
            src={coverUrl}
            alt={`${game.name} cover`}
            width={280}
            height={280}
            className="h-auto w-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Body with fixed height */}
        <div className="flex flex-col gap-3 p-4 flex-1 min-h-[200px]">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 min-h-[2.5rem] leading-tight mb-2">
              {game.name}
            </h3>
            <div className="text-xs text-muted-foreground mb-3">{fmtDate(game.first_release_date)}</div>

            {/* Ratings row */}
            {rating && (
              <div className="flex items-center gap-2 text-sm mb-3">
                <Stars rating={stars} size="sm" />
                <span className="text-foreground font-medium">{Math.round(rating)}</span>
                <span className="text-muted-foreground">({compact(ratingCount)})</span>
              </div>
            )}
          </div>

          {/* Chips — fixed height sections */}
          <div className="space-y-2">
            {platforms.length > 0 && (
              <div className="flex flex-wrap gap-1 min-h-[1.5rem]" onClick={(e) => e.stopPropagation()}>
                {platforms.filter(p => p.id && p.name).slice(0,3).map((p) => (
                  <Link key={p.id} href={buildGamesUrl({platformIds:[p.id!]})} onClick={(e) => e.stopPropagation()}>
                    <Badge className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors border border-primary/20">
                      {p.abbreviation ?? p.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 min-h-[1.5rem]" onClick={(e) => e.stopPropagation()}>
                {genres.filter(g => g.id && g.name).slice(0,2).map((g) => (
                  <Link key={g.id} href={buildGamesUrl({genreIds:[g.id!]})} onClick={(e) => e.stopPropagation()}>
                    <Badge className="text-xs px-2 py-0.5 bg-accent text-accent-foreground border-border hover:bg-accent/80 cursor-pointer transition-colors border">
                      {g.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Summary - consistent space; clamp */}
          {showSummary && game.summary && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border pt-3">
              {game.summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
