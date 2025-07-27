'use client';

import { useRouter } from 'next/navigation';
import { Brain, Waves, BookOpen } from 'lucide-react';
import Link from 'next/link'; import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import { getPublicQatratFeed } from '@/service/qatrat/action';
import { getUser } from '@/service/auth/auth';
import QatarahCard, { QataratWithId } from '@/components/QatarahCard';
import { useEffect, useState } from 'react';
import { ClientUser } from '@/lib/types';


export default function OceanPage() {
  const auth = useAuth()
  const router = useRouter()
  const [feed, setFeed] = useState<QataratWithId[]>([]);
  const [authors, setAuthors] = useState<Record<string, ClientUser | null>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublicQatratFeed(1, 10).then(async (res) => {
      setFeed(res.qatrat.map(q => ({
        ...q,
        totalComment: q.comments.length,
        totalLikedBy: q.likedBy.length,
      })));
      setHasMore(res.hasMore);
      // Fetch all authors in parallel
      const authorIds = Array.from(new Set(res.qatrat.map(q => q.author)));
      const authorMap: Record<string, ClientUser | null> = {};
      await Promise.all(authorIds.map(async (id) => {
        try {
          authorMap[id] = await getUser(id);
        } catch {
          authorMap[id] = null;
        }
      }));
      setAuthors(authorMap);
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const res = await getPublicQatratFeed(nextPage, 10);
    setFeed(prev => [...prev, ...(res.qatrat.map(q => ({
      ...q,
      totalComment: q.comments.length,
      totalLikedBy: q.likedBy.length,
    })))]);
    setHasMore(res.hasMore);
    setPage(nextPage);
    // Fetch any new authors
    const newAuthorIds = Array.from(new Set(res.qatrat.map(q => q.author))).filter(id => !(id in authors));
    if (newAuthorIds.length > 0) {
      const authorMap: Record<string, ClientUser | null> = { ...authors };
      await Promise.all(newAuthorIds.map(async (id) => {
        try {
          authorMap[id] = await getUser(id);
        } catch {
          authorMap[id] = null;
        }
      }));
      setAuthors(authorMap);
    }
    setLoading(false);
  };

  if (!auth.isAuthenticated && !auth.isLoading) {
    router.push('/auth/login')
  }


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
                <button
                  type="button"
                  className="inline-flex items-center gap-1 bg-[#231a36]/90 backdrop-blur rounded-xl px-3 py-1.5 shadow border border-[#2d1e4d] cursor-default text-xs font-semibold text-purple-200"
                  style={{ pointerEvents: 'none' }}
                  tabIndex={-1}
                >
                  <span className="flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 rounded-full p-1 ml-1">
                    <Brain className="h-4 w-4 text-purple-300" />
                  </span>
                  <span className="tracking-wide font-bold text-purple-100">
                  حكمة<span className="mx-1 text-purple-400 font-normal">|</span> Hikma
                  </span>
                  <span className="flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 rounded-full p-1 mr-1">
                    <Waves className="h-4 w-4 text-purple-300" />
                  </span>
                </button>
                {/* Center: Title */}
                <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
                  Ocean of wisdom
                </h1>
                <Link
                  href="/ocean/ai"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-700 to-blue-700 text-white font-semibold rounded-xl shadow hover:from-purple-800 hover:to-blue-800 transition-all text-xs border border-[#2d1e4d]"
                  title="Go to Ocean of Intelligence"
                >
                  <span className="flex items-center justify-center bg-gradient-to-br from-blue-700 to-purple-700 rounded-full p-1 mr-1">
                    <BookOpen className="h-4 w-4 text-white" />
                  </span>
                  <span className="font-semibold">
                  书 <span className="text-purple-400 font-normal">|</span> Shū
                  </span>
                  <span className="flex items-center justify-center bg-gradient-to-br from-blue-700 to-purple-700 rounded-full p-1 ml-1">
                    <svg className="w-4 h-4 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
              <h1 className="block sm:hidden text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent leading-tight tracking-tight my-2 sm:my-0 text-center flex-1">
                Ocean of wisdom
              </h1>
            </div>
            
          <Loader isLoading={auth.isLoading}>
            {/* Content placeholder */}
            <div className="mt-8">
              {loading && feed.length === 0 ? (
                <div className="text-center text-purple-300 text-lg font-medium opacity-60 py-12">Loading wisdom...</div>
              ) : feed.length === 0 ? (
                <div className="text-center text-purple-300 text-lg font-medium opacity-60 py-12">No public Qatarāt yet.</div>
              ) : (
                <div className="space-y-4">
                  {feed.map(q => authors[q.author] && (
                    <QatarahCard key={q._id} qatrah={q} user={authors[q.author]!}  />
                  ))}
                  {hasMore && (
                    <div className="text-center mt-6">
                      <button
                        onClick={loadMore}
                        className="bg-gradient-to-r from-purple-700 to-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow hover:from-purple-800 hover:to-blue-800 transition-all"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Loader>
        </div>
      </div>
    </div>
  );
}
