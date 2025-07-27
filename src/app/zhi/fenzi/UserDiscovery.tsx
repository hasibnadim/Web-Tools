/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, User, ArrowRight, Heart } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  persona?: string | null;
  picture?: string;
}

interface UserDiscoveryProps {
  searchUsers: (query: string) => Promise<{ success: boolean; users?: User[]; error?: string }>;
  getRecentUsers: () => Promise<{ success: boolean; users?: User[]; error?: string }>;
}

export default function UserDiscovery({ searchUsers, getRecentUsers }: UserDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const router = useRouter();

  // Load recent users on component mount
  useEffect(() => {
    loadRecentUsers();
  }, []);

  // Search users with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
        setIsSearchMode(true);
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setIsSearchMode(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadRecentUsers = async () => {
    try {
      setIsLoadingRecent(true);
      const result = await getRecentUsers();
      if (result.success && result.users) {
        setRecentUsers(result.users);
      } else {
        console.error('Failed to load recent users:', result.error);
        setRecentUsers([]);
      }
    } catch (error) {
      console.error('Error loading recent users:', error);
      setRecentUsers([]);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const result = await searchUsers(searchQuery);
      if (result.success && result.users) {
        setSearchResults(result.users);
      } else {
        console.error('Search failed:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/zhi/${userId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchMode(false);
  };

  // UserCard: Redesigned for a more modern, flow-based look
  const UserCard = ({ user }: { user: User }) => (
    <Card
      className="group cursor-pointer bg-gradient-to-br from-white/90 to-blue-50 border-0 shadow-md hover:shadow-blue-400/30 transition-all duration-200 hover:scale-[1.025]"
      onClick={() => handleUserClick(user._id)}
    >
      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-4">
          <div>
            <Avatar className="h-14 w-14 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300">
              <AvatarImage src={user.picture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-700 to-indigo-700 text-white">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>

          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
              {user.name}
            </h3>
            {user.persona && (
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-1 group-hover:text-gray-800 transition-colors">
                {user.persona}
              </p>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardContent>
    </Card>
  );

  // Get current users to display
  const currentUsers = isSearchMode ? searchResults : recentUsers;
  const isLoading = isSearchMode ? isSearching : isLoadingRecent;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-2 md:px-0">
      {/* Header Section */}
      <div className="text-center mb-8">


        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {isSearchMode
            ? `Searching for "${searchQuery}" in our community`
            : "Explore recent community members and connect with fellow knowledge seekers"
          }
        </p>
      </div>

      {/* Compact & Attractive Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for people by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400"
                  autoComplete="off"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{currentUsers.length} {isSearchMode ? 'found' : 'members'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">
              {isSearchMode ? 'Searching for people...' : 'Loading community members...'}
            </p>
          </div>
        ) : currentUsers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              {isSearchMode ? (
                <Search className="h-10 w-10 text-gray-400" />
              ) : (
                <Users className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearchMode ? 'No Results Found' : 'No Community Members Yet'}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {isSearchMode
                ? `No users found for "${searchQuery}". Try a different search term or browse recent members.`
                : 'Be the first to join our amazing community of knowledge seekers!'
              }
            </p>
            {isSearchMode && (
              <button
                onClick={handleClearSearch}
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Recent Members
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <Heart className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700 font-medium">
            {isSearchMode ? 'Search Results' : 'Recent Community Members'}
          </span>
        </div>
      </div>
    </div>
  );
} 