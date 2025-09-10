import { getFeaturedGames, getTopGames, getComingSoonGames } from '@/lib/igdb';
import { sortGamesByCombinedScore } from '@/utils/score';
import { GameCard } from '@/components/game-card';
import { GameCardSkeleton } from '@/components/game-card-skeleton';
import { Section } from '@/components/section';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recentReviewsForFeed } from '@/lib/feed';
import RecentReviews from '@/components/recent-reviews';

async function FeaturedSection() {
  try {
    const games = await getFeaturedGames();
    const displayGames = games.slice(0, 12);

    return (
      <Section 
        eyebrow="Best of 2025" 
        title="Featured Games" 
        description="The highest-rated games released in 2025"
        href="/games?year=2025&sort=rating"
      >
        {displayGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Section>
    );
  } catch (error) {
    console.error('Error fetching featured games:', error);
    return (
      <Section eyebrow="Editor's Choice" title="Featured Games" description="The highest-rated games released in 2025">
        <div className="col-span-full text-center py-8 text-zinc-500">
          Unable to load featured games. Please try again later.
        </div>
      </Section>
    );
  }
}

async function TopGamesSection() {
  try {
    const games = await getTopGames();
    const sortedGames = sortGamesByCombinedScore(games);
    const displayGames = sortedGames.slice(0, 12);

    return (
      <Section 
        eyebrow="Most Popular" 
        title="Top Games" 
        description="Ranked by combined rating and review volume"
        href="/games?sort=hot"
      >
        {displayGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Section>
    );
  } catch (error) {
    console.error('Error fetching top games:', error);
    return (
      <Section eyebrow="Most Popular" title="Top Games" description="Ranked by combined rating and review volume">
        <div className="col-span-full text-center py-8 text-zinc-500">
          Unable to load top games. Please try again later.
        </div>
      </Section>
    );
  }
}

async function ComingSoonSection() {
  try {
    const games = await getComingSoonGames();
    const displayGames = games.slice(0, 12);

    return (
      <Section 
        eyebrow="Releasing Soon" 
        title="Coming Soon" 
        description="Highly anticipated games releasing in 2025"
        href="/games?year=2025&comingSoon=1&sort=release_asc"
      >
        {displayGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Section>
    );
  } catch (error) {
    console.error('Error fetching coming soon games:', error);
    return (
      <Section eyebrow="Upcoming" title="Coming Soon" description="Highly anticipated games releasing in 2025">
        <div className="col-span-full text-center py-8 text-zinc-500">
          Unable to load upcoming games. Please try again later.
        </div>
      </Section>
    );
  }
}

function LoadingSection({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <Section eyebrow={eyebrow} title={title} description={description}>
      {[...Array(12)].map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </Section>
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const feed = await recentReviewsForFeed((session as any)?.userId);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative isolate overflow-hidden">
        {/* Background gradients */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-96 opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(1400px 400px at 50% 0%, rgba(59,130,246,0.15), rgba(147,51,234,0.08), transparent)' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICA8L2RlZnM+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4xIj4KICAgICAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=')] opacity-30"></div>
        
        <header className="relative text-center py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-6 border border-blue-200/50">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Game Data
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Discover Amazing Games
            </h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-6">
              Ranked by players. Powered by live data from the world's largest game database.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>10k+ games</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>60+ platforms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Updated hourly</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-4">
        {/* Top Games - First */}
        <Suspense fallback={
          <LoadingSection 
            eyebrow="Most Popular" 
            title="Top Games" 
            description="Ranked by combined rating and review volume"
          />
        }>
          <TopGamesSection />
        </Suspense>

        {/* Section Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-12" />

        {/* Featured Games - with alternating background */}
        <div className="bg-neutral-50 rounded-2xl -mx-4 px-4 py-8">
          <Suspense fallback={
            <LoadingSection 
              eyebrow="Best of 2025" 
              title="Featured Games" 
              description="The highest-rated games released in 2025"
            />
          }>
            <FeaturedSection />
          </Suspense>
        </div>

        {/* Section Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-12" />

        {/* Coming Soon - with alternating background */}
        <div className="bg-neutral-50 rounded-2xl -mx-4 px-4 py-8">
          <Suspense fallback={
            <LoadingSection 
              eyebrow="Releasing Soon" 
              title="Coming Soon" 
              description="Highly anticipated games releasing in 2025"
            />
          }>
            <ComingSoonSection />
          </Suspense>
        </div>

        {/* Section Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-12" />

        {/* Recent Reviews Feed */}
        <RecentReviews items={feed} />
      </div>
    </div>
  );
}
