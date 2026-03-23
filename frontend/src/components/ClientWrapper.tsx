'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';
  const isPublicPage = isAuthPage || isLandingPage;

  useEffect(() => {
    // Small delay to ensure Zustand has hydrated from localStorage if applicable
    const timer = setTimeout(() => {
      if (!token && !isPublicPage) {
        router.push('/login');
      } else if (token && isAuthPage) {
        router.push('/dashboard');
      } else if (token && isLandingPage) {
        router.push('/dashboard');
      }
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [token, isAuthPage, router]);

  // Prevent flickering while checking auth
  if (!isLoaded && !isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  // Public pages (Login, Signup, Landing) don't get the Sidebar/Header
  if (isPublicPage) {
    return <main className="flex-1 w-full min-h-screen bg-[#f8f9fa]">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 w-full h-screen">
        <Header />
        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          {children}
        </main>
      </div>
    </>
  );
}
