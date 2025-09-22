'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        // Use the auth hook logout function
        logout()
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: logout anyway
      logout()
      router.push('/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
    >
      Logout
    </button>
  )
}
