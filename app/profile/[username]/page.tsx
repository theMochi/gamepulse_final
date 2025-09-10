import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import FollowButton from '@/components/follow-button';

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                className="h-24 w-24 rounded-full"
                src={user.image}
                alt={user.username}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            {user.bio && (
              <p className="mt-2 text-gray-600">{user.bio}</p>
            )}
            <div className="mt-4 flex space-x-6">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{user._count.followers}</span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-900">{user._count.following}</span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-900">{user._count.reviews}</span>
                <span className="text-gray-500 ml-1">reviews</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-900">{user._count.favorites}</span>
                <span className="text-gray-500 ml-1">favorites</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {!isOwnProfile && session && (
              <FollowButton
                targetUserId={user.id}
                isFollowing={!!isFollowing}
              />
            )}
            {isOwnProfile && (
              <a
                href="/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit Profile
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{review.game.name}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm text-gray-600">{review.rating}/10</span>
                </div>
              </div>
              {review.title && (
                <h4 className="text-md font-medium text-gray-800 mt-2">{review.title}</h4>
              )}
              {review.body && (
                <p className="text-gray-600 mt-2">{review.body}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {recentReviews.length === 0 && (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
