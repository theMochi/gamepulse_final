import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user?.hashedPassword) return null;
        const ok = await compare(creds.password, user.hashedPassword);
        return ok ? { id: user.id, email: user.email, name: user.username, image: user.image ?? undefined } : null;
      },
    }),
    // You can add Twitch/GitHub OAuth later
  ],
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) (session as any).userId = token.sub;
      return session;
    },
  },
};
