import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers: { count: number; growth: number }
  totalSubjects: { count: number; growth: number }
  totalCategories: { count: number; growth: number }
  totalMCQSets: { count: number; growth: number }
  totalBlogPosts: { count: number; growth: number }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}



interface MonthlyUpload {
  month: string
  uploads: number
}

interface DashboardData {
  stats: AdminStats
  recentUsers: User[]
  analytics: {
    usersByRole: Array<{ role: string; count: number }>
    monthlySignups: Array<{ month: string; signups: number }>
  }
}

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const dashboardData = await response.json()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchDashboardData }
}

export function useAdminUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  sortBy?: string
  sortOrder?: string
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [JSON.stringify(params)])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('fetchUsers called with params:', params)
      
      const searchParams = new URLSearchParams()
      
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.search) searchParams.set('search', params.search)
      if (params?.role) searchParams.set('role', params.role)
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

      const url = `/api/admin/users?${searchParams}`
      console.log('Fetching from URL:', url)

      const response = await fetch(url)
      console.log('Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }
      
      const usersData = await response.json()
      console.log('Users data received:', usersData)
      setData(usersData)
      setError(null)
    } catch (err) {
      console.error('Error in fetchUsers:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      await fetchUsers() // Refresh the list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      return false
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      await fetchUsers() // Refresh the list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      return false
    }
  }

  return { data, loading, error, refetch: fetchUsers, deleteUser, updateUser }
}


