'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c1c1c] overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1c1c1c] rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={16} />
          </div>
          <span className="text-xl font-black tracking-tighter">VedaAI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition underline-offset-4 hover:underline">
            Member Login
          </Link>
          <Link href="/signup" className="bg-[#1c1c1c] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95">
            Start for Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-400/20 blur-[100px] rounded-full -z-10"></div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 shadow-sm animate-pulse">
            Introducing VedaAI 2.0
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-[#1c1c1c]">Assessments.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Elevate your teaching with professional AI-driven question papers. 
            Generate, manage, and deliver high-quality assignments in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/signup" className="w-full sm:w-auto bg-[#1c1c1c] text-white px-10 py-5 rounded-[24px] text-lg font-black hover:bg-black transition-all shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center justify-center group active:scale-95">
              <span>Get Started Now</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 rounded-[24px] border-2 border-gray-100 text-lg font-black text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center active:scale-95">
              Live Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { 
              icon: <Zap className="text-orange-500" size={24} />,
              title: "Instant Generation",
              desc: "From 10 to 100 questions, generate full assessment papers in under 60 seconds."
            },
            { 
              icon: <Shield className="text-green-500" size={24} />,
              title: "Cloud Persistence",
              desc: "Every paper, every student, every detailed response is safely stored on the cloud."
            },
            { 
              icon: <Sparkles className="text-purple-500" size={24} />,
              title: "Export Anywhere",
              desc: "Download professional PDF files ready for printing or direct student delivery."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-[32px] bg-white border border-gray-100/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-white group-hover:scale-110 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-extrabold mb-3 text-gray-900 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 py-12 px-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-gray-400">
        <p className="text-xs font-bold uppercase tracking-widest">&copy; 2026 VedaAI Systems. Built for educators.</p>
        <div className="flex space-x-6 mt-6 md:mt-0 text-xs font-bold">
          <Link href="#" className="hover:text-gray-900 transition uppercase tracking-widest">Privacy</Link>
          <Link href="#" className="hover:text-gray-900 transition uppercase tracking-widest">Terms</Link>
          <Link href="#" className="hover:text-gray-900 transition uppercase tracking-widest">Support</Link>
        </div>
      </footer>
    </div>
  );
}
