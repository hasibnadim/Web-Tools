import Link from 'next/link'
import React from 'react'

const template = ({ children }: { children: React.ReactNode }) => {
    return (<>
        <header className="bg-gray-100 shadow w-full py-2 px-4 flex justify-between items-center" >
            <p className="font-bold font-mono">WT</p>
            <ul className='flex gap-4'>
                <li className='hover:underline cursor-pointer'><Link href="/">Home</Link></li>
                <li className='hover:underline cursor-pointer'><Link href="/tools">Tools</Link></li>
            </ul>
        </header>
        <main className='w-full h-full'>{children}</main>
        <footer className="bg-gray-300 w-full p-2">
            <p className='text-sm'>Powered by <a className='hover:underline' href="https://nd-resume.web.app" target="_blank" rel="noopener noreferrer">Eng. MD Hasib Nadim</a></p>
        </footer>
    </>
    )
}

export default template