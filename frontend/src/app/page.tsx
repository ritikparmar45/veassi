'use client';

import Link from 'next/link';
import { Plus, SearchX, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center max-w-lg mx-auto">
      {/* Decorative Image/Icon */}
      <div className="relative mb-8 w-48 h-48 flex items-center justify-center">
        {/* Abstract background blob for decorative feel */}
        <div className="absolute inset-0 bg-gray-100 rounded-full scale-110"></div>
        
        {/* Document Icon Graphic */}
        <div className="relative bg-white rounded-xl flex flex-col space-y-3 items-center pt-6 shadow-sm border border-gray-100 p-4 w-28 h-36">
          <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-12 h-2 bg-gray-200 rounded-full self-start ml-2"></div>
          <div className="w-16 h-2 bg-gray-200 rounded-full self-start ml-2"></div>
          <div className="w-10 h-2 bg-gray-200 rounded-full self-start ml-2"></div>
          <div className="w-14 h-2 bg-gray-200 rounded-full self-start ml-2"></div>
          
          {/* Magnifying Glass with X overlay */}
          <div className="absolute -bottom-5 -right-5 bg-[#e9e6fd] text-red-500 rounded-full p-2.5 shadow-sm ring-4 ring-white flex items-center justify-center">
             <div className="bg-red-500 rounded-full p-1.5 flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </div>
             <div className="absolute top-full left-full -mt-2 -ml-2 w-5 h-5 border-t-4 border-l-4 border-transparent border-b-4 border-r-4 border-b-[#c4b5fd] border-r-transparent rotate-45 rounded-full scale-150 transform translate-x-1 translate-y-1"></div>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 -left-6 text-gray-600 rotate-[15deg]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"/></svg>
        </div>
        <div className="absolute top-16 right-0 text-gray-300">
           <div className="w-8 h-4 border-2 border-gray-200 rounded-sm flex items-center px-1 space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
           </div>
        </div>
        <div className="absolute bottom-12 left-0 text-blue-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
        </div>
        <div className="absolute bottom-4 right-6 text-blue-600">
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-80"></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No assignments yet</h2>
      
      <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-lg px-4">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link 
        href="/create" 
        className="flex items-center space-x-2 bg-[#1c1c1c] text-white px-6 py-3.5 text-sm rounded-full hover:bg-black transition-colors shadow-lg"
      >
        <Plus size={18} />
        <span className="font-medium">Create Your First Assignment</span>
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    
    axios.get(`${API_URL}/assignment`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setAssignments(res.data.assignments || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      if(err.response?.status === 401) {
         useAuthStore.getState().logout();
         router.push('/login');
      }
      setLoading(false);
    });
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
         <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (assignments.length === 0) {
     return <EmptyState />;
  }

  return (
    <div className="relative min-h-full flex flex-col pb-24 md:pb-6 max-w-7xl mx-auto">
      {/* Header text and green dot */}
      <div className="mb-6 px-1">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Assignments</h2>
        </div>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Manage and create assignments for your classes.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 text-sm px-1">
        <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-700 transition w-fit">
          <Filter size={16} />
          <span className="font-medium">Filter By</span>
        </button>
        <div className="relative w-full md:w-80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-full hidden md:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Assignment" 
            className="w-full bg-white border border-gray-100 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-200 transition text-gray-700 font-medium placeholder-gray-300"
          />
        </div>
        {/* Mobile Search Input */}
        <div className="relative w-full shadow-sm rounded-full md:hidden">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Name" 
            className="w-full bg-white border border-gray-100 rounded-full py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-200 transition text-gray-700 text-sm placeholder-gray-300"
          />
        </div>
      </div>

      {/* Grid of Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 px-1">
        {assignments.map((assignment) => (
          <div 
            key={assignment._id} 
            onClick={() => router.push(`/assignment/${assignment._id}`)}
            className="bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col justify-between min-h-[140px] md:min-h-[160px] cursor-pointer hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-[17px] md:text-[19px] font-extrabold text-[#2a2a2a] tracking-tight truncate">{assignment.instructions?.split('\\n')[0].replace('Requested breakdown: ', '') || 'Generated Paper'}</h3>
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${assignment.status === 'completed' ? 'bg-green-100 text-green-700' : assignment.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                {assignment.status}
              </div>
            </div>
            
            <div className="flex items-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide mt-8">
              <span className="mr-4">
                Created : <span className="text-gray-600 ml-1 font-extrabold">{new Date(assignment.createdAt).toLocaleDateString()}</span>
              </span>
              <span>
                Due : <span className="text-gray-600 ml-1 font-extrabold">{new Date(assignment.dueDate).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Create Assignment Button at Bottom */}
      <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center justify-center pointer-events-none">
        <Link href="/create" className="flex items-center space-x-2 bg-[#1c1c1c] text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-black transition-all hover:scale-105 active:scale-95 pointer-events-auto">
          <Plus size={18} />
          <span className="font-medium text-sm">Create Assignment</span>
        </Link>
      </div>
    </div>
  );
}
