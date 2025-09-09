import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedGames, getTopGames, getComingSoonGames, queryIGDB, IGDBGameSchema } from '@/lib/igdb';
import { sortGamesByHotScore } from '@/lib/score';
import { z } from 'zod';

const SearchParamsSchema = z.object({
  type: z.enum(['featured', 'top', 'coming-soon', 'search']).optional(),
  minRating: z.coerce.number().min(0).max(100).optional(),
  genreIds: z.string().optional(), // comma-separated genre IDs
  platformIds: z.string().optional(), // comma-separated platform IDs
  developerCompanyId: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  comingSoon: z.string().optional(),
  sort: z.enum(['hot', 'rating', 'count', 'newest', 'release_asc']).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  q: z.string().optional(), // raw APICalypse query
});

const BodySchema = z.object({
  minRating: z.number().min(0).max(100).optional(),
  genreIds: z.array(z.number()).optional(),
  platformIds: z.array(z.number()).optional(),
  developerCompanyId: z.number().optional(),
  sort: z.enum(['hot', 'rating', 'count', 'newest']).optional(),
  limit: z.number().min(1).max(200).optional(),
  offset: z.number().min(0).optional(),
}).optional();

async function buildStructuredQuery(filters: {
  minRating?: number;
  genreIds?: number[];
  platformIds?: number[];
  developerCompanyId?: number;
  year?: number;
  comingSoon?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions: string[] = ['total_rating != null', 'total_rating_count != null'];
  
  if (filters.minRating) {
    conditions.push(`total_rating >= ${filters.minRating}`);
  }
  
  if (filters.genreIds && filters.genreIds.length > 0) {
    conditions.push(`genres = (${filters.genreIds.join(',')})`);
  }
  
  if (filters.platformIds && filters.platformIds.length > 0) {
    conditions.push(`platforms = (${filters.platformIds.join(',')})`);
  }
  
  if (filters.developerCompanyId) {
    conditions.push(`involved_companies.company = (${filters.developerCompanyId}) & involved_companies.developer = true`);
  }

  // Handle year filter
  if (filters.year && Number.isFinite(filters.year)) {
    const from = Math.floor(Date.UTC(filters.year, 0, 1) / 1000);
    const to = Math.floor(Date.UTC(filters.year + 1, 0, 1) / 1000);
    conditions.push(`first_release_date >= ${from} & first_release_date < ${to}`);
  }

  // Handle coming soon filter
  if (filters.comingSoon === '1') {
    const now = Math.floor(Date.now() / 1000);
    conditions.push(`first_release_date > ${now}`);
  }

  const whereClause = conditions.length > 0 ? `where ${conditions.join(' & ')};` : '';
  
  let sortClause = '';
  let actualLimit = filters.limit || 48;
  
  switch (filters.sort) {
    case 'rating':
      sortClause = 'sort total_rating desc;';
      break;
    case 'count':
      sortClause = 'sort total_rating_count desc;';
      break;
    case 'newest':
      sortClause = 'sort first_release_date desc;';
      break;
    case 'release_asc':
      sortClause = 'sort first_release_date asc;';
      break;
    case 'hot':
    default:
      // For hot sorting, fetch more data and sort client-side
      sortClause = 'sort total_rating_count desc;';
      actualLimit = Math.min(200, actualLimit * 4); // Fetch more for better hot score ranking
      break;
  }

  const offset = filters.offset || 0;

  const query = `
    fields id,name,summary,first_release_date,total_rating,total_rating_count,
    genres.id,genres.name,platforms.id,platforms.name,platforms.abbreviation,
    involved_companies.company.id,involved_companies.company.name,involved_companies.developer,
    cover.image_id;
    ${whereClause}
    ${sortClause}
    limit ${actualLimit};
    offset ${offset};
  `;

  return query;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = SearchParamsSchema.parse(Object.fromEntries(searchParams));

    // If raw query is provided, use it directly
    if (params.q) {
      const data = await queryIGDB('games', params.q);
      return NextResponse.json(data);
    }

    // Handle predefined query types
    switch (params.type) {
      case 'featured':
        const featuredGames = await getFeaturedGames();
        return NextResponse.json(featuredGames);

      case 'top':
        const topGames = await getTopGames();
        const sortedTopGames = sortGamesByHotScore(topGames);
        return NextResponse.json(sortedTopGames.slice(0, params.limit || 50));

      case 'coming-soon':
        const comingSoonGames = await getComingSoonGames();
        return NextResponse.json(comingSoonGames);

      case 'search':
      default:
        // Parse comma-separated arrays
        const platformIds = params.platformIds 
          ? params.platformIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
          : undefined;
        
        const genreIds = params.genreIds 
          ? params.genreIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
          : undefined;

        const query = await buildStructuredQuery({
          minRating: params.minRating,
          genreIds,
          platformIds,
          developerCompanyId: params.developerCompanyId,
          year: params.year,
          comingSoon: params.comingSoon,
          sort: params.sort || 'hot',
          limit: params.limit,
          offset: params.offset,
        });

        const data = await queryIGDB('games', query);
        const games = data || [];

        // Apply hot score sorting if needed
        if (params.sort === 'hot' || !params.sort) {
          const sortedGames = sortGamesByHotScore(games);
          const actualLimit = params.limit || 48;
          return NextResponse.json(sortedGames.slice(0, actualLimit));
        }

        return NextResponse.json(games);
    }
  } catch (error) {
    console.error('Error in /api/igdb/games:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.query && typeof body.query === 'string') {
      const data = await queryIGDB('games', body.query);
      return NextResponse.json(data);
    }

    // Handle structured filters in POST body
    const filters = BodySchema.parse(body);
    if (!filters) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const query = await buildStructuredQuery({
      minRating: filters.minRating,
      genreIds: filters.genreIds,
      platformIds: filters.platformIds,
      developerCompanyId: filters.developerCompanyId,
      sort: filters.sort || 'hot',
      limit: filters.limit,
      offset: filters.offset,
    });

    const data = await queryIGDB('games', query);
    const games = data || [];

    // Apply hot score sorting if needed
    if (filters.sort === 'hot' || !filters.sort) {
      const sortedGames = sortGamesByHotScore(games);
      const actualLimit = filters.limit || 48;
      return NextResponse.json(sortedGames.slice(0, actualLimit));
    }

    return NextResponse.json(games);
    
  } catch (error) {
    console.error('Error in POST /api/igdb/games:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
