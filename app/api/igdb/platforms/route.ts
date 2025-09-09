import { NextRequest, NextResponse } from 'next/server';
import { queryIGDB } from '@/lib/igdb';
import { z } from 'zod';

const PlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const query = `
      fields id,name,abbreviation;
      where category = 1;
      sort name asc;
      limit 200;
    `;

    const data = await queryIGDB('platforms', query);
    const platforms = z.array(PlatformSchema).parse(data);
    
    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Error in /api/igdb/platforms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
