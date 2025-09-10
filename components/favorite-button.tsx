'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        favorited
          ? 'bg-red-100 text-red-800 hover:bg-red-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {loading ? '...' : favorited ? '❤️ Favorited' : '🤍 Favorite'}
    </button>
  );
}
