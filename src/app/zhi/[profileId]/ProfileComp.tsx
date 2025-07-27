'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { deleteSession, updateUser } from '@/service/auth/auth'
import { Edit2, Save, X, Calendar, Check, User, Clock, Share2, LogOut, Settings, Sparkles, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { getUserDisplayName, formatLastSeen, validatePersona } from '@/lib/client-auth-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClientUser } from '@/lib/types'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'
import BWMarkdown from '@/components/BWMarkdown'
import Link from 'next/link'

const lastSeen = (date?: Date | null): "now" | Date | null => {
    if (!date) return null;
    const dateObj = new Date(date);
    // if within 3minutes
    if (Date.now() - dateObj.getTime() < 3 * 60 * 1000) {
        return "now";
    } else {
        return dateObj;
    }
}

// --- Subcomponents ---

// Profile Header (avatar, name, email, status, actions)
type ProfileHeaderProps = {
    user: ClientUser;
    isOwnProfile: boolean;
    online: string | Date | null;
    memberSince: string;
    copied: boolean;
    copyProfileUrl: () => void;
};
function ProfileHeader({ user, isOwnProfile, online, memberSince, copied, copyProfileUrl }: ProfileHeaderProps) {
    return (
        <div className="relative mb-6 flex items-stretch">
            {/* Accent bar */}
            <div className="w-1 rounded-l-2xl bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-700 mr-3" />
            <div className="flex-1 flex items-center bg-[#201a2a] rounded-2xl shadow-lg border border-[#2d1e4d] px-4 py-3 min-h-[96px]">
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                    <Avatar className="h-16 w-16 ring-2 ring-[#2d1e4d] shadow-md">
                        <AvatarImage src={user.picture} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-700 to-indigo-700 text-white">
                            {user.firstName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {online === "now" && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#201a2a] flex items-center justify-center shadow">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
                {/* Info */}
                <div className="flex-1 ml-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                            {getUserDisplayName(user)}
                        </h1>
                        {isOwnProfile && (
                            <span title="Your profile">
                                <Crown className="h-5 w-5 text-yellow-400" />
                            </span>
                        )}
                        {user.email === 'hasibnadim0@gmail.com' && (
                            <span title="Chief of the platform" className='ml-auto inline-block'>
                                <Crown className="h-5 w-5 text-blue-400" />
                            </span>
                        )}
                    </div>
                    <p className="text-purple-200 text-xs font-mono bg-[#2d1e4d]/60 px-2 py-0.5 rounded-full inline-block mb-1">
                        {user.email}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-purple-300">
                        {memberSince && <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-purple-400" /><span>{memberSince}</span></div>}
                        {online === "now" ? (
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-green-400 font-medium">Online</span></div>
                        ) : online ? (
                            <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-500" /><span>{formatLastSeen(user.lastActivity)}</span></div>
                        ) : null}
                    </div>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4 items-end">
                    {isOwnProfile && (
                        <Button variant="ghost" size="icon" onClick={copyProfileUrl} className="h-8 w-8 p-0 text-purple-300 hover:text-purple-400 hover:bg-[#2d1e4d]/60 rounded-full transition-all" title="Copy profile URL">
                            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Persona Editor (edit mode for about section)
type PersonaEditorProps = {
    personaText: string;
    setPersonaText: (v: string) => void;
    isSaving: boolean;
    onSave: () => void;
    onCancel: () => void;
};
function PersonaEditor({ personaText, setPersonaText, isSaving, onSave, onCancel }: PersonaEditorProps) {
    return (
        <div className="space-y-4">
            <Textarea
                value={personaText}
                onChange={(e) => setPersonaText(e.target.value)}
                placeholder="Tell us about yourself... Markdown: **bold**, *italic*, # headings, - for lists"
                className="min-h-[100px] resize-none text-sm border-2 border-[#2d1e4d] focus:border-purple-500 focus:ring-2 focus:ring-purple-400 rounded-xl bg-[#2d1e4d] text-purple-100 placeholder-purple-400"
            />
            <div className="bg-gradient-to-r from-[#2d1e4d] to-[#231a36] p-3 rounded-xl border border-purple-900">
                <p className="font-medium text-purple-200 mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4" />Formatting Guide</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-purple-300">
                    <div><code className="bg-[#231a36] px-1 rounded">**text**</code> for <strong>bold</strong></div>
                    <div><code className="bg-[#231a36] px-1 rounded">*text*</code> for <em>italic</em></div>
                    <div><code className="bg-[#231a36] px-1 rounded"># Heading</code> for headings</div>
                    <div><code className="bg-[#231a36] px-1 rounded">- item</code> for lists</div>
                </div>
                <div className="mt-2 text-right text-xs text-purple-400">{personaText.length}/1000</div>
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={onSave} disabled={isSaving} className="text-green-400 hover:text-green-300 hover:bg-green-900/20 h-9 px-3 rounded-xl transition-all"><Save className="w-4 h-4 mr-1" />{isSaving ? 'Saving...' : 'Save'}</Button>
                <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-9 px-3 rounded-xl transition-all"><X className="w-4 h-4 mr-1" />Cancel</Button>
            </div>
        </div>
    );
}

// About Section (persona display or editor)
type AboutSectionProps = {
    isOwnProfile: boolean;
    isEditingPersona: boolean;
    setIsEditingPersona: (v: boolean) => void;
    personaText: string;
    setPersonaText: (v: string) => void;
    isSaving: boolean;
    handleSavePersona: () => void;
    handleCancelEdit: () => void;
    renderPersonaContent: () => React.ReactNode;
};
function AboutSection({ isOwnProfile, isEditingPersona, setIsEditingPersona, personaText, setPersonaText, isSaving, handleSavePersona, handleCancelEdit, renderPersonaContent }: AboutSectionProps) {
    return (
        <div className="relative flex items-stretch mt-2">
            {/* Accent bar */}
            <div className="w-1 rounded-l-2xl bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-700 mr-3" />
            <Card className="flex-1 relative bg-[#201a2a] border border-[#2d1e4d] rounded-2xl shadow-md p-0">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2 pb-0">
                    <CardTitle className="text-base font-bold text-purple-100 flex items-center gap-2">
                        <User className="h-4 w-4 text-white" />
                        About
                    </CardTitle>
                    {isOwnProfile && !isEditingPersona && (
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingPersona(true)} className="h-8 w-8 p-0 text-purple-300 hover:text-purple-200 hover:bg-[#2d1e4d]/60 rounded-full transition-all" title="Edit persona">
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="px-4 py-3">
                    {isEditingPersona ? (
                        <PersonaEditor personaText={personaText} setPersonaText={setPersonaText} isSaving={isSaving} onSave={handleSavePersona} onCancel={handleCancelEdit} />
                    ) : (
                        <div className="text-xs leading-relaxed text-purple-100">
                            {renderPersonaContent()}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// --- Main ProfileComp ---
export const ProfileComp = ({ user, isOwnProfile = false }: { user: ClientUser, isOwnProfile?: boolean }) => {
    const [isEditingPersona, setIsEditingPersona] = useState(false);
    const [personaText, setPersonaText] = useState(user.persona || '');
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "";
    const online = lastSeen(user.lastActivity);
    // Copy profile URL to clipboard
    const copyProfileUrl = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/zhi/${user._id}`);
            setCopied(true);
            toast.success('Profile URL copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy profile URL');
        }
    };
    const handleSavePersona = async () => {
        const validation = validatePersona(personaText);
        if (!validation.isValid) {
            toast.error(validation.error);
            return;
        }
        setIsSaving(true);
        try {
            const success = await updateUser(user._id, { persona: personaText });
            if (success) {
                toast.success('Persona updated successfully!');
                setIsEditingPersona(false);
                user.persona = personaText;
            } else {
                toast.error('Failed to update persona');
            }
        } catch {
            toast.error('Error updating persona');
        } finally {
            setIsSaving(false);
        }
    };
    const handleCancelEdit = () => {
        setPersonaText(user.persona || '');
        setIsEditingPersona(false);
    };
    // --- Persona content renderer (dark mode) ---
    const renderPersonaContent = () => {
        if (!user.persona) {
            return (
                <div className="text-purple-400 italic text-sm text-center py-8">
                    {isOwnProfile ? "✨ No persona description yet. Click edit to add one!" : "This user hasn't added a persona description yet."}
                </div>
            );
        }
        return (
            <BWMarkdown>
                {user.persona}
            </BWMarkdown>
        );
    };
    return (
        <>
            <div className=" bg-[#181622] py-4 px-1 md:px-2">
                <div className="max-w-3xl mx-auto">
                    <ProfileHeader user={user} isOwnProfile={isOwnProfile} online={online} memberSince={memberSince} copied={copied} copyProfileUrl={copyProfileUrl} />
                    <AboutSection isOwnProfile={isOwnProfile} isEditingPersona={isEditingPersona} setIsEditingPersona={setIsEditingPersona} personaText={personaText} setPersonaText={setPersonaText} isSaving={isSaving} handleSavePersona={handleSavePersona} handleCancelEdit={handleCancelEdit} renderPersonaContent={renderPersonaContent} />

                </div>
            </div>
            {isOwnProfile &&
                <LogoutButton user={user} />
            }
        </>
    );
};

interface LogoutButtonProps {
    user: ClientUser
}
// --- Redesigned LogoutButton ---
export const LogoutButton = ({ user }: LogoutButtonProps) => {
    const router = useRouter();
    return (
        <div className="max-w-3xl mx-auto py-4 px-1 md:px-2 mt-4 flex items-stretch bg-[#181622]">
            {/* Accent bar */}
            <div className="w-1 rounded-l-2xl bg-gradient-to-b from-red-700 via-pink-700 to-pink-900 mr-3" />
            <Card className="flex-1 relative bg-[#201a2a] border border-[#2d1e4d] rounded-2xl shadow-md p-0">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2 pb-0">
                    <CardTitle className="text-base font-bold text-red-200 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-red-300" />
                        Account Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                    <div className="flex-1 bg-[#2d1e4d] p-2 rounded-xl border border-purple-900 mb-2 md:mb-0">
                        <p className="text-xs text-purple-400 mb-1">Account ID:</p>
                        <p className="font-mono text-xs bg-[#231a36] p-2 rounded-lg border border-purple-800 break-all">{user._id.toString()}</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to log out?')) {
                                deleteSession().then(() => router.push('/auth/login'))
                                    .catch((err) => toast.error(err.message));
                            }
                        }}
                        className="h-10 w-10 text-red-400 border border-red-900 hover:bg-red-900/30 hover:text-red-300 rounded-full transition-all font-medium text-sm flex items-center justify-center ml-auto"
                        title="Log Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

const AccountLoader = ({ profileId }: { profileId: string }) => {
    const auth = useAuth(profileId)
    const router = useRouter()
    if (!auth.isAuthenticated && !auth.isLoading) {
        router.push('/auth/login')
    }
    return (
        <Loader
            isLoading={auth.isLoading}>
            {auth.profileUser ? (
                <>
                    <ProfileComp user={auth.profileUser} isOwnProfile={auth.isOwner} />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
                    <div className="bg-[#231a36]/90 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-[#2d1e4d]">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-400 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 005.656 0M15 9h.01M9 9h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                        <span className="text-lg font-semibold text-purple-100 mb-2">Profile Not Found</span>
                        <span className="text-purple-300 mb-4 text-sm">The profile you are looking for does not exist or is unavailable.</span>
                        <Link href="/zhi" className="inline-block mt-2">
                            <button className="bg-gradient-to-r from-purple-700 to-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow hover:from-purple-800 hover:to-blue-800 transition-all">Go Home</button>
                        </Link>
                    </div>
                </div>
            )}
        </Loader>
    );
}

export default AccountLoader
