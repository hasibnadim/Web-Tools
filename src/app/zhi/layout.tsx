"use client";
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
const navItems = [
    {
        href: "/zhi/qatarat",
        label: "Qatarāt"
    },
    {
        href: "/zhi/fenzi",
        label: "Fēnzǐ"
    }
];
const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d] flex">
            {/* Sidebar */}
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
            <aside
                className={cn(
                    "fixed w-[11rem] h-screen flex-col gap-1 flex-shrink-0 bg-[#231a36]/95 backdrop-blur-md border-r border-[#2d1e4d] shadow-lg px-3",
                    isOpen ? "flex z-20" : "hidden md:flex",
                )}
            >
                <div className="my-1 px-2">
                    <span className="text-lg font-sans text-purple-100 tracking-tight text-center font-light">My Ocean</span>
                </div>
                <nav className="flex flex-col gap-1">
                    <Link
                        href="/zhi/qatarat/create"
                        className={cn(
                            "group relative gap-1 px-2 py-1.5 rounded-md inline-flex items-center font-medium text-xs transition-all bg-gradient-to-r from-purple-900/90 to-blue-900/90 text-purple-100 hover:from-purple-800 hover:to-blue-800 hover:text-white shadow border border-purple-900/40",
                            { "ring-2 ring-purple-400/60 shadow-lg scale-[1.03]": pathname === "/myocean/create" }
                        )}
                        tabIndex={0}
                    >
                        <span className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-1 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                            <PlusIcon className="w-3 h-3 text-white" />
                        </span>
                        <span className="ml-1 font-semibold tracking-tight text-purple-100">Aḍif Qatarāh</span>
                    </Link>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-md font-medium text-sm text-left transition-all flex items-center min-h-8",
                                    isActive
                                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-sm"
                                        : "bg-[#221a3a] text-purple-200 hover:bg-[#2d1e4d] hover:text-white"
                                )}
                                tabIndex={0}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            {/* Main Content */}
            <section className="flex-1 w-full md:max-w-[calc(100%-11rem)] ml-auto bg-[#181622]">
                {children}
            </section>
        </div>
    )
}

export default Layout