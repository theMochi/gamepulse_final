import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGameCoverUrl } from '@/utils/img';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function ListsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session as any).userId;

  // Get user's lists data
  const [favorites, userLists, reviews] = await Promise.all([
    // Favorites
    prisma.favorite.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: 'desc' }
    }),
    // Lists (Played, Wishlist)
    prisma.list.findMany({
      where: { userId },
      include: {
        entries: {
          include: { game: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    // Reviews
    prisma.review.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Organize lists
  const playedList = userLists.find(l => l.type === 'PLAYED');
  const wishlist = userLists.find(l => l.type === 'WISHLIST');

  const lists = [
    {
      id: 'favorites',
      title: 'Favorites',
      count: favorites.length,
      description: 'Games you love the most',
      href: '/lists/favorites'
    },
    {
      id: 'played',
      title: 'Played',
      count: playedList?.entries.length || 0,
      description: 'Games you have completed',
      href: '/lists/played'
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      count: wishlist?.entries.length || 0,
      description: 'Games you want to play',
      href: '/lists/wishlist'
    },
    {
      id: 'reviewed',
      title: 'Reviewed',
      count: reviews.length,
      description: 'Games you have reviewed',
      href: '/lists/reviewed'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Lists</h1>
        <p className="text-gray-600 mt-2">Organize and track your gaming journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={list.href}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                {list.count}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                {list.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {list.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Preview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Favorites</h3>
              <div className="space-y-3">
                {favorites.slice(0, 3).map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/game/${favorite.game.igdbId}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getGameCoverUrl(favorite.game.coverId || undefined)}
                        alt={favorite.game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {favorite.game.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(favorite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
              <div className="space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <Link
                    key={review.id}
                    href={`/game/${review.game.igdbId}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getGameCoverUrl(review.game.coverId || undefined)}
                        alt={review.game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {review.game.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-gray-600">{review.rating}/10</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
