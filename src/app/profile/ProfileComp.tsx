'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { deleteSession, IRgetSession, updateUser } from '@/service/auth/auth'
import { ClientUser } from '@/lib/types'
import { Edit2, Save, X, Calendar, Check, User, Clock, Activity, Share2, LogOut, Settings } from 'lucide-react'
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
                <div className="text-gray-500 italic text-sm">
                    {isOwnProfile
                        ? "No persona description yet. Click edit to add one!"
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
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <Avatar 
                        src={user.picture} 
                        alt={getUserDisplayName(user)}
                        fallback={getUserInitials(user)}
                        className="h-16 w-16 ring-3 ring-blue-100"
                    />
                    {online === "now" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                    )}
                </div>
                
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                        {getUserDisplayName(user)}
                    </h2>
                    <p className="text-blue-600 text-sm font-mono">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Member since {profileStats.memberSince}</span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end gap-1">
                    {online === "now" ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Online
                        </span>
                    ) : online ? (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {formatLastSeen(online)}
                        </span>
                    ) : null}
                    
                    {isOwnProfile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyProfileUrl}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{profileStats.toolsUsed}</div>
                        <div className="text-xs text-gray-600">Tools Used</div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <Clock className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{profileStats.lastActive}</div>
                        <div className="text-xs text-gray-600">Last Active</div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <User className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">Active</div>
                        <div className="text-xs text-gray-600">Status</div>
                    </CardContent>
                </Card>
            </div>

            {/* About Section */}
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            About
                        </CardTitle>
                        {isOwnProfile && !isEditingPersona ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingPersona(true)}
                                className="text-blue-600 hover:text-blue-800 h-8 px-3"
                            >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Edit
                            </Button>
                        ) : isOwnProfile && isEditingPersona ? (
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSavePersona}
                                    disabled={isSaving}
                                    className="text-green-600 hover:text-green-800 h-8 px-2"
                                >
                                    <Save className="w-3 h-3 mr-1" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="text-red-600 hover:text-red-800 h-8 px-2"
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingPersona ? (
                        <div className="space-y-3">
                            <Textarea
                                value={personaText}
                                onChange={(e) => setPersonaText(e.target.value)}
                                placeholder="Tell us about yourself... You can use basic markdown like **bold**, *italic*, # headings, and - for lists"
                                className="min-h-[100px] resize-none text-sm"
                            />
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                <p className="font-medium mb-1">Supports basic formatting:</p>
                                <ul className="space-y-0.5">
                                    <li><code>**text**</code> for <strong>bold</strong></li>
                                    <li><code>*text*</code> for <em>italic</em></li>
                                    <li><code># Heading</code> for headings</li>
                                    <li><code>- item</code> for lists</li>
                                </ul>
                                <p className="mt-2 text-right">Character count: {personaText.length}/1000</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm">
                            {renderPersonaContent()}
                        </div>
                    )}
                </CardContent>
            </Card>
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
        <Card className="max-w-2xl mx-auto mt-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    Account Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded">Account ID: {user._id.toString()}</p>
                </div>
                
                <Button 
                    variant="outline" 
                    onClick={() => {
                        if (window.confirm('Are you sure you want to log out?')) {
                            deleteSession().then(() => router.push('/auth/login'))
                                .catch((err) => toast.error(err.message));
                        }
                    }}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                </Button>
            </CardContent>
        </Card>
    )
}