import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image?: string | null;
  };
  game: {
    id: string;
    igdbId: number;
    name: string;
    coverId?: string | null;
  };
}

interface RecentReviewsProps {
  items: Review[];
}

export default function RecentReviews({ items }: RecentReviewsProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
        <p className="text-gray-500">No reviews yet. Be the first to review a game!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
      <div className="space-y-4">
        {items.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {review.user.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={review.user.image}
                    alt={review.user.username}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">
                      {review.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/profile/${review.user.username}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {review.user.username}
                  </Link>
                  <span className="text-gray-500">•</span>
                  <Link
                    href={`/game/${review.game.igdbId}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {review.game.name}
                  </Link>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="ml-1 text-sm text-gray-600">{review.rating}/10</span>
                  </div>
                </div>
                {review.title && (
                  <h3 className="text-sm font-medium text-gray-900 mt-1">{review.title}</h3>
                )}
                {review.body && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.body}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
