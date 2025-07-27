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
      className="group cursor-pointer bg-gradient-to-br from-gray-900/90 to-blue-950 border-0 shadow-md hover:shadow-blue-800/30 transition-all duration-200 hover:scale-[1.025]"
      onClick={() => handleUserClick(user._id)}
    >
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div>
            <Avatar className="h-12 w-12 ring-2 ring-blue-900 group-hover:ring-blue-400 transition-all duration-300">
              <AvatarImage src={user.picture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-100 group-hover:text-blue-300 transition-colors truncate">
              {user.name}
            </h3>
            {user.persona && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 group-hover:text-gray-200 transition-colors">
                {user.persona}
              </p>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-blue-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardContent>
    </Card>
  );

  // Get current users to display
  const currentUsers = isSearchMode ? searchResults : recentUsers;
  const isLoading = isSearchMode ? isSearching : isLoadingRecent;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 md:px-0">
      {/* Header Section */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-base max-w-2xl mx-auto">
          {isSearchMode
            ? `Searching for "${searchQuery}" in our community`
            : "Explore recent community members and connect with fellow knowledge seekers"
          }
        </p>
      </div>

      {/* Compact & Attractive Search Input */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for people by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-10 text-sm border-0 bg-transparent text-gray-100 focus:ring-0 focus:outline-none placeholder-gray-500"
                  autoComplete="off"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="w-px h-7 bg-gray-800"></div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
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
          <div className="flex flex-col items-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-900 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-3 text-base">
              {isSearchMode ? 'Searching for people...' : 'Loading community members...'}
            </p>
          </div>
        ) : currentUsers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-4">
              {isSearchMode ? (
                <Search className="h-8 w-8 text-gray-600" />
              ) : (
                <Users className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              {isSearchMode ? 'No Results Found' : 'No Community Members Yet'}
            </h3>
            <p className="text-gray-400 text-center max-w-md text-sm">
              {isSearchMode
                ? `No users found for "${searchQuery}". Try a different search term or browse recent members.`
                : 'Be the first to join our amazing community of knowledge seekers!'
              }
            </p>
            {isSearchMode && (
              <button
                onClick={handleClearSearch}
                className="mt-3 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Recent Members
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-1 bg-blue-950 px-3 py-1.5 rounded-full">
          <Heart className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-blue-200 font-medium">
            {isSearchMode ? 'Search Results' : 'Recent Community Members'}
          </span>
        </div>
      </div>
    </div>
  );
} 