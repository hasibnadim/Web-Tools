"use client"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import applications from '@/lib/applications'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

type Apps = typeof applications
const SearchBox = () => {
    const [show, setShow] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [results, setResults] = React.useState<Apps[keyof Apps]>([])
    useEffect(() => {
        if (search) {
            const results = Object.values(applications).flat().filter((app) => app.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3)
            setResults(results)
        } else {
            setResults([])
        }
    }, [search])
    return (
        <div className='flex focus-within:border-blue-500 border rounded m-1 mb-3 lg:m-4 relative'>
            <Search className='m-2' />
            <input type="search" placeholder='Search' className='w-full p-2 rounded outline-none border-none' value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => {
                setTimeout(() => {
                    setShow(false)
                }, 200)
            }} onFocus={() => setShow(true)} />
            <Card className={cn('absolute right-0 top-11 w-full z-10', {
                hidden: !show
            })}>
                <CardHeader>{results.length} results found</CardHeader>
                {results.length > 0 && <CardContent>
                    {results.map((tool) => (
                        <Link key={tool.name} href={tool.link} target="_blank" rel="noopener noreferrer"
                            className='block p-2 rounded text-sm my-1 font-mono hover:bg-blue-50'>
                            {tool.name}
                        </Link>

                    ))}
                </CardContent>}
            </Card>
        </div>
    )
}

export default SearchBox