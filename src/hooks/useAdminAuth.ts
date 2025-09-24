'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAllowed } from '@/lib/admin-rbac'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          
          // Check admin access
          if (!isAdminAllowed(data.user.email, data.user.role)) {
            throw new Error('Not authorized for admin access')
          }
          
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          throw new Error('Authentication failed')
        }
      } catch (error) {
        console.error('Admin auth failed:', error)
        setUser(null)
        setIsAuthenticated(false)
        router.replace('/404')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAuth()
  }, [router])

  return { user, isLoading, isAuthenticated }
}