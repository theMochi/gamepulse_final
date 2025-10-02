import Link from 'next/link'
import { Star, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FeaturedUser {
  id: string
  username: string
  name: string | null
  image: string | null
  bio: string | null
  _count: {
    reviews: number
    followers: number
  }
}

interface FeaturedUsersProps {
  users: FeaturedUser[]
}

export function FeaturedUsers({ users }: FeaturedUsersProps) {
  if (users.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Active Community Members</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Link href={`/profile/${user.username}`} className="block">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name || user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold hover:underline truncate">
                      {user.name || user.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex gap-4 text-sm mt-1">
                      <div>
                        <span className="font-bold">{user._count.reviews}</span>
                        <span className="text-gray-500 ml-1">Reviews</span>
                      </div>
                      <div>
                        <span className="font-bold">{user._count.followers}</span>
                        <span className="text-gray-500 ml-1">Followers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {user.bio}
                  </p>
                )}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}