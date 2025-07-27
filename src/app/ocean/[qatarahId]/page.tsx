'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getQatrat } from '@/service/qatrat/action';
import { getUser } from '@/service/auth/auth';
import { useAuth } from '@/hooks/useAuth';
import BWMarkdown from '@/components/BWMarkdown';
import { Button } from '@/components/ui/button';
import { Edit, Eye, EyeOff, Minimize2, Maximize2 } from 'lucide-react';
import { QataratWithId } from '@/components/QatarahCard';
import { ClientUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { publishQatrat, makePrivate, updateQatrat, likeQatrat, unlikeQatrat } from '@/service/qatrat/action';
import Comment from './Comment';
import Link from 'next/link';
import { Editor, loader } from '@monaco-editor/react';
import { Textarea } from '@/components/ui/textarea';

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})


const TheQatarah = () => {
  const params = useParams();
  const qatarahId = params?.qatarahId as string;
  const auth = useAuth();
  const [qatarah, setQatarah] = useState<QataratWithId | null>(null);
  const [author, setAuthor] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editOverview, setEditOverview] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bodyFullscreen, setBodyFullscreen] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!qatarahId) return;
    setLoading(true);
    getQatrat(qatarahId).then(async (q) => {
      if (!q) {
        setError('Qatarāh not found.');
        setLoading(false);
        return;
      }
      setQatarah({
        ...q,
        totalComment: q.comments.length,
        totalLikedBy: q.likedBy.length,
      });
      setEditOverview(q.overview);
      setEditBody(q.body);
      setLikeCount(q.likedBy.length);
      setLiked(auth.currentUser ? q.likedBy.includes(auth.currentUser._id) : false);
      try {
        setAuthor(await getUser(q.author));
      } catch {
        setAuthor(null);
      }

      // setComments(mapToQatarahComments(rawComments)); // This line is removed
      // setCommentText(''); // This line is removed
      // setCommentLoading(false); // This line is removed
      setLoading(false);
    });
  }, [qatarahId, auth.currentUser]);

  const handleSave = async () => {
    if (!qatarah || !auth.currentUser) return;
    setSaving(true);
    await updateQatrat(qatarah._id, auth.currentUser._id, { overview: editOverview, body: editBody });
    setQatarah({ ...qatarah, overview: editOverview, body: editBody });
    setEditing(false);
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!qatarah || !auth.currentUser) return;
    setSaving(true);
    await publishQatrat(qatarah._id, auth.currentUser._id);
    setQatarah({ ...qatarah, isPublic: true, isDraft: false });
    setSaving(false);
  };

  const handleMakePrivate = async () => {
    if (!qatarah || !auth.currentUser) return;
    setSaving(true);
    await makePrivate(qatarah._id, auth.currentUser._id);
    setQatarah({ ...qatarah, isPublic: false });
    setSaving(false);
  };

  const handleLike = async () => {
    if (!qatarah || !auth.currentUser) return;
    if (liked) {
      await unlikeQatrat(qatarah._id, auth.currentUser._id);
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      await likeQatrat(qatarah._id, auth.currentUser._id);
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };



  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] text-purple-200">Loading...</div>;
  }
  if (error || !qatarah) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] text-red-400">{error || 'Not found.'}</div>;
  }

  const isOwner = auth.currentUser && qatarah.author === auth.currentUser._id;
  const isPublic = qatarah.isPublic && !qatarah.isDraft && !qatarah.isArchived;
  const canViewBody = (auth.isAuthenticated && (isOwner || isPublic));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] flex flex-col items-center py-4 px-1">
      <div className="max-w-6xl w-full mx-auto bg-[#231a36]/90 rounded-2xl shadow-2xl border border-[#2d1e4d] p-3 sm:p-6 md:p-8 relative backdrop-blur-xl">
        {/* Sticky Author/Status Header */}
        <div className="sticky top-0 z-10 bg-[#231a36]/80 rounded-t-2xl flex items-center gap-3 px-2 py-3 border-b border-[#2d1e4d] mb-4 shadow-sm">
          {author && (
            <div className="flex items-center gap-2">
              <Avatar className='w-9 h-9 sm:w-10 sm:h-10 border-2 border-[#2d1e4d] shadow-md'>
                <AvatarImage src={author.picture} alt="avatar" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" />
                <AvatarFallback>
                  {author.firstName.charAt(0)}
                  {author.lastName?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <span className="text-purple-100 font-semibold text-sm sm:text-base">{author.firstName} {author.lastName?.charAt(0) || ''}</span>
            </div>
          )}
          {isOwner && <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow border border-[#2d1e4d]">
            {isPublic ? 'Public' : qatarah.isDraft ? 'Draft' : 'Private'}
          </span>}
        </div>
        {/* Overview/Body Section */}
        <div className="mt-2">
          {editing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant={preview ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs px-2 py-1"
                  onClick={() => setPreview(p => !p)}
                >
                  {preview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {preview ? 'Hide Preview' : 'Preview'}
                </Button>
              </div>
              {/* Overview Editor */}
              {preview ? (
                <div className="bg-[#231a36]/90 rounded-xl p-6 border border-[#025908] mb-2">
                  <BWMarkdown>{editOverview}</BWMarkdown>
                </div>
              ) : (
                <Textarea
                  value={editOverview}
                  onChange={(e) => setEditOverview(e.target.value)}
                  placeholder="# Your Title\nWrite a brief overview with **bold**, *italic*, ~~strikethrough~~, and [links](url)..."
                  className="min-h-[80px] resize-none border border-[#2d1e4d] rounded-xl bg-[#231a36] focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-purple-100 text-base px-4 py-3 shadow-sm transition-all duration-200 placeholder-purple-400"
                />
              )}
              {/* Body Editor */}
              {preview ? (
                <div className="bg-[#231a36]/90 rounded-xl p-6 border border-[#2d1e4d] min-h-[65vh] overflow-y-auto">
                  <BWMarkdown>{editBody}</BWMarkdown>
                </div>
              ) : (
                <div className={bodyFullscreen ? "fixed inset-0 z-50 bg-[#181622] flex flex-col items-center justify-center p-4" : ""}>
                  
                <Button
                  type="button"
                  variant={bodyFullscreen ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs px-2 py-1"
                  onClick={() => setBodyFullscreen(f => !f)}
                >
                  {bodyFullscreen ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
                  {bodyFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                  <div className={bodyFullscreen ? "w-full max-w-4xl mx-auto" : ""}>
                    <Editor
                      height={bodyFullscreen ? "80vh" : "65vh"}
                      width="100%"
                      language="markdown"
                      value={editBody}
                      theme="vs-dark"
                      onChange={e => setEditBody(e ?? "")}
                      options={{
                        minimap: { enabled: true },
                        cursorBlinking: "smooth",
                        fontSize: 15,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        scrollbar: { alwaysConsumeMouseWheel: false },
                        overviewRulerLanes: 0,
                        renderLineHighlight: 'none',
                        lineNumbers: 'off',
                        folding: false,
                        tabSize: 2,
                        automaticLayout: true,
                      }}
                    />
                  </div>
          
                </div>
              )}
              <div className="flex gap-2 justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving} className="text-green-300 border border-green-900 hover:bg-green-900/20 px-3">
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="text-red-300 border border-red-900 hover:bg-red-900/20 px-3">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="rounded-lg bg-[#231a36]/80 p-3 border border-[#025908] text-sm">
                  <BWMarkdown>{qatarah.overview}</BWMarkdown>
                </div>
              </div>
              {canViewBody ? (
                <div className="mb-4">
                  <div className="rounded-lg bg-[#231a36]/80 p-3 border border-[#2d1e4d] text-sm">
                    <BWMarkdown>{qatarah.body}</BWMarkdown>
                  </div>
                </div>
              ) : !auth.isAuthenticated && (
                <div className="rounded-xl bg-gradient-to-br from-[#231a36]/90 to-[#1a1330]/90 border border-[#2d1e4d] text-sm flex items-center justify-center p-4 shadow-lg">
                  <Link href="/auth/login" className="flex items-center gap-2 cursor-pointer hover:bg-blue-900/50 hover:underline rounded-xl p-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" />
                      <path d="M12 8v4" stroke="currentColor" strokeLinecap="round" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <span className="text-purple-300 text-xs sm:text-sm font-medium">Login to view the body</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        {/* Like/Comment Section */}
        <div className="flex items-center gap-3 mb-5 mt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`transition-colors duration-150 ${liked ? 'text-pink-400 bg-pink-900/10' : 'text-purple-300 hover:bg-purple-900/10'} border border-[#2d1e4d] shadow-sm`}
            disabled={!auth.isAuthenticated}
            title={liked ? 'Unlike' : 'Like'}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.04 3 12.5 3.81 13.28 5.09C14.06 3.81 15.52 3 17.07 3C20.07 3 22.5 5.5 22.5 8.5C22.5 13.5 15 21 15 21H12Z" /></svg>
          </Button>
          <span className="text-purple-300 text-xs sm:text-sm font-medium">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </div>
        {/* Comments Section */}
        <Comment qatarahId={qatarah._id} canViewBody={canViewBody} auth={auth.currentUser!} />
        {/* Owner Actions */}
        {isOwner && !editing && (
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="text-purple-200 border border-[#2d1e4d] hover:bg-[#2d1e4d]" title="Edit Qatarah">
              <Edit className="w-4 h-4" />
            </Button>
            {qatarah.isPublic ? (
              <Button variant="ghost" size="icon" onClick={handleMakePrivate} disabled={saving} className="text-yellow-300 border border-yellow-900 hover:bg-yellow-900/20" title="Make Private">
                <EyeOff className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={handlePublish} disabled={saving} className="text-green-300 border border-green-900 hover:bg-green-900/20" title="Publish">
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheQatarah;