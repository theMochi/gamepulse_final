import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { getGameCoverUrl } from '@/utils/img';
import Image from 'next/image';
import { Heart, Gamepad2, Star, ListChecks, ChevronRight } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// CTA component for non-logged-in users
function GuestCTA() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative bg-card border border-border rounded-2xl p-6">
              <ListChecks className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
          Track Your Gaming Journey
        </h1>
        
        {/* Subheading */}
        <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
          Create personalized lists, track games you've played, build your wishlist, and share your collection with friends.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Heart, label: 'Favorites', desc: 'Love it' },
            { icon: Gamepad2, label: 'Played', desc: 'Finished' },
            { icon: Clock, label: 'Planning', desc: 'Next up' },
            { icon: Star, label: 'Wishlist', desc: 'Want it' },
          ].map((item) => (
            <div key={item.label} className="bg-card/50 border border-border/50 rounded-xl p-4">
              <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm bg-primary text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
          >
            Create Account
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm border border-border bg-card text-foreground transition-all hover:border-primary/50 hover:bg-primary/10"
          >
            Sign In
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-muted-foreground">
          Join thousands of gamers organizing their collections
        </p>
      </div>
    </div>
  );
}

export default async function ListsPage() {
  const session = await getServerSession(authOptions);
  
  // Show CTA for non-logged-in users instead of redirecting
  if (!session) {
    return <GuestCTA />;
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
      href: '/lists/favorites',
      icon: Heart,
      color: 'text-red-400'
    },
    {
      id: 'played',
      title: 'Played',
      count: playedList?.entries.length || 0,
      description: 'Games you have completed',
      href: '/lists/played',
      icon: Gamepad2,
      color: 'text-green-400'
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      count: wishlist?.entries.length || 0,
      description: 'Games you want to play',
      href: '/lists/wishlist',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      id: 'reviewed',
      title: 'Reviewed',
      count: reviews.length,
      description: 'Games you have reviewed',
      href: '/lists/reviewed',
      icon: ListChecks,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">My Lists</h1>
        <p className="text-muted-foreground mt-2">Organize and track your gaming journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={list.href}
            className="group bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 p-6 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="text-center">
              <list.icon className={`h-8 w-8 mx-auto mb-3 ${list.color} group-hover:scale-110 transition-transform`} />
              <div className="text-3xl font-display font-bold text-primary group-hover:text-primary/80 transition-colors">
                {list.count}
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                {list.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {list.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Preview */}
      <div className="mt-12">
        <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Recent Activity</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Favorites */}
          {favorites.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Recent Favorites
              </h3>
              <div className="space-y-3">
                {favorites.slice(0, 3).map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/game/${favorite.game.igdbId}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={getGameCoverUrl(favorite.game.coverId || undefined)}
                        alt={favorite.game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {favorite.game.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Recent Reviews
              </h3>
              <div className="space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <Link
                    key={review.id}
                    href={`/game/${review.game.igdbId}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={getGameCoverUrl(review.game.coverId || undefined)}
                        alt={review.game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {review.game.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-foreground">{review.rating}/10</span>
                        <span className="text-xs text-muted-foreground">
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
