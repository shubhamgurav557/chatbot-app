'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProfileHeader from '../components/ProfileHeader';

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-4xl flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">ChatCodeGen</h1>
        <nav>
          {status === 'unauthenticated' ? (
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Login
            </Link>
          ) : 
          (
            <ProfileHeader />
          )}
        </nav>
      </header>
      <main className="text-center mt-16">
        <h1 className="text-4xl font-extrabold text-gray-800">Generate Beautiful Landing Pages</h1>
        <p className="text-lg text-gray-600 mt-4">
          Build and preview HTML & CSS code effortlessly. No coding required!
        </p>
        <div className="mt-8 flex justify-center">
          {status === 'unauthenticated' ? (
            <Link href="/auth/signup">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          ) : (
            <Link href="/chatbox">
              <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                Open ChatBox
              </button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
