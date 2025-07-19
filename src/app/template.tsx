import { Toaster } from '@/components/ui/sonner'
import { getUser } from '@/service/auth/auth';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { Package, LogIn, Home, Github, Waves } from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import PWAInstallButton from '@/components/PWAButton';
  
const template = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                                    BAW
                                </span>
                                <span className="text-xs text-gray-500 block -mt-1">Book And Wisdom</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                href="/kits"
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                <Package className="w-4 h-4" />
                                Tools
                            </Link>
                            {user && (
                                <Link
                                    href="/ocean"
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                >
                                    <Waves className="w-4 h-4" />
                                    Ocean
                                </Link>
                            )}
                            <PWAInstallButton />
                        </nav>

                        {/* User Menu & Mobile Nav */}
                        <div className="flex items-center gap-3">
                            {/* Desktop User Menu */}
                            <div className="hidden md:block">
                                {user ? (
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    >
                                        <div className="relative">
                                            <Image
                                                className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm"
                                                src={user.picture}
                                                alt="Profile"
                                                width={28}
                                                height={28}
                                            />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <span>{user.firstName}</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
            <footer className="backdrop-blur-xl bg-white/60 border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                                <Package className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-sm text-gray-900">书 حكمة - Shū Hikma</span>
                                <p className="text-xs text-gray-500">Book and Wisdom</p>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-sm">
                            <a
                                href="https://github.com/hasibnadim/web-tools"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                <Github className="w-4 h-4" />
                                <span className="hidden sm:block">GitHub</span>
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="text-xs text-gray-500 text-center md:text-right">
                            <p>Developed and maintained by <a
                                href="https://nd-resume.web.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-2"
                            >
                                H.Nadim
                            </a></p>
                            <p className="mt-1">© 2026 BAW Unified Platform. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            <Toaster position="top-right" />
        </div>
    )
}

export default template