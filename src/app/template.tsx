import Link from 'next/link'
import React from 'react'

const template = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-100 shadow w-full py-2 px-4 flex justify-between items-center" >
                <p className="font-bold font-mono">BAW</p>
                <ul className='flex gap-4'>
                    <li className='hover:underline cursor-pointer'><Link href="/">Home</Link></li>
                    <li className='hover:underline cursor-pointer'><Link href="/kits">Kit</Link></li>
                </ul>
            </header>
            <main className='w-full flex-1'>{children}</main>
            <footer className="bg-gray-300 w-full px-2">
                <small className='text-gray-500 text-xs'>Developed and Maintained by <a className='hover:underline' href="https://nd-resume.web.app" target="_blank" rel="noopener noreferrer"><i>H.Nadim</i></a></small>
            </footer>
        </div>
    )
}

export default template