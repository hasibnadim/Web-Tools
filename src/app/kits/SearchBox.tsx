"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import applications from '@/lib/applications'

import { Search, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

type Apps = typeof applications
const SearchBox = () => {
    const [show, setShow] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [results, setResults] = React.useState<Apps[keyof Apps]>([])
    
    useEffect(() => {
        if (search) {
            const results = Object.values(applications).flat().filter((app) => 
                app.name.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 5)
            setResults(results)
        } else {
            setResults([])
        }
    }, [search])
    
    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="search" 
                    placeholder="Search tools..." 
                    className="text-gray-900 w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    onBlur={() => {
                        setTimeout(() => {
                            setShow(false)
                        }, 200)
                    }} 
                    onFocus={() => setShow(true)} 
                />
            </div>
            
            {show && (
                <Card className="absolute right-0 top-12 w-full z-10 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Package className="h-4 w-4 text-blue-500" />
                            {results.length} {results.length === 1 ? 'result' : 'results'} found
                        </CardTitle>
                    </CardHeader>
                    {results.length > 0 && (
                        <CardContent className="space-y-1">
                            {results.map((tool) => (
                                <Link 
                                    key={tool.name} 
                                    href={tool.link}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                    onClick={() => setShow(false)}
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {tool.name}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                </Link>
                            ))}
                        </CardContent>
                    )}
                    {results.length === 0 && search && (
                        <CardContent>
                            <div className="text-center py-4">
                                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No tools found for &quot;{search}&quot;</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    )
}

export default SearchBox