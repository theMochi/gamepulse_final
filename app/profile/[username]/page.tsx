import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FollowButton from '@/components/follow-button';
import ProfileStats from '@/components/profile-stats';
import { Star, Settings } from 'lucide-react';

const prisma = new PrismaClient();

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          reviews: true,
          favorites: true,
        }
      }
    }
  });

  if (!user) notFound();

  const isOwnProfile = session && (session as any).userId === user.id;
  const isFollowing = session ? await prisma.follow.findFirst({
    where: {
      followerId: (session as any).userId,
      followingId: user.id
    }
  }) : null;

  // Get recent reviews
  const recentReviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { game: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get favorites
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { game: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Get lists
  const userLists = await prisma.list.findMany({
    where: { userId: user.id },
    include: {
      entries: {
        include: { game: true },
        take: 20
      }
    }
  });

  // Organize lists by type
  const lists = {
    played: userLists.find(l => l.type === 'PLAYED')?.entries.map(e => e.game) || [],
    wishlist: userLists.find(l => l.type === 'WISHLIST')?.entries.map(e => e.game) || []
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  className="h-24 w-24 rounded-full border-2 border-primary/30"
                  src={user.image}
                  alt={user.username}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-foreground">{user.username}</h1>
              {user.bio && (
                <p className="mt-2 text-muted-foreground">{user.bio}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              {!isOwnProfile && session && (
                <FollowButton
                  targetUserId={user.id}
                  isFollowing={!!isFollowing}
                />
              )}
              {isOwnProfile && (
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted hover:border-primary/50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
          <div className="ml-32">
            <ProfileStats
              favorites={favorites.map(f => f.game)}
              lists={lists}
              reviews={recentReviews.map(r => r.game)}
              counts={{
                followers: user._count.followers,
                following: user._count.following,
                reviews: user._count.reviews,
                favorites: user._count.favorites
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <Link 
              key={review.id} 
              href={`/game/${review.game.igdbId}`}
              className="block bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                  {review.game.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-foreground font-medium">{review.rating}/10</span>
                </div>
              </div>
              {review.title && (
                <h4 className="text-md font-medium text-foreground/80 mt-2">{review.title}</h4>
              )}
              {review.body && (
                <p className="text-muted-foreground mt-2 line-clamp-2">{review.body}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
          {recentReviews.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
