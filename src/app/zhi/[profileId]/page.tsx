import React from 'react'
import AccountLoader from './ProfileComp'

const Page = async ({ params }: { params: Promise<{ profileId: string }> }) => {
    const { profileId } = await params


    return (
        <div className="dark min-h-screen">
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-6">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <AccountLoader profileId={profileId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page