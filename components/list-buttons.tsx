'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ListButtonsProps {
  igdbId: number;
  inBacklog?: boolean;
  inPlayed?: boolean;
  inWishlist?: boolean;
}

export default function ListButtons({ 
  igdbId, 
  inBacklog = false, 
  inPlayed = false, 
  inWishlist = false 
}: ListButtonsProps) {
  const [backlog, setBacklog] = useState(inBacklog);
  const [played, setPlayed] = useState(inPlayed);
  const [wishlist, setWishlist] = useState(inWishlist);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleListToggle = async (type: 'BACKLOG' | 'PLAYED' | 'WISHLIST', currentState: boolean) => {
    if (!session) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/lists/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          igdbId,
          type,
          action: currentState ? 'remove' : 'add'
        }),
      });

      if (response.ok) {
        switch (type) {
          case 'BACKLOG':
            setBacklog(!currentState);
            break;
          case 'PLAYED':
            setPlayed(!currentState);
            break;
          case 'WISHLIST':
            setWishlist(!currentState);
            break;
        }
      }
    } catch (error) {
      console.error('Error toggling list entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleListToggle('BACKLOG', backlog)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          backlog
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } disabled:opacity-50`}
      >
        📋 {backlog ? 'In Backlog' : 'Add to Backlog'}
      </button>
      
      <button
        onClick={() => handleListToggle('PLAYED', played)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          played
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } disabled:opacity-50`}
      >
        ✅ {played ? 'Played' : 'Mark as Played'}
      </button>
      
      <button
        onClick={() => handleListToggle('WISHLIST', wishlist)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          wishlist
            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } disabled:opacity-50`}
      >
        🎁 {wishlist ? 'In Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
}
