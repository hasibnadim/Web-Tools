'use client'
import React from 'react'  
import { ProfileComp } from './[profileId]/ProfileComp'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

const Page = () => {
    const auth = useAuth()
    const router = useRouter()
    if(!auth.isAuthenticated && !auth.isLoading){
        router.push('/auth/login')
    }
    return (
        <div className="dark min-h-screen">
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-6">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto"> 
                        <Loader isLoading={auth.isLoading}>
                         <ProfileComp user={auth.currentUser!} isOwnProfile={true} />
                         </Loader>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page