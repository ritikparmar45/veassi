'use client';

import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full pt-4 pb-12 px-4"
    >
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-orange-100 overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{user?.name || 'Teacher'}</h1>
            <p className="text-gray-500 font-medium text-lg">{user?.schoolName || 'VedaAI Partner School'}</p>
            <p className="text-gray-400 text-sm mt-1">{user?.email || 'admin@school.com'}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-5 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Role</span>
              <span className="font-semibold text-gray-900">Administrator / Teacher</span>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Plan</span>
              <span className="inline-block bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs mt-1">Premium Plan</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
