import { PrismaClient } from '@prisma/client';
import { queryIGDB } from '@/lib/igdb';

const prisma = new PrismaClient();

export async function ensureGameByIgdbId(igdbId: number) {
  const existing = await prisma.game.findUnique({ where: { igdbId } });
  if (existing) return existing;
  
  const q = `
    fields id,name,summary,cover.image_id;
    where id = ${igdbId};
    limit 1;
  `;
  const [g] = await queryIGDB('games', q);
  if (!g) throw new Error('IGDB game not found');
  
  return prisma.game.create({
    data: { 
      igdbId: g.id, 
      name: g.name, 
      summary: g.summary ?? null, 
      coverId: g.cover?.image_id ?? null 
    },
  });
}
