'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, schoolName });
      login(response.data.user, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_10px_rgba(249,115,22,0.4)]">V</div>
             <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Veda<span className="text-gray-500">AI</span></span>
           </div>
        </div>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 tracking-tight">Create a teacher account</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-orange-500 font-bold hover:text-orange-400">Sign in here</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSignup}>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl text-center">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">School / Organization Name</label>
              <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-sm font-medium bg-[#f8f9fa] text-gray-900" />
            </div>

            <div className="pt-2">
              <button disabled={loading} type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-[#1c1c1c] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition active:scale-95">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
