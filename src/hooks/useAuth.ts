'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  collegeName?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue))
          } catch (error) {
            console.error('Error parsing user data from storage event:', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    // Optionally redirect to home page
    window.location.href = '/'
  }

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    login
  }
}