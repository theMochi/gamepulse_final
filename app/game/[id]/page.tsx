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

  const coverUrl = getGameCoverLargeUrl(game.cover?.image_id);
  const rating = game.total_rating;
  const ratingCount = game.total_rating_count;
  const stars = starsFromTotal(rating);
  
  const platforms = game.platforms || [];
  const genres = game.genres || [];
  const developers = game.involved_companies?.filter(ic => ic.developer && ic.company?.name) || [];
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
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">{game.name}</h1>
            {game.first_release_date && (
              <p className="text-lg text-zinc-600 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {fmtDate(game.first_release_date)}
              </p>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-4">
              <Stars rating={stars} size="lg" showValue />
              <div className="text-sm text-zinc-600">
                {ratingCount && (
                  <span>Based on {compact(ratingCount)} ratings</span>
                )}
              </div>
            </div>
          )}

          {/* Platforms */}
          {platforms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {platforms.filter(p => p.id && p.name).map((platform) => (
                  <Link key={platform.id} href={buildGamesUrl({ platformIds: [platform.id!] })}>
                    <Badge variant="secondary" className="text-sm hover:bg-zinc-200 cursor-pointer transition-colors">
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
              <h3 className="text-sm font-semibold text-zinc-700 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.filter(g => g.id && g.name).map((genre) => (
                  <Link key={genre.id} href={buildGamesUrl({ genreIds: [genre.id!] })}>
                    <Badge variant="outline" className="text-sm hover:bg-zinc-50 cursor-pointer transition-colors">
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
              <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Developers
              </h3>
              <div className="flex flex-wrap gap-2">
                {developers.map((dev) => (
                  <Link key={dev.company?.id || Math.random()} href={buildGamesUrl({ developerCompanyId: dev.company?.id })}>
                    <Badge variant="outline" className="text-sm hover:bg-zinc-50 cursor-pointer transition-colors">
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
        </div>
      </div>

      {/* Content Tabs */}
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
                <p className="text-zinc-700 leading-relaxed">{game.summary}</p>
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
                  {screenshots.slice(0, 6).map((screenshot, index) => (
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
                  <h4 className="text-sm font-semibold text-zinc-700">Release Date</h4>
                  <p className="text-sm text-zinc-600">{fmtDate(game.first_release_date)}</p>
                </div>
              )}
              
              {platforms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700">Platforms</h4>
                  <p className="text-sm text-zinc-600">
                    {platforms.map(p => p.abbreviation || p.name).join(', ')}
                  </p>
                </div>
              )}
              
              {genres.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700">Genres</h4>
                  <p className="text-sm text-zinc-600">
                    {genres.map(g => g.name).join(', ')}
                  </p>
                </div>
              )}
              
              {developers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700">Developers</h4>
                  <p className="text-sm text-zinc-600">
                    {developers.map(d => d.company?.name).filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {rating && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700">Rating</h4>
                  <div className="flex items-center gap-2">
                    <Stars rating={stars} size="sm" />
                    <span className="text-sm text-zinc-600">
                      {Math.round(rating)}/100
                    </span>
                    {ratingCount && (
                      <span className="text-xs text-zinc-500">
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
