"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
} from "lucide-react";
import Link from "next/link";
import { getMyQatrat } from "@/service/qatrat/action";
import { toast } from "sonner";
import { ClientUser } from "@/lib/types";
import QatarahCard, { QataratWithId } from "@/components/QatarahCard";
import { cn } from "@/lib/utils";


interface IQLProps {
    user: ClientUser
}
const QataratLoader = ({ user }: IQLProps) => {
    const [qatarat, setQatarat] = useState<QataratWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [animate, setAnimate] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    // Fetch Qatarāt
    const fetchQatarat = useCallback(async (pageNum: number = 1, append: boolean = false, archived: boolean = false) => {
        setLoading(true);
        try {
            const result = await getMyQatrat(pageNum, 5, archived);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 400);
            if (append) {
                setQatarat(prev => [...prev, ...result.qatrat.map(q => ({
                    ...q,
                    totalComment: q.comments.length,
                    totalLikedBy: q.likedBy.length
                }))]);
            } else {
                setQatarat(result.qatrat.map(q => ({
                    ...q,
                    totalComment: q.comments.length,
                    totalLikedBy: q.likedBy.length
                })));
            }
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error fetching Qatarāt:", error);
            toast.error("Failed to load Qatarāt");
        } finally {
            setLoading(false);
        }
    }, []);

    // Load more Qatarāt
    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchQatarat(nextPage, true, showArchived);
        }
    }, [hasMore, loading, page, fetchQatarat, showArchived]);


    // Refresh Qatarāt
    const handleRefresh = useCallback(() => {
        setPage(1);
        fetchQatarat(1, false, showArchived);
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [fetchQatarat, showArchived]);

    // Jump to top
    const handleJumpTop = () => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Keyboard accessibility for tabs
    const handleTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setShowArchived(prev => !prev);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchQatarat(1, false, showArchived);
    }, [showArchived, fetchQatarat]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] pb-12 flex flex-col">


            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-1 sm:px-4 mt-4 sm:mt-8 space-y-6 sm:space-y-8 w-full">
                {/* Filter Tabs */}
                <div
                    className="flex flex-row items-center gap-2 sm:gap-4 bg-[#231a36]/90 backdrop-blur-md rounded-2xl p-1.5 sm:p-2 shadow-lg border border-[#2d1e4d] mb-2"
                    tabIndex={0}
                    onKeyDown={handleTabKey}
                >
                    <Button
                        variant={!showArchived ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setShowArchived(false)}
                        className={
                            `flex-1 min-w-0 rounded-full px-3 py-2 font-semibold transition-all duration-200 text-sm sm:text-base ` +
                            (!showArchived
                                ? "bg-gradient-to-r from-purple-700/80 to-blue-700/80 text-white shadow-md border border-[#2d1e4d]"
                                : "bg-transparent text-purple-300 hover:bg-[#2d1e4d]/60")
                        }
                        aria-pressed={!showArchived}
                    >
                        Active Qatarāt
                    </Button>
                    <Button
                        variant={showArchived ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setShowArchived(true)}
                        className={
                            `flex-1 min-w-0 rounded-full px-3 py-2 font-semibold transition-all duration-200 text-sm sm:text-base ` +
                            (showArchived
                                ? "bg-gradient-to-r from-purple-700/80 to-blue-700/80 text-white shadow-md border border-[#2d1e4d]"
                                : "bg-transparent text-purple-300 hover:bg-[#2d1e4d]/60")
                        }
                        aria-pressed={showArchived}
                    >
                        Archived
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        title="Refresh"
                        className="ml-2 rounded-full bg-[#231a36]/80 hover:bg-[#2d1e4d]/80 text-purple-300 border border-[#2d1e4d] shadow w-10 h-10 min-w-10 min-h-10"
                    >
                        <span className="text-lg">↻</span>
                    </Button>
                </div>
                {/* Qatarāt Timeline */}
                <div className="space-y-4 sm:space-y-6 relative" ref={listRef}>
                    {loading && page === 1 ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto border-opacity-60"></div>
                            <p className="mt-2 text-purple-300 text-base sm:text-lg">Loading your Qatarāt...</p>
                        </div>
                    ) : qatarat.length > 0 ? (
                        <>
                            <div className={cn({
                                "transition-all duration-400 opacity-80 scale-95": animate,
                                "transition-all duration-400 opacity-100 scale-100": !animate,
                            }) + " bg-[#231a36]/90 backdrop-blur-md rounded-2xl p-1.5 sm:p-4 border border-[#2d1e4d]"}>
                                {qatarat.map((qatrah) => (
                                    <QatarahCard key={qatrah._id} qatrah={qatrah} user={user} />
                                ))}
                            </div>
                            {/* Load More Button */}
                            {hasMore && (
                                <div className="text-center">
                                    <Button
                                        variant="ghost"
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="w-full sm:w-auto px-8 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white border-0 shadow-md hover:scale-105 transition-transform text-base sm:text-lg"
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                    </Button>
                                </div>
                            )}
                            {/* Jump to Top Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleJumpTop}
                                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 shadow-lg bg-[#231a36]/90 hover:bg-[#2d1e4d]/80 text-purple-300 border border-[#2d1e4d] backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center"
                                style={{ display: qatarat.length > 3 ? 'flex' : 'none' }}
                                title="Jump to Top"
                            >
                                <span className="text-2xl">↑</span>
                            </Button>
                        </>
                    ) : (
                        <Card className="shadow-2xl rounded-2xl bg-[#231a36]/90 backdrop-blur-md border border-[#2d1e4d]">
                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-700 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-[#2d1e4d]/40">
                                    <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-purple-100 mb-2">
                                    {showArchived ? 'No Archived Qatarāt' : 'Start Your Ocean Journey'}
                                </h3>
                                <p className="text-purple-300 mb-4 text-sm sm:text-base">
                                    {showArchived
                                        ? 'You haven\'t archived any Qatarāt yet.'
                                        : 'Be the first to share wisdom in your ocean. Every drop counts!'
                                    }
                                </p>
                                {!showArchived && (
                                    <Link href="/zhi/qatarat/create">
                                        <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-semibold rounded-full px-6 py-2 shadow-lg border-0 text-base sm:text-lg">
                                            <Plus className="w-4 h-4 mr-2" /> أضف قطرة - Aḍif Qatarāt
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QataratLoader;