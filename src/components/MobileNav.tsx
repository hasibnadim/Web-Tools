"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Package, LogIn, Waves } from 'lucide-react'
import { Button } from './ui/button' 
import UserBullet from './UserBullet' 
import { ClientUser } from '@/lib/types'

 

interface MobileNavProps {
  user: ClientUser | null
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
        className="p-2 text-gray-200 hover:text-blue-400 hover:bg-slate-800 bg-slate-900 z-50 relative"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={toggleMenu}>
          <div 
            className="absolute right-0 top-16 w-64 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              {/* Navigation Links */}
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                onClick={toggleMenu}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              
              <Link 
                href="/kit" 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                onClick={toggleMenu}
              >
                <Package className="w-4 h-4" />
                Tools
              </Link>
              
              {user && (
                <Link 
                  href="/ocean" 
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-200 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
                  onClick={toggleMenu}
                >
                  <Waves className="w-4 h-4" />
                  Ocean
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-slate-800 my-2"></div>

              {/* User Section */}
              {user ? (
                <UserBullet user={user} />
              ) : (
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-purple-800 hover:from-blue-800 hover:to-purple-900 rounded-lg transition-all duration-200"
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