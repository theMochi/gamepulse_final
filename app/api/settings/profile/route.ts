import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const { username, email, bio, image, password } = await req.json();
  const userId = (session as any).userId;
  
  const updateData: any = {};
  
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (bio !== undefined) updateData.bio = bio;
  if (image !== undefined) updateData.image = image;
  if (password) updateData.hashedPassword = await hash(password, 10);
  
  // Check if username/email is already taken by another user
  if (username || email) {
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          { OR: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]}
        ]
      }
    });
    
    if (existing) {
      return new Response('Username or email already in use', { status: 400 });
    }
  }
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, username: true, email: true, bio: true, image: true }
  });
  
  return Response.json({ ok: true, user });
}
