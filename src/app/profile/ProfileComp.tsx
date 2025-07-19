'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { deleteSession, IRgetSession, updateUser } from '@/service/auth/auth'
import { ClientUser } from '@/lib/types'
import { Edit2, Save, X, Calendar, Check, User, Clock, Share2, LogOut, Settings, Sparkles, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { getUserDisplayName, getUserInitials, formatLastSeen, validatePersona } from '@/lib/client-auth-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

const lastSeen = (date?: Date): "now" | Date | null => {
    if (!date) return null;
    const dateObj = new Date(date);
    // if within 3minutes
    if (Date.now() - dateObj.getTime() < 3 * 60 * 1000) {
        return "now";
    } else {
        return dateObj;
    }
}

const ProfileComp = ({ user, session, isOwnProfile = false }: { user: ClientUser, session?: IRgetSession | null, isOwnProfile?: boolean }) => {
    const online = lastSeen(session?.lastActivity);
    const [isEditingPersona, setIsEditingPersona] = useState(false);
    const [personaText, setPersonaText] = useState(user.persona || '');
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const profileStats = {
        toolsUsed: 0,
        lastActive: formatLastSeen(session?.lastActivity || new Date()),
        memberSince: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    };

    // Copy profile URL to clipboard
    const copyProfileUrl = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/profile/${user._id}`);
            setCopied(true);
            toast.success('Profile URL copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy profile URL');
        }
    };

    const handleSavePersona = async () => {
        // Validate persona
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
                // Update the user object locally
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

    const renderPersonaContent = () => {
        if (!user.persona) {
            return (
                <div className="text-gray-500 italic text-sm text-center py-8">
                    {isOwnProfile
                        ? "✨ No persona description yet. Click edit to add one!"
                        : "This user hasn't added a persona description yet."
                    }
                </div>
            );
        }

        // Enhanced markdown-like rendering
        const lines = user.persona.split('\n');
        return (
            <div className="prose prose-blue max-w-none text-gray-700 text-sm">
                {lines.map((line, index) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={index}>{line.slice(2, -2)}</strong>;
                    } else if (line.startsWith('*') && line.endsWith('*')) {
                        return <em key={index}>{line.slice(1, -1)}</em>;
                    } else if (line.startsWith('- ')) {
                        return <li key={index}>{line.slice(2)}</li>;
                    } else if (line.startsWith('## ')) {
                        return <h3 key={index} className="text-base font-semibold mt-3 mb-1">{line.slice(3)}</h3>;
                    } else if (line.startsWith('# ')) {
                        return <h2 key={index} className="text-lg font-bold mt-3 mb-1">{line.slice(2)}</h2>;
                    } else if (line.trim() === '') {
                        return <br key={index} />;
                    } else {
                        return <span key={index}>{line}</span>;
                    }
                })}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="relative mb-8">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-20"></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar Section */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <div className="relative">
                                    <Avatar 
                                        src={user.picture} 
                                        alt={getUserDisplayName(user)}
                                        fallback={getUserInitials(user)}
                                        className="h-24 w-24 ring-4 ring-white shadow-xl"
                                    />
                                    {online === "now" && (
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                                        {getUserDisplayName(user)}
                                    </h1>
                                    {isOwnProfile && (
                                        <Crown className="h-6 w-6 text-yellow-500" />
                                    )}
                                </div>
                                
                                <p className="text-blue-600 text-sm font-mono bg-blue-50 px-3 py-1 rounded-full inline-block mb-3">
                                    {user.email}
                                </p>
                                
                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Member since {profileStats.memberSince}</span>
                                    </div>
                                    {online === "now" ? (
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-600 font-medium">Online</span>
                                        </div>
                                    ) : online ? (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>Last seen {formatLastSeen(online)}</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                {isOwnProfile && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyProfileUrl}
                                        className="h-10 w-10 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>



                {/* About Section */}
                <div className="relative -mt-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-10"></div>
                    <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    About
                                </CardTitle>
                                {isOwnProfile && !isEditingPersona ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditingPersona(true)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-10 px-4 rounded-xl transition-all"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : isOwnProfile && isEditingPersona ? (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleSavePersona}
                                            disabled={isSaving}
                                            className="text-green-600 hover:text-green-800 hover:bg-green-50 h-10 px-4 rounded-xl transition-all"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-10 px-4 rounded-xl transition-all"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isEditingPersona ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={personaText}
                                        onChange={(e) => setPersonaText(e.target.value)}
                                        placeholder="Tell us about yourself... You can use basic markdown like **bold**, *italic*, # headings, and - for lists"
                                        className="min-h-[120px] resize-none text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                                    />
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                        <p className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Formatting Guide
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                                            <div><code className="bg-white px-1 rounded">**text**</code> for <strong>bold</strong></div>
                                            <div><code className="bg-white px-1 rounded">*text*</code> for <em>italic</em></div>
                                            <div><code className="bg-white px-1 rounded"># Heading</code> for headings</div>
                                            <div><code className="bg-white px-1 rounded">- item</code> for lists</div>
                                        </div>
                                        <div className="mt-3 text-right text-xs text-blue-600">
                                            {personaText.length}/1000 characters
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm leading-relaxed">
                                    {renderPersonaContent()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProfileComp

interface LogoutButtonProps {
    user: ClientUser
}
export const LogoutButton = ({ user }: LogoutButtonProps) => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur-xl opacity-10"></div>
                <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                <Settings className="h-4 w-4 text-white" />
                            </div>
                            Account Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Account ID:</p>
                            <p className="font-mono text-xs bg-white p-3 rounded-lg border">{user._id.toString()}</p>
                        </div>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                if (window.confirm('Are you sure you want to log out?')) {
                                    deleteSession().then(() => router.push('/auth/login'))
                                        .catch((err) => toast.error(err.message));
                                }
                            }}
                            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-xl transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Log Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}