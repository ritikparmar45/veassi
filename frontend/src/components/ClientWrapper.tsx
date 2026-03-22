'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <main className="flex-1 w-full h-screen bg-[#f8f9fa]">{children}</main>;
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
