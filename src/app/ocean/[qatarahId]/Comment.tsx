import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { addQatratComment, getQatratComments, IClientComment, likeComment, unlikeComment } from '@/service/qatrat/action';
import { ClientUser } from '@/lib/types';
import { Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface CommentProps {
  qatarahId: string;
  canViewBody: boolean;
  auth: ClientUser;
}



const Comment: React.FC<CommentProps> = ({ qatarahId, canViewBody, auth }) => {
  const [comments, setComments] = useState<IClientComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!qatarahId || !canViewBody) return;
    setLoading(true);
    getQatratComments(qatarahId).then((raw) => {
      setComments(raw);
      setLoading(false);
    });
  }, [qatarahId, canViewBody]);

  const handleAddComment = async () => {
    if (!qatarahId || !auth || !commentText.trim()) return;
    setCommentLoading(true);
    await addQatratComment(qatarahId, auth._id, commentText.trim());
    const rawComments = await getQatratComments(qatarahId);
    setComments(rawComments);
    setCommentText('');
    setCommentLoading(false);
  };

  const handleLike = async (commentId: string, likedByMe: boolean) => {
    if (!auth || !commentId) return;
    if (likedByMe) {
      await unlikeComment(qatarahId, commentId, auth._id);
    } else {
      await likeComment(qatarahId, commentId, auth._id);
    }
    // Refresh comments
    const rawComments = await getQatratComments(qatarahId);
    setComments(rawComments);
  };

  if (!canViewBody) return null;

  return (
    <div className="mt-7">
      <div className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-medium">Comments</div>
      {loading ? (
        <div className="text-purple-400 text-sm">Loading comments...</div>
      ) : (
        <div className="space-y-3 mb-3">
          {comments.length === 0 ? (
            <div className="text-purple-400 text-sm">No comments yet.</div>
          ) : comments.map((c, i) => (
            <div key={c._id || i} className="flex items-start gap-2 bg-[#231a36]/80 rounded-lg p-2 border border-[#2d1e4d] text-purple-100 text-sm shadow-sm">
              {/* Avatar for commenter if available */}
              <Avatar className="w-7 h-7 rounded-full border border-[#2d1e4d] object-cover">
                <AvatarImage src={c.author.picture} alt="avatar" />
                <AvatarFallback>
                  {c.author?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <span className="font-semibold text-purple-200 text-xs">{c.author?.name || 'User'}</span>
                <span className="ml-2 text-xs text-purple-400">{new Date(c.createdAt).toLocaleString()}</span>
                <div className="mt-1 text-sm text-purple-100 break-words">{c.content}</div>
              </div>
              <div className="flex flex-col items-center justify-center min-w-[32px]">
                <button
                  className={`transition-colors duration-150 rounded-full p-1 border border-[#2d1e4d] bg-transparent hover:bg-pink-900/10 ${c.likedByMe ? 'text-pink-400' : 'text-purple-300'}`}
                  title={c.likedByMe ? 'Unlike comment' : 'Like comment'}
                  disabled={!auth}
                  onClick={() => handleLike(c._id, c.likedByMe)}
                >
                  <Heart className="w-4 h-4" fill={c.likedByMe ? 'currentColor' : 'none'} />
                </button>
                <span className="text-xs text-purple-400 mt-1">{c.totalLiked}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {auth && (
        <div className="flex items-center gap-2 mt-2 bg-[#231a36]/80 rounded-lg border border-[#2d1e4d] px-2 py-1 shadow-sm">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-md bg-transparent text-purple-100 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-400"
            disabled={commentLoading}
            maxLength={300}
          />
          <Button variant="ghost" size="icon" onClick={handleAddComment} disabled={commentLoading || !commentText.trim()} className="text-purple-200 border border-[#2d1e4d] hover:bg-[#2d1e4d]" title="Send Comment">
            {commentLoading ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M22 2L11 13" /><path stroke="currentColor" strokeWidth="2" d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comment;