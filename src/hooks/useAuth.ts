'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUser, isAuthenticated, getCurrentUser } from '@/service/auth/auth'
import { ClientUser } from '@/lib/types'
import { toast } from 'sonner'

interface AuthState {
  currentUser: ClientUser | null
  profileUser: ClientUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isOwner: boolean
}

export const useAuth = (profileId?: string) => {
  const [authState, setAuthState] = useState<AuthState>({
    currentUser: null,
    profileUser: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isOwner: false,
  })

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        setAuthState({
          currentUser: null,
          profileUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isOwner: false,
        })
        return
      }
      const currentUser = await getCurrentUser()
      let profileUser: ClientUser | null = null
      let isOwner = false
      if (profileId) {
        profileUser = await getUser(profileId)
        isOwner = !!(currentUser && profileUser && currentUser._id === profileUser._id)
      }
      setAuthState({
        currentUser,
        profileUser,
        isAuthenticated: !!currentUser,
        isLoading: false,
        error: null,
        isOwner,
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        currentUser: null,
        profileUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication check failed',
        isOwner: false,
      })
    }
  }, [profileId])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      let profileUser: ClientUser | null = null
      let isOwner = false
      if (profileId) {
        profileUser = await getUser(profileId)
        isOwner = !!(currentUser && profileUser && currentUser._id === profileUser._id)
      }
      setAuthState(prev => ({
        ...prev,
        currentUser,
        profileUser,
        isAuthenticated: !!currentUser,
        error: null,
        isOwner,
      }))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      toast.error('Failed to refresh user data')
    }
  }, [profileId])

  const getUserById = useCallback(async (userId: string) => {
    try {
      const user = await getUser(userId)
      return user
    } catch {
      toast.error('Failed to load user data')
      return null
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...authState,
    checkAuth,
    refreshUser,
    getUserById,
  }
} 