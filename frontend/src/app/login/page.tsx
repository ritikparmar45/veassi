'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(response.data.user, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_10px_rgba(249,115,22,0.4)]">V</div>
             <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Veda<span className="text-gray-500">AI</span></span>
           </div>
        </div>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or <Link href="/signup" className="text-orange-500 font-bold hover:text-orange-400">create a new account</Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl text-center">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
              <div className="mt-1">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
              </div>
            </div>

            <div>
              <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-[#1c1c1c] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition active:scale-95">
                {loading ? 'Signing in...' : 'Sign in'} <LogIn size={16} />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
