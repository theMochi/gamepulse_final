import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGameCoverUrl } from '@/utils/img';
import Image from 'next/image';
import { Star, ArrowLeft, Gamepad2 } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session as any).userId;

  const wishlist = await prisma.list.findFirst({
    where: { 
      userId,
      type: 'WISHLIST'
    },
    include: {
      entries: {
        include: { game: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const wishlistGames = wishlist?.entries || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/lists" 
          className="text-primary hover:text-primary/80 text-sm font-medium mb-4 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Lists
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Star className="h-8 w-8 text-yellow-400" />
          Wishlist
        </h1>
        <p className="text-muted-foreground mt-2">
          {wishlistGames.length} {wishlistGames.length === 1 ? 'game' : 'games'} you want to play
        </p>
      </div>

      {wishlistGames.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No games in wishlist</h3>
          <p className="text-muted-foreground mb-6">Start adding games to your wishlist to track what you want to play.</p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Gamepad2 className="h-4 w-4" />
            Browse Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistGames.map((entry) => (
            <Link
              key={entry.id}
              href={`/game/${entry.game.igdbId}`}
              className="group bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getGameCoverUrl(entry.game.coverId || undefined)}
                  alt={entry.game.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                {/* Wishlist badge */}
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-black px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Wishlist
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {entry.game.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Added {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
