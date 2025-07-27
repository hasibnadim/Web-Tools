"use client"
import React, { useState } from 'react'
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import applications from "@/lib/applications";
import { cn } from '@/lib/utils';
const Sidebar = () => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    const [isOpen, setIsOpen] = useState(false);

    const toggleCategory = (category: string) => {
        setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("fixed md:hidden left-0 top-16 bg-gradient-to-br from-slate-900 to-indigo-800 text-white shadow-lg px-1 py-2 rounded-r-full z-30 flex items-center justify-center border  hover:scale-105 active:scale-95 transition-all duration-200",
                    {
                        "left-[11rem]": isOpen
                    }
                )}
                aria-label="Open sidebar menu"
            >
                {isOpen ?
                    <ChevronLeft className="w-5 h-5" />:
                    <ChevronRight className="w-5 h-5" />
                }
            </button>
            <aside className={cn("w-[11rem] fixed top-16 left-0 h-[calc(100vh-var(--spacing)*16)] bg-[#231a36]/95 border-r border-[#2d1e4d] flex-col",
                isOpen ? "flex z-20" : "hidden md:flex",
            )}>
                <div className="px-3 py-3">
                    <h2 className="text-base font-sans text-center text-gray-100 tracking-tight">Tools</h2>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
                    {Object.entries(applications).map(([category, tools]) => (
                        <div key={category}>
                            <button
                                className="flex items-center w-full px-2 py-1.5 text-xs font-semibold text-gray-300 hover:text-blue-400 focus:outline-none transition group"
                                onClick={() => toggleCategory(category)}
                                aria-expanded={!!openCategories[category]}
                            >
                                <span className="flex-1 text-left truncate">{category}</span>
                                {openCategories[category] ? (
                                    <ChevronDown className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-400 transition" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-400 transition" />
                                )}
                            </button>
                            {openCategories[category] && (
                                <ul className="pl-3 py-1 space-y-1">
                                    {tools.map((tool) => (
                                        <li key={tool.name}>
                                            <Link
                                                href={tool.link}
                                                className="flex items-center gap-2 px-2 py-1.5 rounded-4xl text-xs text-gray-200 hover:bg-slate-800 hover:text-blue-400 transition"
                                            >
                                                <tool.icon className="w-4 h-4 text-blue-400 shrink-0" />
                                                <span className="truncate">{tool.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                     
                </nav>
            </aside>
        </>
    )
}

export default Sidebar