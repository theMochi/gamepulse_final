import { NextRequest, NextResponse } from 'next/server';
import { queryIGDB } from '@/lib/igdb';
import { z } from 'zod';

const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const query = `
      fields id,name;
      sort name asc;
      limit 200;
    `;

    const data = await queryIGDB('genres', query);
    const genres = z.array(GenreSchema).parse(data);
    
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error in /api/igdb/genres:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
