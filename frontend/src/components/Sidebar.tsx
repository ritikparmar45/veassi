'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutGrid, Users, FileText, Wrench, Library, Settings, Plus, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: LayoutGrid },
    { name: 'My Groups', href: '/groups', icon: Users },
    { name: 'Assignments', href: '/', icon: FileText, activeOverride: true }, // For demo, highlighting Assignments
    { name: "AI Teacher's Toolkit", href: '/toolkit', icon: Wrench },
    { name: 'My Library', href: '/library', icon: Library },
  ];

  return (
    <>
    <aside className="w-64 h-screen bg-white hidden md:flex flex-col border-r border-gray-200 fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
          V
        </div>
        <span className="text-xl font-bold text-gray-900">VedaAI</span>
      </div>

      {/* Action Button */}
      <div className="px-5 mb-8">
        <Link href="/create" className="w-full flex items-center justify-center space-x-2 bg-[#1c1c1c] text-white py-2.5 rounded-full ring-2 ring-orange-500 ring-offset-2 hover:bg-black transition shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          <Plus size={18} />
          <span className="font-medium text-sm">Create Assignment</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.activeOverride || pathname === item.href && !item.activeOverride;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={isActive ? 'text-gray-700' : 'text-gray-400'} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-3">
        <Link href="/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 mb-2 transition-colors">
          <Settings size={18} className="text-gray-400" />
          <span className="text-sm">Settings</span>
        </Link>
        <div className="flex items-center p-3 bg-gray-100 rounded-xl mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-200 overflow-hidden mr-3 flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mounted ? user?.schoolName || 'School' : 'School'}`} alt="School" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 truncate">{mounted ? user?.schoolName || 'VedaAI User' : 'VedaAI User'}</span>
            <span className="text-xs text-gray-500 truncate">{mounted ? user?.name || 'Teacher' : 'Teacher'}</span>
          </div>
        </div>

        <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>

    {/* Mobile Floating Action Button */}
    <div className="md:hidden fixed bottom-24 right-4 z-50">
      <Link href="/create" className="flex items-center justify-center w-14 h-14 bg-white text-orange-500 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100">
        <Plus size={24} />
      </Link>
    </div>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1c1c1c] text-gray-400 rounded-2xl flex justify-between items-center px-6 py-3.5 z-50 shadow-2xl">
      <Link href="/" className="flex flex-col items-center space-y-1 hover:text-white transition">
        <LayoutGrid size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/" className="flex flex-col items-center space-y-1 text-white relative">
        <div className="absolute -top-3.5 w-8 h-1 bg-white rounded-b-md"></div>
        <FileText size={20} />
        <span className="text-[10px] font-medium">Assignments</span>
      </Link>
      <Link href="/library" className="flex flex-col items-center space-y-1 hover:text-white transition">
        <Library size={20} />
        <span className="text-[10px] font-medium">Library</span>
      </Link>
      <Link href="/toolkit" className="flex flex-col items-center space-y-1 hover:text-white transition">
        <Wrench size={20} />
        <span className="text-[10px] font-medium">AI Toolkit</span>
      </Link>
    </nav>
    </>
  );
}
