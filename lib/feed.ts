import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function recentReviewsForFeed(userId?: string) {
  if (!userId) {
    return prisma.review.findMany({
      include: { 
        user: { select: { id: true, username: true, image: true } }, 
        game: true 
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
  
  const follows = await prisma.follow.findMany({ 
    where: { followerId: userId }, 
    select: { followingId: true } 
  });
  const ids = follows.map(f => f.followingId);
  
  if (!ids.length) return recentReviewsForFeed(undefined);

  // top-followed users first
  const counts = await prisma.follow.groupBy({ 
    by: ['followingId'], 
    _count: { _all: true }, 
    where: { followingId: { in: ids } } 
  });
  const score = Object.fromEntries(counts.map(c => [c.followingId, c._count._all]));
  
  const reviews = await prisma.review.findMany({
    where: { userId: { in: ids } },
    include: { 
      user: { select: { id: true, username: true, image: true } }, 
      game: true 
    },
    orderBy: { createdAt: 'desc' },
    take: 40,
  });
  
  // weight by follower count
  return reviews.sort((a, b) => (score[b.userId] ?? 0) - (score[a.userId] ?? 0)).slice(0, 10);
}
