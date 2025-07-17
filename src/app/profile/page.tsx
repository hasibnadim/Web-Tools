import React from 'react'
import ProfileComp, { LogoutButton } from './ProfileComp'
import { getSession, getUser } from '@/service/auth/auth';
import { redirect, RedirectType } from 'next/navigation'; 

const Page = async () => {
    const session = await getSession();
    const user = await getUser(session?.userId);
    if (!user || !session) {
        // redirect to login
        redirect('/auth/login', RedirectType.push)
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Manage your account and preferences</p>
                    </div>
                    
                    <ProfileComp user={user} session={session} isOwnProfile={true} />
                    <LogoutButton user={user} />
                </div>
            </div>
        </div>
    )
}

export default Page