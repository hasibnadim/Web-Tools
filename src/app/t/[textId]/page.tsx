'use server'
import db, { CName } from '@/service/mongodb'
import { PublicText } from '@/service/publicText/interface'
import React from 'react'
import ShowText from './ShowText'

const Page = async ({ params }: { params: Promise<{ textId: string }> }) => {
    const { textId } = await params
    const text = await db.collection<PublicText>(CName.PublicText).findOne({ id: textId })
    if (!text) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-neutral-950">
                <div className="flex items-center gap-2 mb-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" className="text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <circle cx="12" cy="16" r="1" />
                    </svg>
                    <span className="text-sm font-semibold text-neutral-300">Text Not Found</span>
                </div>
                <p className="text-xs text-neutral-500">The text you are looking for does not exist or has been removed.</p>
            </div>
        )
    }
    return (
        <div className="rounded-md overflow-hidden border border-blue-100 mb-2">
            <ShowText text={text.text} language={text.language} />
        </div>
    )
}

export default Page