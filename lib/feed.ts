import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function recentReviewsForFeed(userId?: string) {
  if (!userId) {
    return prisma.review.findMany({
      include: { 
        user: { select: { id: true, username: true, name: true, image: true } }, 
        game: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
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
      user: { select: { id: true, username: true, name: true, image: true } }, 
      game: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 40,
  });
  
  // weight by follower count
  return reviews.sort((a, b) => (score[b.userId] ?? 0) - (score[a.userId] ?? 0)).slice(0, 20);
}

export async function getTrendingReviews() {
  // Get reviews from the last 7 days with the most likes
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const reviews = await prisma.review.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      user: { select: { username: true, name: true } },
      game: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  });

  // Sort by engagement (likes + comments)
  return reviews
    .sort((a, b) => {
      const aEngagement = a._count.likes + a._count.comments;
      const bEngagement = b._count.likes + b._count.comments;
      return bEngagement - aEngagement;
    })
    .slice(0, 12);
}

export async function getFeaturedUsers() {
  // Get users with the most reviews and followers
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      _count: {
        select: {
          reviews: true,
          followers: true,
        },
      },
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: 20,
  });

  // Sort by total activity (reviews + followers)
  return users
    .filter(u => u._count.reviews > 0) // Only users with reviews
    .sort((a, b) => {
      const aActivity = a._count.reviews + a._count.followers;
      const bActivity = b._count.reviews + b._count.followers;
      return bActivity - aActivity;
    })
    .slice(0, 8);
}

export async function getRecentActivity() {
  // Get all types of recent activity: reviews, favorites, list additions
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      game: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return reviews;
}
