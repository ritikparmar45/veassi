'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Question {
  _id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

interface Section {
  _id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export default function PaperOutput({ assignmentId }: { assignmentId: string }) {
  const { token, user } = useAuthStore();
  const [status, setStatus] = useState<string>('connecting');
  const [message, setMessage] = useState<string>('Initializing connection...');
  const [sections, setSections] = useState<Section[] | null>(null);
  const [assignment, setAssignment] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    // Initial fetch
    axios.get(`${API_URL}/assignment/${assignmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setAssignment(res.data.assignment);
        if (res.data.result) {
          setSections(res.data.result);
          setStatus('completed');
          setMessage('Done!');
        } else if (res.data.assignment.status === 'failed') {
          setStatus('failed');
          setMessage('Assignment generation failed.');
        } else {
          // Fallback if Vercel somehow disconnected prematurely
          setStatus('completed');
          setMessage('Assignment partially processed, please try regenerating.');
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage('Failed to fetch assignment details.');
      });
  }, [assignmentId, token]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (status === 'error') {
    return <div className="text-red-500 text-center py-20 bg-white rounded-3xl mt-4"><AlertCircle className="w-10 h-10 mx-auto mb-2" />{message}</div>;
  }

  if (status !== 'completed' && !sections) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-32 bg-[#4a4a4a] -m-6 rounded-tl-[40px] rounded-bl-3xl min-h-[calc(100vh-100px)]"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-[#383838] p-10 rounded-[32px] shadow-xl text-center max-w-sm"
        >
          <RefreshCw className="w-10 h-10 text-orange-400 animate-spin mb-6 mx-auto" />
          <h2 className="text-xl font-bold mb-3 text-white">Generating Assessment...</h2>
          <p className="text-gray-300 text-sm mb-6">{message}</p>
          <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "66%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="h-full bg-orange-500 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#4a4a4a] min-h-[calc(100vh-64px)] p-4 md:p-8 -m-6 md:rounded-tl-[40px] shadow-inner pb-24 md:pb-8"
    >
       <div className="max-w-4xl mx-auto">
         
         <div className="bg-[#383838] rounded-[24px] p-6 text-white mb-6 shadow-md border border-[#555]">
            <p className="text-[14px] leading-relaxed mb-5 font-medium text-gray-100">
               Certainly! Here is your customized Question Paper for your classes based on the instructions:
               <span className="opacity-70 mt-1 block italic">{assignment?.instructions || 'Standard assignment generation.'}</span>
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadPDF}
                className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-sm"
              >
                <Download size={16} strokeWidth={2.5}/>
                <span>Download as PDF</span>
              </button>
            </div>
         </div>

         {/* Paper wrapper for html2canvas */}
         <div className="bg-white rounded-[32px] p-8 md:p-14 text-gray-900 shadow-xl print:m-0 print:rounded-none" id="paper-content">
            <div className="text-center mb-8">
               <h1 className="text-2xl font-bold tracking-normal text-gray-900 mb-1">{user?.schoolName || 'VedaAI Partner School'}</h1>
               <div className="text-sm font-medium text-gray-800 space-y-0.5 mt-2">
                 <p>Subject: {assignment?.questionTypes?.[0] || 'Assessment'}</p>
                 <p>Class: N/A</p>
               </div>
            </div>

            <div className="flex justify-between items-center text-[13px] font-bold text-gray-900 mb-6">
               <span>Time Allowed: 45 minutes</span>
               <span>Maximum Marks: {assignment?.marks || '20'}</span>
            </div>

            <p className="text-[13px] font-bold text-gray-900 mb-6">All questions are compulsory unless stated otherwise.</p>

            <div className="space-y-4 mb-10 text-[13px] font-bold text-gray-900">
               <div className="flex items-end">
                  <span className="w-14">Name: </span>
                  <div className="border-b border-gray-600 flex-1 max-w-[200px] ml-1"></div>
               </div>
               <div className="flex items-end">
                  <span className="w-24">Roll Number: </span>
                  <div className="border-b border-gray-600 flex-1 max-w-[200px] ml-1"></div>
               </div>
               <div className="flex items-end">
                  <span>Class: 5th &nbsp;&nbsp; Section: </span>
                  <div className="border-b border-gray-600 flex-1 max-w-[120px] ml-1"></div>
               </div>
            </div>

            <div className="text-center mb-8">
               <h2 className="text-[15px] font-bold text-gray-900">Section A</h2>
            </div>
            
            {/* Sections generated by AI */}
            <div className="space-y-10">
               {sections?.map((section, sIdx) => (
                 <div key={sIdx}>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-[12px] italic text-gray-600 mb-6">{section.instruction}</p>
                    
                    <div className="space-y-5">
                      {section.questions.map((q, qIdx) => {
                         const diffLabel = q.difficulty === 'easy' ? 'Easy' : q.difficulty === 'medium' ? 'Moderate' : 'Challenging';
                         return (
                           <div key={qIdx} className="flex gap-2 text-[13px] text-gray-800 leading-relaxed font-medium">
                              <span className="shrink-0">{qIdx + 1}.</span>
                              <p>
                                [{diffLabel}] {q.text} [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                              </p>
                           </div>
                         )
                      })}
                    </div>
                 </div>
               ))}
               
               <div className="text-[13px] font-bold text-gray-900 mt-12 mb-4 text-left">
                 End of Question Paper
               </div>
            </div>
         </div>

       </div>
    </motion.div>
  );
}
