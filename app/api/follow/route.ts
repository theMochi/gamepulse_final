import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { targetUserId, action } = await req.json();
  
  if (action === 'follow') {
    await prisma.follow.upsert({
      where: { 
        followerId_followingId: { 
          followerId: (session as any).userId, 
          followingId: targetUserId 
        } 
      },
      update: {},
      create: { 
        followerId: (session as any).userId, 
        followingId: targetUserId 
      },
    });
  } else {
    await prisma.follow.deleteMany({ 
      where: { 
        followerId: (session as any).userId, 
        followingId: targetUserId 
      } 
    });
  }
  
  return Response.json({ ok: true });
}
