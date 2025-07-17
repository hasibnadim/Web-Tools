import React from 'react'
import ProfileComp from '../ProfileComp'
import { getSession, getUser } from '@/service/auth/auth'

const Page = async ({ params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params
    const user = await getUser(userId)
    const session = await getSession(userId)
    const currentUser = await getUser()
    
    // Check if current user is viewing their own profile
    const isOwnProfile = currentUser?._id === userId
    
    // If no user found, show not found message
    if (!user) {
        return <div className="text-center mt-8"><p>User not found</p></div>
    }
    
    return (
        <div>
            <ProfileComp user={user} session={session} isOwnProfile={isOwnProfile} />
        </div>
    )
}

export default Page