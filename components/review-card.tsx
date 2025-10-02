'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { getImageUrl } from '@/utils/img'
import { scoreToDisplay } from '@/utils/score'

interface ReviewCardProps {
  review: {
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
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review._count.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent card click
    e.stopPropagation() // Stop event bubbling
    
    if (isLiking) return
    setIsLiking(true)

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId: review.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikes(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error liking review:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCardClick = () => {
    window.location.href = `/game/${review.game.igdbId}`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* User Avatar */}
          <Link 
            href={`/profile/${review.user.username}`}
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {review.user.image ? (
                <img 
                  src={review.user.image} 
                  alt={review.user.name || review.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <Link 
                  href={`/profile/${review.user.username}`}
                  className="font-semibold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {review.user.name || review.user.username}
                </Link>
                <span className="text-gray-500 ml-2">reviewed</span>
                <span className="font-semibold ml-2">
                  {review.game.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-lg font-bold text-blue-600">
                  {scoreToDisplay(review.rating)}
                </div>
                <span className="text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Review Content */}
            <div className="flex gap-4">
              {/* Game Cover */}
              {review.game.coverId && (
                <img
                  src={getImageUrl(review.game.coverId, 'cover_small')}
                  alt={review.game.name}
                  className="w-16 h-24 object-cover rounded shadow-sm hover:shadow-md transition-shadow"
                />
              )}

              {/* Review Text */}
              <div className="flex-1 min-w-0">
                {review.title && (
                  <h3 className="font-semibold mb-1">{review.title}</h3>
                )}
                {review.body && (
                  <p className="text-gray-700 line-clamp-3 mb-3">
                    {review.body}
                  </p>
                )}

                {/* Social Interactions */}
                <div className="flex items-center gap-4 text-gray-500">
                  <button 
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center gap-1 transition-colors ${
                      isLiked 
                        ? 'text-red-500' 
                        : 'hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} 
                    />
                    <span className="text-sm">{likes}</span>
                  </button>
                  <Link 
                    href={`/game/${review.game.igdbId}#review-${review.id}`}
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{review._count.comments}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}