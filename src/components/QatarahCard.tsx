import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Eye, Heart, MessageCircle } from 'lucide-react'
import { ClientUser } from '@/lib/types'
import BWMarkdown from './BWMarkdown'
import Link from 'next/link'
import { toast } from 'sonner';

export interface QataratWithId {
    _id: string; 
    overview: string;
    body: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    openCount: number;
    readTimeS: number;
    totalComment: number;
    totalLikedBy: number 
    isPublic: boolean;
    isDraft: boolean;
    isArchived: boolean;
}

interface IProps {
    qatrah: QataratWithId
    user: ClientUser 
}



// Format date
const formatDate = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    if (days === 1) return 'Yesterday';
    if (days > 1) return `${days} days ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

// Get status badge
const getStatusBadge = (qatrah: QataratWithId) => {
    if (qatrah.isArchived) {
        return <span className="px-2 py-1 bg-blue-900/60 text-blue-200 text-xs sm:text-sm rounded-full shadow border border-blue-800/60 backdrop-blur-sm">Archived</span>;
    }
    if (qatrah.isDraft) {
        return <span className="px-2 py-1 bg-yellow-900/60 text-yellow-200 text-xs sm:text-sm rounded-full shadow border border-yellow-800/60 backdrop-blur-sm">Draft</span>;
    }
    if (!qatrah.isPublic) {
        return <span className="px-2 py-1 bg-red-900/60 text-red-200 text-xs sm:text-sm rounded-full shadow border border-red-800/60 backdrop-blur-sm">Private</span>;
    }
    return <span className="px-2 py-1 bg-green-900/60 text-green-200 text-xs sm:text-sm rounded-full shadow border border-green-800/60 backdrop-blur-sm">Published</span>;
};
const QatarahCard = memo(({ qatrah, user }: IProps) => {
    // Copy link handler
    const handleCopyLink = () => {
        const url = `${window.location.origin}/ocean/${qatrah._id}`;
        navigator.clipboard.writeText(url);
        // Optionally, show a toast if available 
        toast.success('Link copied!');

    };
    return (
        <Card key={qatrah._id} className=" shadow-2xl rounded-2xl bg-[#231a36]/95 hover:shadow-3xl transition-shadow duration-200 group mb-3 sm:mb-4 backdrop-blur-md border border-[#2d1e4d] w-full">
            <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                        <div className="relative flex-shrink-0">
                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#2d1e4d] shadow-lg bg-gradient-to-br from-purple-800/60 to-blue-900/60">
                                <AvatarImage src={user.picture} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white">
                                    {user.firstName?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-purple-700 to-blue-700 border-2 border-[#2d1e4d] shadow"></span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full">
                            <div>
                                <p className="font-semibold text-purple-100 text-sm sm:text-base">
                                    {user.firstName} {user.lastName || ''}
                                </p>
                                <p className="text-xs sm:text-sm text-purple-400">
                                    {formatDate(qatrah.createdAt)}
                                </p>
                            </div>
                            {getStatusBadge(qatrah)}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-purple-300 hover:text-purple-100 bg-[#2d1e4d]/70 hover:bg-[#2d1e4d]/90 rounded-full border border-[#2d1e4d] shadow"
                            onClick={handleCopyLink}
                            aria-label="Copy link"
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 7h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2m4-4V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" /></svg>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="mb-3 sm:mb-4 text-sm sm:text-base text-purple-100">
                    <BWMarkdown>
                        {qatrah.overview}
                    </BWMarkdown>
                </div>
                {/* Post Stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-[#2d1e4d] bg-[#221a3a]/80 rounded-b-2xl px-2 py-2 mt-2 backdrop-blur-sm gap-2 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-purple-300">
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {qatrah.openCount} views
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {qatrah.totalLikedBy} likes
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {qatrah.totalComment} comments
                        </span>
                        <span className="flex items-center gap-1">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 8h8M8 12h6m-6 4h4" /></svg>
                            {qatrah.readTimeS ? `${Math.max(1, Math.round(qatrah.readTimeS / 60))} min read` : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Link href={`/ocean/${qatrah._id}`} tabIndex={-1}>
                            <Button variant="outline" size="sm" aria-label="View full Qatarāh" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white border-0 shadow hover:scale-105 transition-transform px-4 py-1 text-sm sm:text-base">
                                View Full
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
});
QatarahCard.displayName = 'QatarahCard';

export default QatarahCard