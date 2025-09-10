'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

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
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
        following
          ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
          : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
      }`}
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
}
