import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import applications from '@/lib/applications'
import Link from 'next/link'
import React from 'react'
import SearchBox from './SearchBox'
import { Grid, Package, Code, Zap, ArrowRight } from 'lucide-react'
 
const page = () => {
    const categoryIcons = {
        "Generator Kit": Zap,
        "Conversion Kit": Grid,
        "Developer Suite": Code
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
                            <Package className="h-4 w-4 text-blue-300" />
                            <span className="text-xs font-medium text-gray-200">Tools Collection</span>
                        </div>
                        
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                            Tool Kits
                        </h1>
                        
                        <p className="text-base text-gray-400 max-w-xl mx-auto">
                            Essential tools for developers, designers, and creators
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <SearchBox />
                    </div>

                    {/* Tools Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(applications).map(([category, tools]) => {
                            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Package;
                            
                            return (
                                <Card key={category} className="bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                                            <div className="p-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg">
                                                <IconComponent className="h-4 w-4 text-white" />
                                            </div>
                                            {category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {tools.map((tool) => (
                                            <Link 
                                                key={tool.name} 
                                                href={tool.link}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-900/80 transition-colors duration-200 group"
                                            >
                                                <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                                                    {tool.name}
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                                            </Link>
                                        ))}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-4 bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-100">
                                    {Object.values(applications).flat().length}
                                </div>
                                <div className="text-xs text-gray-400">Total Tools</div>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-100">
                                    {Object.keys(applications).length}
                                </div>
                                <div className="text-xs text-gray-400">Categories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page