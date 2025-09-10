import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');
  
  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
    select: { username: true }
  });
  
  if (!user) redirect('/auth/signin');
  
  redirect(`/profile/${user.username}`);
}
