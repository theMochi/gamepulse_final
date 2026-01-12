'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  igdbId: number;
  isFavorited?: boolean;
}

export default function FavoriteButton({ igdbId, isFavorited = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleToggle = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          igdbId,
          action: favorited ? 'remove' : 'add'
        }),
      });

      if (response.ok) {
        setFavorited(!favorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 disabled:opacity-50 ${
        favorited
          ? 'border-red-500/50 bg-red-500/10 text-red-400'
          : 'border-border bg-card/50 text-muted-foreground hover:border-red-500/30 hover:text-red-400'
      }`}
    >
      <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
      {loading ? 'Saving...' : favorited ? 'Favorited' : 'Favorite'}
    </button>
  );
}
