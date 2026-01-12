'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserPlus, UserMinus } from 'lucide-react';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export default function FollowButton({ targetUserId, isFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleFollow = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          action: following ? 'unfollow' : 'follow'
        }),
      });

      if (response.ok) {
        setFollowing(!following);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 disabled:opacity-50 ${
        following
          ? 'border-muted-foreground/30 bg-muted text-muted-foreground hover:border-red-500/30 hover:text-red-400'
          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {following ? (
        <>
          <UserMinus className="h-4 w-4" />
          {loading ? 'Saving...' : 'Unfollow'}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {loading ? 'Saving...' : 'Follow'}
        </>
      )}
    </button>
  );
}
