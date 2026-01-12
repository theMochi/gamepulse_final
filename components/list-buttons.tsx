'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Gamepad2, Star, Check } from 'lucide-react';

interface ListButtonsProps {
  igdbId: number;
  inBacklog?: boolean;
  inPlayed?: boolean;
  inWishlist?: boolean;
}

export default function ListButtons({ 
  igdbId, 
  inPlayed = false, 
  inWishlist = false 
}: ListButtonsProps) {
  const [played, setPlayed] = useState(inPlayed);
  const [wishlist, setWishlist] = useState(inWishlist);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleListToggle = async (type: 'PLAYED' | 'WISHLIST', currentState: boolean) => {
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

  const buttons = [
    {
      type: 'PLAYED' as const,
      state: played,
      icon: played ? Check : Gamepad2,
      label: 'Played',
      activeClass: 'border-green-500/50 bg-green-500/10 text-green-400',
      inactiveClass: 'border-border bg-card/50 text-muted-foreground hover:border-green-500/30 hover:text-green-400',
    },
    {
      type: 'WISHLIST' as const,
      state: wishlist,
      icon: Star,
      label: 'Wishlist',
      activeClass: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
      inactiveClass: 'border-border bg-card/50 text-muted-foreground hover:border-yellow-500/30 hover:text-yellow-400',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.type}
          onClick={() => handleListToggle(btn.type, btn.state)}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 disabled:opacity-50 ${
            btn.state ? btn.activeClass : btn.inactiveClass
          }`}
        >
          <btn.icon className={`h-4 w-4 ${btn.state && btn.type === 'WISHLIST' ? 'fill-current' : ''}`} />
          {btn.label}
        </button>
      ))}
    </div>
  );
}
