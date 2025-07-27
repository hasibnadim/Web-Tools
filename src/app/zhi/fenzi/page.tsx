'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentUsers, searchUsers } from './actions';
import UserDiscovery from './UserDiscovery';
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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 relative overflow-hidden text-gray-100">
                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-24 h-24 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-28 h-28 bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 py-2 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero Section - Compact */}
                        {isLoading ? (
                            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950">
                                <div className="container mx-auto px-4 py-4">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mx-auto mb-3"></div>
                                            <p className="text-gray-400">Loading...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <UserDiscovery searchUsers={searchUsers} getRecentUsers={getRecentUsers} />
                        )}
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
