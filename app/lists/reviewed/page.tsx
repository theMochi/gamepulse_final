import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGameCoverUrl } from '@/utils/img';
import Image from 'next/image';
import { ListChecks, ArrowLeft, Gamepad2, Star } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReviewedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session as any).userId;

  const reviews = await prisma.review.findMany({
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
          <ListChecks className="h-8 w-8 text-blue-400" />
          Reviewed Games
        </h1>
        <p className="text-muted-foreground mt-2">
          {reviews.length} {reviews.length === 1 ? 'game' : 'games'} you have reviewed
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <ListChecks className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
          <p className="text-muted-foreground mb-6">Start reviewing games to share your thoughts with the community.</p>
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
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/game/${review.game.igdbId}`}
              className="group bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getGameCoverUrl(review.game.coverId || undefined)}
                  alt={review.game.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm border border-border text-foreground px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  {review.rating}/10
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {review.game.name}
                </h3>
                {review.title && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1 italic">
                    "{review.title}"
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-foreground font-medium">{review.rating}/10</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
