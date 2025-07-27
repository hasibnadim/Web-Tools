'use client';

import { BookOpen, ScanSearch, Brain, Waves } from 'lucide-react';
import Link from 'next/link';

export default function AiPage() {




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-blue-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-28 h-28 bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-4 py-2 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - Compact */}
          <div className="mb-3 md:mb-5">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
              {/* Right: Intelligence Link */}
              <Link
                href="/ocean"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-700 to-blue-700 text-white font-semibold rounded-xl shadow hover:from-purple-800 hover:to-blue-800 transition-all text-xs border border-[#2d1e4d]"
                title="Go to Ocean of Intelligence"
              >
                <span className="flex items-center justify-center bg-gradient-to-br from-blue-700 to-purple-700 rounded-full p-1 ml-1">
                  <svg className="w-4 h-4 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <span className="font-semibold">
                  حكمة<span className="mx-1 text-purple-400 font-normal">|</span> Hikma
                </span>
                <span className="flex items-center justify-center bg-gradient-to-br from-blue-700 to-purple-700 rounded-full p-1 mr-1">
                  <Brain className="h-4 w-4 text-white" />
                </span>
              </Link>
              {/* Center: Title */}
              <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
                Ocean of Books
              </h1>
              {/* Left: Ocean Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-[#231a36]/90 backdrop-blur rounded-xl px-3 py-1.5 shadow border border-[#2d1e4d] cursor-default text-xs font-semibold text-purple-200"
                style={{ pointerEvents: 'none' }}
                tabIndex={-1}
              >
                <span className="flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 rounded-full p-1 mr-1">
                  <Waves className="h-4 w-4 text-purple-300" />
                </span>
                书 <span className="text-purple-400 font-normal">|</span> Shū
                <span className="flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 rounded-full p-1 ml-1">
                  <BookOpen className="h-4 w-4 text-purple-300" />
                </span>
              </button>
            </div>
            <h1 className="block sm:hidden text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
              Ocean of Books
            </h1>
          </div>
          {/* Prompt Input Box - Compact */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-full max-w-xl bg-[#231a36]/90 rounded-xl shadow border border-[#2d1e4d] px-4 py-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
              <textarea
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-base text-purple-100 placeholder-purple-400 resize-none min-h-[36px] max-h-40 overflow-auto"
                rows={1}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
                style={{ height: '36px' }}
              />
              <button
                className="inline-flex items-center justify-center cursor-pointer bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-lg px-2.5 py-1.5 font-semibold shadow hover:from-purple-800 hover:to-blue-800 transition-all disabled:opacity-60"
                title="Search"
              >
                <ScanSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Compact Article Cards */}
          <div className="flex flex-col items-center justify-center">
            <h1 className='text-center text-4xl font-light text-purple-300'>Coming soon: Journey through time and civilizations.</h1>
          </div>
        </div>
      </div>
      {/* Custom CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div >
  );
}
