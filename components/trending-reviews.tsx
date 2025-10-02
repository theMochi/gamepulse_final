import Link from 'next/link'
import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getImageUrl } from '@/utils/img'
import { scoreToDisplay } from '@/utils/score'

interface TrendingReview {
  id: string
  title: string | null
  rating: number
  user: {
    username: string
    name: string | null
  }
  game: {
    igdbId: number
    name: string
    coverId: string | null
  }
  _count: {
    likes: number
  }
}

interface TrendingReviewsProps {
  reviews: TrendingReview[]
}

export function TrendingReviews({ reviews }: TrendingReviewsProps) {
  if (reviews.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold">Trending Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.slice(0, 6).map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <CardContent className="p-0">
              {/* Game Cover */}
              {review.game.coverId && (
                <Link href={`/game/${review.game.igdbId}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(review.game.coverId, 'cover_big')}
                      alt={review.game.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                      {scoreToDisplay(review.rating)}
                    </div>
                  </div>
                </Link>
              )}

              {/* Review Info */}
              <div className="p-4">
                <Link 
                  href={`/game/${review.game.igdbId}`}
                  className="font-semibold hover:underline line-clamp-1 mb-2"
                >
                  {review.game.name}
                </Link>

                {review.title && (
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    &quot;{review.title}&quot;
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <Link 
                    href={`/profile/${review.user.username}`}
                    className="text-gray-600 hover:underline"
                  >
                    by {review.user.name || review.user.username}
                  </Link>
                  <div className="flex items-center gap-1 text-red-500">
                    <span>{review._count.likes}</span>
                    <span>❤️</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

