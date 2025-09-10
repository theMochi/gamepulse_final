import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { ensureGameByIgdbId } from '@/lib/games';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { igdbId, action } = await req.json();
  const game = await ensureGameByIgdbId(igdbId);
  
  if (action === 'add') {
    await prisma.favorite.upsert({
      where: { userId_gameId: { userId: (session as any).userId, gameId: game.id } },
      update: {},
      create: { userId: (session as any).userId, gameId: game.id },
    });
  } else {
    await prisma.favorite.deleteMany({ 
      where: { userId: (session as any).userId, gameId: game.id } 
    });
  }
  
  return Response.json({ ok: true });
}
