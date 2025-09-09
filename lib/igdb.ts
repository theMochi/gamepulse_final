import { getTwitchAppAccessToken } from './twitch';
import { z } from 'zod';

// Simplified and more permissive IGDB schemas
export const IGDBGameSchema = z.object({
  id: z.number(),
  name: z.string(),
  cover: z.object({
    image_id: z.string(),
  }).optional(),
  first_release_date: z.number().optional(),
  total_rating: z.number().optional(),
  total_rating_count: z.number().optional(),
  genres: z.array(z.object({
    id: z.number().optional(),
    name: z.string().optional(),
  })).optional(),
  platforms: z.array(z.object({
    id: z.number().optional(),
    name: z.string().optional(),
    abbreviation: z.string().optional(),
  })).optional(),
  involved_companies: z.array(z.object({
    company: z.object({
      id: z.number().optional(),
      name: z.string().optional(),
    }).optional(),
    developer: z.boolean().optional(),
  })).optional(),
  summary: z.string().optional(),
  screenshots: z.array(z.object({
    image_id: z.string().optional(),
  })).optional(),
  videos: z.array(z.object({
    video_id: z.string().optional(),
  })).optional(),
  websites: z.array(z.object({
    url: z.string().optional(),
    category: z.number().optional(),
  })).optional(),
}).passthrough(); // Allow additional fields

export const IGDBPlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
}).passthrough();

export type IGDBGame = z.infer<typeof IGDBGameSchema>;
export type IGDBPlatform = z.infer<typeof IGDBPlatformSchema>;

export async function queryIGDB(endpoint: string, query: string): Promise<any> {
  const token = await getTwitchAppAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!clientId) {
    throw new Error('TWITCH_CLIENT_ID must be set');
  }

  try {
    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: query,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`IGDB API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying IGDB:', error);
    throw error;
  }
}

export async function getFeaturedGames(): Promise<any[]> {
  const query = `
    fields id,name,cover.image_id,first_release_date,total_rating,total_rating_count,platforms.id,platforms.name,platforms.abbreviation,genres.id,genres.name,summary;
    where first_release_date >= 1735689600 & first_release_date < 1767225600 & total_rating != null;
    sort total_rating desc;
    limit 24;
  `;

  const data = await queryIGDB('games', query);
  return data || [];
}

export async function getTopGames(): Promise<any[]> {
  const query = `
    fields id,name,cover.image_id,total_rating,total_rating_count,platforms.id,platforms.name,platforms.abbreviation,genres.id,genres.name,summary,first_release_date;
    where total_rating != null & total_rating_count != null;
    sort total_rating_count desc;
    limit 200;
  `;

  const data = await queryIGDB('games', query);
  return data || [];
}

export async function getComingSoonGames(): Promise<any[]> {
  const now = Math.floor(Date.now() / 1000);
  const query = `
    fields id,name,cover.image_id,first_release_date,platforms.id,platforms.name,platforms.abbreviation,genres.id,genres.name,summary,total_rating,total_rating_count;
    where first_release_date >= 1735689600 & first_release_date < 1767225600 & first_release_date > ${now};
    sort first_release_date asc;
    limit 50;
  `;

  const data = await queryIGDB('games', query);
  return data || [];
}

export async function searchGames(filters: {
  minRating?: number;
  dateFrom?: number;
  dateTo?: number;
  platforms?: number[];
  genres?: number[];
  developer?: string;
  sort?: 'rating' | 'reviews' | 'release_date' | 'title';
  limit?: number;
  offset?: number;
}): Promise<IGDBGame[]> {
  let whereClause = '';
  const conditions: string[] = [];

  if (filters.minRating) {
    conditions.push(`total_rating >= ${filters.minRating}`);
  }

  if (filters.dateFrom && filters.dateTo) {
    conditions.push(`first_release_date >= ${filters.dateFrom} & first_release_date <= ${filters.dateTo}`);
  }

  if (filters.platforms && filters.platforms.length > 0) {
    conditions.push(`platforms = (${filters.platforms.join(',')})`);
  }

  if (filters.genres && filters.genres.length > 0) {
    conditions.push(`genres = (${filters.genres.join(',')})`);
  }

  if (filters.developer) {
    conditions.push(`involved_companies.company.name ~ *"${filters.developer}"*`);
  }

  if (conditions.length > 0) {
    whereClause = `where ${conditions.join(' & ')};`;
  }

  let sortClause = '';
  switch (filters.sort) {
    case 'rating':
      sortClause = 'sort total_rating desc;';
      break;
    case 'reviews':
      sortClause = 'sort total_rating_count desc;';
      break;
    case 'release_date':
      sortClause = 'sort first_release_date desc;';
      break;
    case 'title':
      sortClause = 'sort name asc;';
      break;
    default:
      sortClause = 'sort total_rating desc;';
  }

  const limit = filters.limit || 20;
  const offset = filters.offset || 0;

  const query = `
    fields id,name,cover.image_id,first_release_date,total_rating,total_rating_count,platforms.name,platforms.abbreviation,genres.name,summary,involved_companies.company.name;
    ${whereClause}
    ${sortClause}
    limit ${limit};
    offset ${offset};
  `;

  const data = await queryIGDB('games', query);
  return data || [];
}

export async function getPlatforms(): Promise<any[]> {
  const query = `
    fields id,name,abbreviation;
    where category = 1;
    sort name asc;
    limit 100;
  `;

  const data = await queryIGDB('platforms', query);
  return data || [];
}

export async function getGenres(): Promise<any[]> {
  const query = `
    fields id,name;
    sort name asc;
    limit 50;
  `;

  const data = await queryIGDB('genres', query);
  return data || [];
}

export async function getGameById(id: number): Promise<any | null> {
  const query = `
    fields id,name,summary,first_release_date,total_rating,total_rating_count,
    genres.id,genres.name,platforms.id,platforms.name,platforms.abbreviation,
    involved_companies.company.id,involved_companies.company.name,involved_companies.developer,
    cover.image_id,screenshots.image_id,videos.video_id,websites.url,websites.category;
    where id = ${id};
    limit 1;
  `;

  const data = await queryIGDB('games', query);
  const games = data || [];
  return games.length > 0 ? games[0] : null;
}
