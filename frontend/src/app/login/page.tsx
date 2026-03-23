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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess('OTP sent to your email!');
      setForgotStep(2);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
      setSuccess('Password reset successful! You can now login.');
      setView('login');
      setForgotStep(1);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP or session');
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
          {error && <div className="p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl text-center mb-6 border border-red-100">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-600 text-[13px] font-bold rounded-xl text-center mb-6 border border-green-100">{success}</div>}

          {view === 'login' ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Email address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm font-bold bg-gray-50/50 text-gray-900 transition-all" placeholder="name@school.com" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition tracking-tight">Forgot Password?</button>
                </div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm font-bold bg-gray-50/50 text-gray-900 transition-all" placeholder="••••••••" />
              </div>

              <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-full shadow-xl text-[15px] font-black text-white bg-[#1c1c1c] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-all active:scale-[0.98]">
                {loading ? 'Authenticating...' : 'Sign in'} <LogIn size={18} />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {forgotStep === 1 ? (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                   <p className="text-sm text-gray-500 font-medium px-1">Enter your registered email to receive a 6-digit verification code.</p>
                   <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Email address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm font-bold bg-gray-50/50 text-gray-900 transition-all" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-4 px-4 rounded-full shadow-lg text-sm font-black text-white bg-orange-500 hover:bg-orange-600 transition active:scale-[0.98]">
                    {loading ? 'Sending OTP...' : 'Send Recovery Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                   <p className="text-sm text-gray-500 font-medium px-1">Enter the OTP sent to <b>{email}</b> and set your new password.</p>
                   <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">6-Digit OTP</label>
                    <input type="text" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-center text-xl tracking-[10px] font-black bg-gray-50/50 text-gray-900 transition-all" placeholder="000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">New Password</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="appearance-none block w-full px-4 py-3.5 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm font-bold bg-gray-50/50 text-gray-900 transition-all" placeholder="Minimum 6 chars" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-4 px-4 rounded-full shadow-xl text-sm font-black text-white bg-black hover:bg-gray-900 transition active:scale-[0.98]">
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
              <button onClick={() => { setView('login'); setForgotStep(1); }} className="w-full text-sm font-bold text-gray-400 hover:text-gray-900 transition">Back to Login</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
