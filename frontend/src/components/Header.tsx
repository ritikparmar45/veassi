'use client';

import { ArrowLeft, Bell, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#f3f4f6]">
      <div className="flex items-center text-gray-600">
        <button className="mr-3 hover:bg-gray-200 p-1.5 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2">
          {/* Faint grid icon beside text */}
          <div className="grid grid-cols-2 gap-0.5 opacity-50">
             <div className="w-1.5 h-1.5 bg-gray-500 rounded-sm"></div>
             <div className="w-1.5 h-1.5 bg-gray-500 rounded-sm"></div>
             <div className="w-1.5 h-1.5 bg-gray-500 rounded-sm"></div>
             <div className="w-1.5 h-1.5 bg-gray-500 rounded-sm"></div>
          </div>
          <h1 className="font-medium text-gray-800">Assignment</h1>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <Link href="/notifications" className="relative text-gray-500 hover:text-gray-800 transition">
          <Bell size={20} />
          <span className="absolute 0 right-0 top-0 w-2 h-2 bg-orange-500 border border-white rounded-full"></span>
        </Link>

        <Link href="/profile" className="flex items-center space-x-2 cursor-pointer p-1.5 bg-white rounded-full pr-4 shadow-sm hover:bg-gray-50 transition">
          <div className="w-7 h-7 rounded-full bg-blue-100 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mounted ? user?.name || 'User' : 'User'}`} alt="User" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{mounted ? user?.name || 'Teacher' : 'Teacher'}</span>
          <ChevronDown size={14} className="text-gray-400 shrink-0" />
        </Link>
      </div>
    </header>
  );
}
