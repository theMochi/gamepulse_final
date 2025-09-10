import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, ListType } from '@prisma/client';
import { ensureGameByIgdbId } from '@/lib/games';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { igdbId, type, action } = await req.json() as { 
    igdbId: number; 
    type: ListType; 
    action: 'add' | 'remove' 
  };
  
  const list = await prisma.list.findFirst({ 
    where: { userId: (session as any).userId, type } 
  });
  if (!list) return new Response('List not found', { status: 404 });
  
  const game = await ensureGameByIgdbId(igdbId);

  if (action === 'add') {
    await prisma.listEntry.upsert({
      where: { listId_gameId: { listId: list.id, gameId: game.id } },
      update: {},
      create: { listId: list.id, gameId: game.id },
    });
  } else {
    await prisma.listEntry.deleteMany({ 
      where: { listId: list.id, gameId: game.id } 
    });
  }
  
  return Response.json({ ok: true });
}
