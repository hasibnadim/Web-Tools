'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUser, isAuthenticated, getCurrentUser } from '@/service/auth/auth'
import { ClientUser } from '@/lib/types'
import { toast } from 'sonner'

interface AuthState {
  user: ClientUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        return
      }

      const user = await getCurrentUser()
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication check failed',
      })
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
        error: null,
      }))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      toast.error('Failed to refresh user data')
    }
  }, [])

  const getUserById = useCallback(async (userId: string) => {
    try {
      const user = await getUser(userId)
      return user
    } catch (error) {
      console.error('Failed to get user by ID:', error)
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