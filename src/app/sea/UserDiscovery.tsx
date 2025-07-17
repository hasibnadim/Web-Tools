'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
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
  const [activeTab, setActiveTab] = useState<'search' | 'recent'>('recent');
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
      } else {
        setSearchResults([]);
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
    router.push(`/profile/${userId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
      setActiveTab('search');
    }
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card 
      className="group cursor-pointer card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-500/20"
      onClick={() => handleUserClick(user._id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar 
              src={user.picture} 
              alt={user.name}
              fallback={user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              className="h-12 w-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
              {user.name}
            </h3>
            {user.persona && (
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                {user.persona}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Heart className="h-3 w-3" />
                <span>Active</span>
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Search className="h-4 w-4 text-white" />
            </div>
            Discover People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching || !searchQuery.trim()}
              className="w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-200 transform hover:scale-105"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Users
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl shadow-lg">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'recent'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Users className="h-3 w-3 inline mr-1" />
          Recent Users
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'search'
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Search className="h-3 w-3 inline mr-1" />
          Search Results
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'recent' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Recent Community Members</h2>
            </div>
            {isLoadingRecent ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Loading amazing people...</p>
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 grid-animate">
                {recentUsers.map((user) => (
                  <div key={user._id}>
                    <UserCard user={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Recent Users</h3>
                <p className="text-gray-600 text-sm">Be the first to join our amazing community!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Search className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Search Results
                {searchResults.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">({searchResults.length} found)</span>
                )}
              </h2>
            </div>
            {searchQuery.trim().length < 2 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Start Your Search</h3>
                <p className="text-gray-600 text-sm">Enter at least 2 characters to discover people</p>
              </div>
            ) : isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Searching for amazing people...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 grid-animate">
                {searchResults.map((user) => (
                  <div key={user._id}>
                    <UserCard user={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Results Found</h3>
                <p className="text-gray-600 text-sm">No users found for &quot;{searchQuery}&quot;</p>
                <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 