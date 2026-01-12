import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGameCoverUrl } from '@/utils/img';
import Image from 'next/image';
import { Heart, ArrowLeft, Gamepad2 } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session as any).userId;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { game: true },
    orderBy: { createdAt: 'desc' }
  });

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
          <Heart className="h-8 w-8 text-red-400" />
          Favorites
        </h1>
        <p className="text-muted-foreground mt-2">
          {favorites.length} {favorites.length === 1 ? 'game' : 'games'} you love
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">Start adding games to your favorites to see them here.</p>
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
          {favorites.map((favorite) => (
            <Link
              key={favorite.id}
              href={`/game/${favorite.game.igdbId}`}
              className="group bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getGameCoverUrl(favorite.game.coverId || undefined)}
                  alt={favorite.game.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {favorite.game.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Added {new Date(favorite.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
