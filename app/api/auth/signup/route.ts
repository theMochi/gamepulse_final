import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  if (!email || !password || !username) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) return NextResponse.json({ error: 'Email or username in use' }, { status: 400 });

  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email, username, hashedPassword,
      lists: { create: [
        { type: 'BACKLOG', name: 'Backlog' },
        { type: 'PLAYED', name: 'Played' },
        { type: 'WISHLIST', name: 'Wishlist' },
      ]},
    },
  });
  return NextResponse.json({ ok: true, userId: user.id });
}
