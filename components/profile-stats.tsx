'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getGameCoverUrl } from '@/utils/img';

interface Game {
  id: string;
  name: string;
  cover?: { image_id: string } | null;
}

interface ProfileStatsProps {
  favorites: Game[];
  lists: {
    played: Game[];
    wishlist: Game[];
  };
  reviews: Game[];
  counts: {
    followers: number;
    following: number;
    reviews: number;
    favorites: number;
  };
}

export default function ProfileStats({ favorites, lists, reviews, counts }: ProfileStatsProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const getPreviewGames = (type: string) => {
    switch (type) {
      case 'favorites':
        return favorites.slice(0, 6);
      case 'played':
        return lists.played.slice(0, 6);
      case 'wishlist':
        return lists.wishlist.slice(0, 6);
      case 'reviewed':
        return reviews.slice(0, 6);
      default:
        return [];
    }
  };

  const getStatLabel = (type: string) => {
    switch (type) {
      case 'favorites':
        return 'Favorites';
      case 'played':
        return 'Played';
      case 'wishlist':
        return 'Wishlist';
      case 'reviewed':
        return 'Reviewed';
      default:
        return '';
    }
  };

  const getStatCount = (type: string) => {
    switch (type) {
      case 'favorites':
        return counts.favorites;
      case 'played':
        return lists.played.length;
      case 'wishlist':
        return lists.wishlist.length;
      case 'reviewed':
        return counts.reviews;
      default:
        return 0;
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-4 lg:gap-6">
      <div className="text-sm">
        <span className="font-medium text-foreground">{counts.followers}</span>
        <span className="text-muted-foreground ml-1">followers</span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-foreground">{counts.following}</span>
        <span className="text-muted-foreground ml-1">following</span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-foreground">{counts.reviews}</span>
        <span className="text-muted-foreground ml-1">reviews</span>
      </div>
      
      {/* Interactive Favorites */}
      <div 
        className="text-sm relative"
        onMouseEnter={() => setHoveredStat('favorites')}
        onMouseLeave={() => setHoveredStat(null)}
      >
        <Link href="/lists/favorites" className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors">
          {counts.favorites}
        </Link>
        <span className="text-muted-foreground ml-1">favorites</span>
        
        {hoveredStat === 'favorites' && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-xl shadow-lg border border-border p-4 z-50">
            <h3 className="font-semibold text-foreground mb-3">Favorites</h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {getPreviewGames('favorites').map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getGameCoverUrl(game.cover?.image_id)}
                        alt={game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="(max-width: 768px) 33vw, 10vw"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {game.name}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No favorites yet</p>
            )}
          </div>
        )}
      </div>

      {/* Interactive Lists */}
      {['played', 'wishlist', 'reviewed'].map((listType) => (
        <div 
          key={listType}
          className="text-sm relative"
          onMouseEnter={() => setHoveredStat(listType)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Link href={`/lists/${listType}`} className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors">
            {getStatCount(listType)}
          </Link>
          <span className="text-muted-foreground ml-1">{listType}</span>
          
          {hoveredStat === listType && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-xl shadow-lg border border-border p-4 z-50">
              <h3 className="font-semibold text-foreground mb-3">{getStatLabel(listType)}</h3>
              {getPreviewGames(listType).length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {getPreviewGames(listType).map((game) => (
                    <Link
                      key={game.id}
                      href={`/game/${game.id}`}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                        <Image
                          src={getGameCoverUrl(game.cover?.image_id)}
                          alt={game.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-200"
                          sizes="(max-width: 768px) 33vw, 10vw"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {game.name}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No games in {getStatLabel(listType).toLowerCase()}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
