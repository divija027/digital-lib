'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        // Clear local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
        }
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect anyway
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
