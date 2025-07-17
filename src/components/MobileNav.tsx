"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Package, Search, LogIn } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

interface User {
  firstName: string
  picture: string
}

interface MobileNavProps {
  user: User | null
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={toggleMenu}>
          <div 
            className="absolute right-0 top-16 w-64 bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              {/* Navigation Links */}
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={toggleMenu}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              
              <Link 
                href="/kits" 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={toggleMenu}
              >
                <Package className="w-4 h-4" />
                Tools
              </Link>
              
              {user && (
                <Link 
                  href="/sea" 
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={toggleMenu}
                >
                  <Search className="w-4 h-4" />
                  Discover
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* User Section */}
              {user ? (
                <Link 
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={toggleMenu}
                >
                  <div className="relative">
                    <Image
                      className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm"
                      src={user.picture}
                      alt="Profile"
                      width={24}
                      height={24}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span>{user.firstName}</span>
                </Link>
              ) : (
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200"
                  onClick={toggleMenu}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 