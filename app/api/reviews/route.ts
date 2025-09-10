import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { ensureGameByIgdbId } from '@/lib/games';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { igdbId, rating, title, body } = await req.json();
  
  // Validate rating is between 0 and 10
  if (rating < 0 || rating > 10) {
    return new Response('Rating must be between 0 and 10', { status: 400 });
  }
  const game = await ensureGameByIgdbId(igdbId);
  
  const review = await prisma.review.upsert({
    where: { userId_gameId: { userId: (session as any).userId, gameId: game.id } },
    update: { rating, title, body },
    create: { 
      userId: (session as any).userId, 
      gameId: game.id, 
      rating, 
      title, 
      body 
    },
  });
  
  return Response.json({ ok: true, review });
}
