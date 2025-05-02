import Link from 'next/link'
import React from 'react'
const applications = [
    {
        name: 'QR Code Generator/Scanner',
        link: '/tool/qrcode'
    },
    // {
    //     name: 'Bar Code Generator/Scanner',
    //     link: '/tool/barcode'
    // },
    {
        name: 'Image to Morse Code Converter',
        link: '/tool/image-morse'
    },

]
const page = () => {
    return (
        <div className='container mx-auto py-1'>
            <h1 className='text-3xl font-bold font-serif'>List of tools</h1>
            <hr />
            <div className='flex flex-col gap-2 py-4 justify-around  items-baseline'>
                {applications.map((app, index) => {
                    return (
                        <Link key={index} href={app.link}
                            className='inline-block p-2 rounded bg-blue-50 hover:bg-blue-200 text-xl cursor-pointer font-mono'>
                            {app.name}
                        </Link>

                    )
                })}
            </div>
        </div>
    )
}

export default page