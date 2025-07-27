import { Toaster } from '@/components/ui/sonner'
import { getUser } from '@/service/auth/auth'; 
import Link from 'next/link'
import React from 'react'
import { Package, LogIn, Home, Waves } from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import PWAInstallButton from '@/components/PWAButton'; 
import UserBullet from '@/components/UserBullet';

const template = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/90 dark:bg-slate-950/95 border-b border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-purple-800 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-lg bg-gradient-to-r from-gray-100 to-blue-200 bg-clip-text text-transparent">
                                    BAW
                                </span>
                                <span className="text-xs text-gray-300 block -mt-1">Book And Wisdom</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                href="/kit"
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                            >
                                <Package className="w-4 h-4" />
                                Tools
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        href="/ocean"
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                                    >
                                        <Waves className="w-4 h-4" />
                                        Ocean
                                    </Link> 
                                </>
                            )}
                            <PWAInstallButton />
                        </nav>

                        {/* User Menu & Mobile Nav */}
                        <div className="flex items-center gap-3">
                            {/* Desktop User Menu */}
                            <div className="hidden md:block">
                                {user ? (
                                    <UserBullet user={user} />
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-purple-800 hover:from-blue-800 hover:to-purple-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Navigation */}
                            <MobileNav user={user} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="backdrop-blur-xl bg-[#181622]/95 border-t border-[#2d1e4d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-purple-700 to-blue-800 rounded-md flex items-center justify-center">
                                <Package className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-semibold text-xs text-purple-100">书 حكمة - Shū Hikma - Book and Wisdom</span>
                        </div>
                        {/* Legal & Info Links */}
                        <div className="flex items-center gap-3">
                            <Link href="/info/about" className="text-purple-300 hover:text-blue-400 transition-colors">About</Link>
                            <Link href="/info/terms" className="text-purple-300 hover:text-blue-400 transition-colors">Terms</Link>
                            <Link href="/info/privacy" className="text-purple-300 hover:text-blue-400 transition-colors">Privacy</Link>
                            <Link href="/info/faq" className="text-purple-300 hover:text-blue-400 transition-colors">FAQ</Link>
                        </div>
                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-[11px] text-purple-400">
                            <span>Developed and Maintained By <a href="https://nd-resume.web.app" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:text-blue-300 hover:underline underline-offset-2">H.Nadim</a></span>
                        </div>
                    </div>
                </div>
            </footer>

            <Toaster position="top-right" />
        </div>
    )
}

export default template 