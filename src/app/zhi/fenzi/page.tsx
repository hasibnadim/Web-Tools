'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Waves, BookOpen } from 'lucide-react';
import { getRecentUsers, searchUsers } from './actions';
import Link from 'next/link'; import UserDiscovery from './UserDiscovery';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
 

export default function Fenzi() {
    const [isLoading, setIsLoading] = useState(true);
    const auth = useAuth()
    const router = useRouter()
    if (!auth.isAuthenticated && !auth.isLoading) {
        router.push('/auth/login')
    }

    useEffect(() => {
        // Check if user is authenticated by trying to get recent users
        const checkAuth = async () => {
            try {
                const result = await getRecentUsers();
                if (!result.success) {
                    toast.error('Failed to get recent users')
                    return;
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                toast.error('Failed to get recent users')
            }
        };

        checkAuth();
    }, [router]);



    return (
        <Loader isLoading={auth.isLoading}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-28 h-28 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Zhì Hǎi Button - Fixed Position */}


                <div className="container mx-auto px-4 py-2 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero Section - Compact */}



                        <div className="mb-3 md:mb-5">
                            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                                <Link
                                    href="/ocean"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:from-blue-700 hover:to-indigo-700 transition-all text-xs border border-indigo-200"
                                    title="Go to Ocean of Intelligence"
                                >
                                    <span className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full p-1 ml-1">
                                        <svg className="w-4 h-4 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </span>
                                    <span className="font-semibold">
                                        محيط الكتب
                                    </span>
                                    <span className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full p-1 mr-1">
                                        <BookOpen className="h-4 w-4 text-white" />
                                    </span>
                                </Link>

                                {/* Center: Title */}
                                <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
                                    Ocean of wisdom
                                </h1>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 bg-white/80 backdrop-blur rounded-xl px-3 py-1.5 shadow border border-blue-100 cursor-default text-xs font-semibold text-blue-700"
                                    style={{ pointerEvents: 'none' }}
                                    tabIndex={-1}
                                >
                                    <span className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 rounded-full p-1 ml-1">
                                        <Brain className="h-4 w-4 text-blue-500" />
                                    </span>
                                    <span className="tracking-wide font-bold text-blue-800">
                                        智海 <span className="mx-1 text-blue-200 font-normal">|</span> Zhì Hǎi
                                    </span>
                                    <span className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 rounded-full p-1 mr-1">
                                        <Waves className="h-4 w-4 text-blue-500" />
                                    </span>
                                </button>
                            </div>
                            <h1 className="block sm:hidden text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
                                Ocean of wisdom
                            </h1>
                        </div>

                        {isLoading ? <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                            <div className="container mx-auto px-4 py-4">
                                <div className="max-w-4xl mx-auto">
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                                        <p className="text-gray-600">Loading...</p>
                                    </div>
                                </div>
                            </div>
                        </div> :
                            <UserDiscovery searchUsers={searchUsers} getRecentUsers={getRecentUsers} />}
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
            </div>
        </Loader>
    );
}
