import { Card, CardContent } from '@/components/ui/card'
import { ReviewCard } from '@/components/review-card'

interface FeedReview {
  id: string
  title: string | null
  body: string | null
  rating: number
  createdAt: Date
  user: {
    id: string
    username: string
    name: string | null
    image: string | null
  }
  game: {
    id: string
    igdbId: number
    name: string
    coverId: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

interface SocialFeedProps {
  reviews: FeedReview[]
  title?: string
}

export function SocialFeed({ reviews, title = "Recent Activity" }: SocialFeedProps) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>No recent activity yet. Follow users to see their reviews!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
