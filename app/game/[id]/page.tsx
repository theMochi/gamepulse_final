import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getGameById } from '@/lib/igdb';
import { getGameCoverLargeUrl, getScreenshotUrl } from '@/utils/img';
import { fmtDate, starsFromTotal, compact } from '@/lib/score';
import { buildGamesUrl } from '@/lib/links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stars } from '@/components/stars';
import { ExternalLink, Play, Calendar, Users, Tag } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import ReviewForm from '@/components/review-form';
import FavoriteButton from '@/components/favorite-button';
import ListButtons from '@/components/list-buttons';

interface GamePageProps {
  params: {
    id: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const gameId = parseInt(params.id);
  
  if (isNaN(gameId)) {
    notFound();
  }

  const game = await getGameById(gameId);
  
  if (!game) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const prisma = new PrismaClient();

  // Get user's review and list status if logged in
  let userReview = null;
  let isFavorited = false;
  let listStatus = { inBacklog: false, inPlayed: false, inWishlist: false };

  if (session) {
    const userId = (session as any).userId;
    
    // Get user's review
    userReview = await prisma.review.findFirst({
      where: {
        userId,
        game: { igdbId: gameId }
      }
    });

    // Get favorite status
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        game: { igdbId: gameId }
      }
    });
    isFavorited = !!favorite;

    // Get list status
    const lists = await prisma.list.findMany({
      where: { userId },
      include: {
        entries: {
          where: {
            game: { igdbId: gameId }
          }
        }
      }
    });

    listStatus = {
      inBacklog: (lists.find(l => l.type === 'BACKLOG')?.entries?.length ?? 0) > 0,
      inPlayed:  (lists.find(l => l.type === 'PLAYED')?.entries?.length ?? 0) > 0,
      inWishlist:(lists.find(l => l.type === 'WISHLIST')?.entries?.length ?? 0) > 0,
    };
  }

  // Get recent reviews for this game
  const recentReviews = await prisma.review.findMany({
    where: {
      game: { igdbId: gameId }
    },
    include: {
      user: { select: { id: true, username: true, image: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Calculate average rating from reviews
  const averageRating = recentReviews.length > 0 
    ? recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length 
    : null;

  const coverUrl = getGameCoverLargeUrl(game.cover?.image_id);
  const rating = game.total_rating;
  const ratingCount = game.total_rating_count;
  const stars = starsFromTotal(rating);
  
  const platforms = game.platforms || [];
  const genres = game.genres || [];
  const developers = game.involved_companies?.filter((ic: any) => ic.developer && ic.company?.name) || [];
  const screenshots = game.screenshots || [];
  const trailer = game.videos?.[0];
  const officialSite = game.websites?.[0]; // First available website

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src={coverUrl}
              alt={`${game.name} cover`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* Game Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{game.name}</h1>
            {game.first_release_date && (
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {fmtDate(game.first_release_date)}
              </p>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-4">
              <Stars rating={stars} size="lg" showValue />
              <div className="text-sm text-muted-foreground">
                {ratingCount && (
                  <span>Based on {compact(ratingCount)} ratings</span>
                )}
              </div>
            </div>
          )}

          {/* Platforms */}
          {platforms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {platforms.filter((p: any) => p.id && p.name).map((platform: any) => (
                  <Link key={platform.id} href={buildGamesUrl({ platformIds: [platform.id!] })}>
                    <Badge variant="secondary" className="text-sm hover:bg-secondary/80 cursor-pointer transition-colors">
                      {platform.abbreviation || platform.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.filter((g: any) => g.id && g.name).map((genre: any) => (
                  <Link key={genre.id} href={buildGamesUrl({ genreIds: [genre.id!] })}>
                    <Badge variant="outline" className="text-sm hover:bg-accent/80 cursor-pointer transition-colors">
                      {genre.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Developers */}
          {developers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Developers
              </h3>
              <div className="flex flex-wrap gap-2">
                {developers.map((dev: any) => (
                  <Link key={dev.company?.id || Math.random()} href={buildGamesUrl({ developerCompanyId: dev.company?.id })}>
                    <Badge variant="outline" className="text-sm hover:bg-accent/80 cursor-pointer transition-colors">
                      {dev.company?.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            {trailer && (
              <Button size="lg" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Watch Trailer
              </Button>
            )}
            {officialSite && (
              <Button variant="outline" size="lg" asChild className="flex items-center gap-2">
                <a href={officialSite.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>

          {/* User Actions */}
          {session && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <FavoriteButton igdbId={gameId} isFavorited={isFavorited} />
                <ListButtons 
                  igdbId={gameId} 
                  inBacklog={listStatus.inBacklog}
                  inPlayed={listStatus.inPlayed}
                  inWishlist={listStatus.inWishlist}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Reviews as Center of Attention */}
      <div className="space-y-8">
        {/* Reviews Section - Prominent and Central */}
        <div className="space-y-6">
          {/* Review Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Rate & Review</CardTitle>
              <p className="text-muted-foreground">Share your thoughts about this game</p>
            </CardHeader>
            <CardContent>
              <ReviewForm 
                igdbId={gameId} 
                existingReview={userReview ? {
                  rating: userReview.rating,
                  title: userReview.title || undefined,
                  body: userReview.body || undefined
                } : undefined}
              />
            </CardContent>
          </Card>

          {/* Community Reviews - Enhanced Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Community Reviews</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {recentReviews.length} {recentReviews.length === 1 ? 'review' : 'reviews'} from the community
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {averageRating ? averageRating.toFixed(1) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentReviews.length > 0 ? (
                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-6 hover:bg-card/50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.user.image ? (
                            <img
                              className="h-12 w-12 rounded-full"
                              src={review.user.image}
                              alt={review.user.username}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-lg font-bold text-muted-foreground">
                                {review.user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Link
                                href={`/profile/${review.user.username}`}
                                className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {review.user.username}
                              </Link>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500 text-lg">★</span>
                                <span className="text-lg font-semibold text-foreground">{review.rating}/10</span>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.title && (
                            <h4 className="text-lg font-semibold text-foreground mb-2">{review.title}</h4>
                          )}
                          {review.body && (
                            <p className="text-foreground leading-relaxed">{review.body}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to review this game and share your thoughts!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {game.summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{game.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Screenshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {screenshots.slice(0, 6).map((screenshot: any, index: number) => (
                      <div key={screenshot.image_id} className="aspect-video relative overflow-hidden rounded-lg">
                        <Image
                          src={getScreenshotUrl(screenshot.image_id)}
                          alt={`${game.name} screenshot ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trailer */}
            {trailer && (
              <Card>
                <CardHeader>
                  <CardTitle>Trailer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.video_id}`}
                      title={`${game.name} trailer`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Details */}
          <Card>
            <CardHeader>
              <CardTitle>Game Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game.first_release_date && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Release Date</h4>
                  <p className="text-sm text-muted-foreground">{fmtDate(game.first_release_date)}</p>
                </div>
              )}
              
              {platforms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Platforms</h4>
                  <p className="text-sm text-muted-foreground">
                    {platforms.map((p: any) => p.abbreviation || p.name).join(', ')}
                  </p>
                </div>
              )}
              
              {genres.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Genres</h4>
                  <p className="text-sm text-muted-foreground">
                    {genres.map((g: any) => g.name).join(', ')}
                  </p>
                </div>
              )}
              
              {developers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Developers</h4>
                  <p className="text-sm text-muted-foreground">
                    {developers.map((d: any) => d.company?.name).filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {rating && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Rating</h4>
                  <div className="flex items-center gap-2">
                    <Stars rating={stars} size="sm" />
                    <span className="text-sm text-muted-foreground">
                      {Math.round(rating / 10)}/10
                    </span>
                    {ratingCount && (
                      <span className="text-xs text-muted-foreground">
                        ({compact(ratingCount)} ratings)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: GamePageProps) {
  const gameId = parseInt(params.id);
  
  if (isNaN(gameId)) {
    return {
      title: 'Game Not Found',
    };
  }

  const game = await getGameById(gameId);
  
  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: `${game.name} - GamePulse`,
    description: game.summary || `Discover ${game.name} on GamePulse`,
  };
}
