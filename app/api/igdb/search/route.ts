import { NextRequest, NextResponse } from 'next/server';
import { queryIGDB } from '@/lib/igdb';
import { hotScore } from '@/lib/score';

// Note: IGDB cannot sort by a computed metric; fetch many then re-rank.
export async function GET(req: NextRequest) {
  const term = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (!term) return NextResponse.json({ items: [] });

  try {
    const q = `
      search "${term.replace(/"/g, '\\"')}";
      fields id,name,first_release_date,total_rating,total_rating_count,
             category,cover.image_id,platforms.abbreviation,platforms.name,alternative_names.name;
      where version_parent = null;
      limit 100;
    `;
    const items = await queryIGDB('games', q);

    // Rank by "hotness"
    const ranked = [...(items ?? [])]
      .map((g: any) => ({ ...g, _hot: hotScore(g.total_rating, g.total_rating_count) }))
      // Prefer main games (category 0) when hot score ties
      .sort((a: any, b: any) => (b._hot - a._hot) || ((a.category === 0 ? 1 : 0) - (b.category === 0 ? 1 : 0)));

    // Return top 20
    return NextResponse.json({ items: ranked.slice(0, 20) });
  } catch (error) {
    console.error('Error in /api/igdb/search:', error);
    return NextResponse.json({ items: [] });
  }
}
