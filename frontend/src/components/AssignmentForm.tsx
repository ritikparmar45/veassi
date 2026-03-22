'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CloudUpload, Calendar, X, Plus, Mic, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AssignmentForm() {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [questionRows, setQuestionRows] = useState([
    { id: 1, type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: 2, type: 'Short Questions', count: 3, marks: 2 },
    { id: 3, type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: 4, type: 'Numerical Problems', count: 5, marks: 5 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalQuestions = questionRows.reduce((acc, row) => acc + row.count, 0);
  const totalMarks = questionRows.reduce((acc, row) => acc + (row.count * row.marks), 0);

  const handleUpdateRow = (id: number, field: string, value: any) => {
    setQuestionRows(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const handleRemoveRow = (id: number) => {
    setQuestionRows(rows => rows.filter(r => r.id !== id));
  };
  const handleAddRow = () => {
    setQuestionRows([...questionRows, { id: Date.now(), type: 'New Question Type', count: 1, marks: 1 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate || questionRows.length === 0) {
      setError('Please provide a due date and at least one question type.');
      return;
    }
    
    // Flatten question types into an array of strings as expected by backend initially
    // or handle it properly:
    const finalQuestionTypes = questionRows.map(r => r.type);
    
    // Construct rich instructions merging user context with exactly how many questions requested
    let structureDetails = 'Requested breakdown: \n';
    questionRows.forEach(r => {
      structureDetails += `- ${r.count} ${r.type} (each worth ${r.marks} marks)\n`;
    });
    const finalInstructions = `${structureDetails}\nAdditional context: ${instructions || 'None.'}`;

    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/assignment`, {
        dueDate, 
        questionTypes: finalQuestionTypes, 
        numQuestions: totalQuestions, 
        marks: totalMarks, 
        instructions: finalInstructions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const assignmentId = response.data.assignmentId;
      router.push(`/assignment/${assignmentId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Submission failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 lg:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 max-w-3xl">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Assignment Details</h3>
        <p className="text-xs text-gray-400 mt-1">Basic information about your assignment</p>
      </div>

      {error && <div className="p-3 mb-6 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-8 flex flex-col items-center justify-center text-center mb-3 hover:bg-gray-50 transition cursor-pointer">
        <CloudUpload className="text-gray-800 mb-3" size={24} />
        <h4 className="font-semibold text-gray-900 text-[13px]">Choose a file or drag & drop it here</h4>
        <p className="text-[10px] text-gray-400 mt-1 mb-4">JPEG, PNG, upto 10MB</p>
        <button type="button" className="px-5 py-2 rounded-full border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition">
          Browse Files
        </button>
      </div>
      <p className="text-[10px] text-center text-gray-400 mb-8 max-w-[200px] mx-auto">Upload images of your preferred document/image</p>

      {/* Due Date */}
      <div className="mb-8 pl-1">
        <label className="block text-xs font-bold text-gray-900 mb-3">Due Date</label>
        <div className="relative">
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-[#f8f9fa] border-none rounded-2xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-gray-200 text-gray-700 outline-none font-medium text-gray-500 uppercase"
          />
          <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Question Types - Desktop Layout mostly */}
      <div className="mb-4 pl-1 hidden sm:flex items-center text-[11px] font-bold text-gray-900 mb-3 px-2">
        <div className="flex-1">Question Type</div>
        <div className="w-32 text-center">No. of Questions</div>
        <div className="w-24 text-center">Marks</div>
      </div>

      <div className="space-y-3 mb-6">
        {questionRows.map((row) => (
           <div key={row.id} className="flex flex-col sm:flex-row items-center gap-3 bg-white sm:bg-transparent border border-gray-100 sm:border-none rounded-[24px] sm:rounded-none p-4 sm:p-0 shadow-sm sm:shadow-none relative">
            
            {/* Pick question type */}
            <div className="relative flex-1 w-full bg-[#f8f9fa] rounded-full">
              <select 
                value={row.type}
                onChange={(e) => handleUpdateRow(row.id, 'type', e.target.value)}
                className="w-full appearance-none bg-transparent border-none rounded-full py-3 pl-5 pr-10 text-[13px] font-semibold text-gray-700 outline-none"
              >
                <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                <option value="Short Questions">Short Questions</option>
                <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                <option value="Numerical Problems">Numerical Problems</option>
                <option value="New Question Type">New Question Type</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M1 1l4 4 4-4"/></svg>
              </div>
            </div>
            
            <button type="button" onClick={() => handleRemoveRow(row.id)} className="hidden sm:flex items-center justify-center text-gray-400 hover:text-red-500 px-1 absolute -right-6">
              <X size={14} />
            </button>
            <button type="button" onClick={() => handleRemoveRow(row.id)} className="sm:hidden absolute top-4 right-4 text-gray-300 hover:text-red-500">
               <X size={14} />
            </button>

            {/* Steppers */}
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 mt-1 sm:mt-0">
               <div className="flex flex-col sm:hidden items-center justify-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">No. of Qs</span>
                  <div className="flex items-center justify-between bg-[#f8f9fa] rounded-full px-3 py-2 w-full max-w-[120px]">
                    <button type="button" onClick={() => handleUpdateRow(row.id, 'count', Math.max(1, row.count - 1))} className="text-gray-400 font-bold px-2">-</button>
                    <span className="text-sm font-bold text-gray-900">{row.count}</span>
                    <button type="button" onClick={() => handleUpdateRow(row.id, 'count', row.count + 1)} className="text-gray-400 font-bold px-2">+</button>
                  </div>
               </div>

               <div className="hidden sm:flex items-center justify-between bg-[#f8f9fa] rounded-full px-3 py-2.5 w-32">
                 <button type="button" onClick={() => handleUpdateRow(row.id, 'count', Math.max(1, row.count - 1))} className="text-gray-400 hover:text-gray-900 font-bold px-2">-</button>
                 <span className="text-sm font-bold text-gray-900">{row.count}</span>
                 <button type="button" onClick={() => handleUpdateRow(row.id, 'count', row.count + 1)} className="text-gray-400 hover:text-gray-900 font-bold px-2">+</button>
               </div>

               <div className="flex flex-col sm:hidden items-center justify-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Marks</span>
                  <div className="flex items-center justify-between bg-[#f8f9fa] rounded-full px-3 py-2 w-full max-w-[120px]">
                    <button type="button" onClick={() => handleUpdateRow(row.id, 'marks', Math.max(1, row.marks - 1))} className="text-gray-400 font-bold px-2">-</button>
                    <span className="text-sm font-bold text-gray-900">{row.marks}</span>
                    <button type="button" onClick={() => handleUpdateRow(row.id, 'marks', row.marks + 1)} className="text-gray-400 font-bold px-2">+</button>
                  </div>
               </div>
               
               <div className="hidden sm:flex items-center justify-between bg-[#f8f9fa] rounded-full px-3 py-2.5 w-24">
                 <button type="button" onClick={() => handleUpdateRow(row.id, 'marks', Math.max(1, row.marks - 1))} className="text-gray-400 hover:text-gray-900 font-bold px-2">-</button>
                 <span className="text-sm font-bold text-gray-900">{row.marks}</span>
                 <button type="button" onClick={() => handleUpdateRow(row.id, 'marks', row.marks + 1)} className="text-gray-400 hover:text-gray-900 font-bold px-2">+</button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddRow} className="flex items-center space-x-2 text-[11px] font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition w-fit mb-8 shadow-sm border border-gray-100">
        <div className="bg-[#1c1c1c] text-white rounded-full p-0.5"><Plus size={12} strokeWidth={3} /></div>
        <span>Add Question Type</span>
      </button>

      <div className="flex flex-col items-end text-[11px] font-bold text-gray-800 mb-10 px-2 space-y-1">
        <div>Total Questions : {totalQuestions}</div>
        <div>Total Marks : {totalMarks}</div>
      </div>

      {/* Additional Instructions */}
      <div className="mb-12 pl-1">
        <label className="block text-xs font-bold text-gray-900 mb-3">Additional Information (For better output)</label>
        <div className="relative">
          <textarea 
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            className="w-full bg-[#f8f9fa] border border-gray-200 border-dashed rounded-[24px] py-4 px-5 text-[13px] font-medium focus:ring-2 focus:ring-gray-300 text-gray-700 outline-none resize-none placeholder-gray-400"
          />
          <button type="button" className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition">
            <Mic size={16} />
          </button>
        </div>
      </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 flex items-center space-x-2 transition"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-8 py-2.5 rounded-full bg-[#1c1c1c] text-white font-bold hover:bg-black flex items-center space-x-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] disabled:opacity-70 transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Generating (takes ~10s)...
              </span>
            ) : (
              <>
                <span>Generate Assignment</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

    </form>
  );
}
