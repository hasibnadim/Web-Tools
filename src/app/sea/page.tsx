'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserDiscovery from './UserDiscovery';
import { searchUsers, getRecentUsers } from './actions';
import { Sparkles } from 'lucide-react';

export default function SeaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by trying to get recent users
    const checkAuth = async () => {
      try {
        const result = await getRecentUsers();
        if (!result.success) {
          router.push('/auth/login');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">Discover & Connect</span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              Find Amazing People
            </h1>
            
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Explore our community and connect with users who share your interests.
            </p>
          </div>
          
          <UserDiscovery 
            searchUsers={searchUsers}
            getRecentUsers={getRecentUsers}
          />
        </div>
      </div>
    </div>
  );
}
