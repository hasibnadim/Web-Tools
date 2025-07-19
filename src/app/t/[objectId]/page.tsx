'use server'
import db, { CName } from '@/service/mongodb'
import { PublicFile, PublicText } from '@/service/publicText/interface'
import React from 'react'
import ShowText from './ShowText'
import ShowFile from './ShowFile'

const Page = async ({ params }: { params: Promise<{ objectId: string }> }) => {
    const { objectId } = await params
    
    try {
        const obj = await db.collection<PublicText & PublicFile>(CName.PublicText).findOne({ id: parseInt(objectId) })
        
        if (!obj) {
            return (
                <div className="flex flex-col items-center justify-center h-screen w-full bg-neutral-950">
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <circle cx="12" cy="16" r="1" />
                        </svg>
                        <span className="text-sm font-semibold text-neutral-300">No Object Found</span>
                    </div>
                    <p className="text-xs text-neutral-500">The object you are looking for does not exist or has been removed.</p>
                </div>
            )
        }

        if (obj.text) {
            return (
                <div className="rounded-md overflow-hidden border border-blue-100 mb-2">
                    <ShowText text={obj.text} language={obj.language} />
                </div>
            )
        } else if (obj.file) {
            // obj.file is now a base64 string, no need to call toString()
            return (
                <div className="rounded-md overflow-hidden border border-blue-100 mb-2">
                    <ShowFile base64={obj.file} name={obj.name} />
                </div>
            )
        } else {
            // Handle case where neither text nor file exists
            return (
                <div className="flex flex-col items-center justify-center h-screen w-full bg-neutral-950">
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <circle cx="12" cy="16" r="1" />
                        </svg>
                        <span className="text-sm font-semibold text-neutral-300">Invalid Object</span>
                    </div>
                    <p className="text-xs text-neutral-500">This object contains neither text nor file data.</p>
                </div>
            )
        }
    } catch (error) {
        console.error('Error fetching object:', error)
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-neutral-950">
                <div className="flex items-center gap-2 mb-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <circle cx="12" cy="16" r="1" />
                    </svg>
                    <span className="text-sm font-semibold text-neutral-300">Error Loading Object</span>
                </div>
                <p className="text-xs text-neutral-500">An error occurred while loading the object.</p>
            </div>
        )
    }
}

export default Page