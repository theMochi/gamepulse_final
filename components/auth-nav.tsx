'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/profile/me"
          className="flex items-center space-x-2 text-zinc-600 hover:text-blue-600 transition-colors"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'Profile'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium">{session.user?.name}</span>
        </Link>
        <Link
          href="/settings"
          className="text-zinc-600 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Settings
        </Link>
        <button
          onClick={() => signOut()}
          className="text-zinc-600 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signin"
        className="text-zinc-600 hover:text-blue-600 transition-colors text-sm font-medium"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up
      </Link>
    </div>
  );
}
