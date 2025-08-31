import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers: { count: number; growth: number }
  totalResources: { count: number; growth: number }
  totalSubjects: { count: number; growth: number }
  totalCategories: { count: number; growth: number }
  pendingResources: { count: number; growth: number }
}

interface DashboardData {
  stats: AdminStats
  recentUsers: any[]
  recentResources: any[]
  analytics: {
    resourcesByType: Array<{ type: string; count: number }>
    usersByRole: Array<{ role: string; count: number }>
    monthlyUploads: any[]
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
  }, [params])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()
      
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.search) searchParams.set('search', params.search)
      if (params?.role) searchParams.set('role', params.role)
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

      const response = await fetch(`/api/admin/users?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const usersData = await response.json()
      setData(usersData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
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

  const updateUser = async (userId: string, updates: any) => {
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

export function useAdminResources(params?: {
  page?: number
  limit?: number
  search?: string
  type?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: string
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResources()
  }, [params])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()
      
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value) searchParams.set(key, value.toString())
      })

      const response = await fetch(`/api/admin/resources?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      
      const resourcesData = await response.json()
      setData(resourcesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const bulkAction = async (action: string, resourceIds: string[]) => {
    try {
      const response = await fetch('/api/admin/resources', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, resourceIds })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} resources`)
      }
      
      await fetchResources() // Refresh the list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} resources`)
      return false
    }
  }

  return { data, loading, error, refetch: fetchResources, bulkAction }
}

export function useAdminLogs(params?: {
  page?: number
  limit?: number
  search?: string
  action?: string
  entityType?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [params])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()
      
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value) searchParams.set(key, value.toString())
      })

      const response = await fetch(`/api/admin/logs?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      
      const logsData = await response.json()
      setData(logsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchLogs }
}

export function useAdminSettings() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async (section?: string) => {
    try {
      setLoading(true)
      const url = section ? `/api/admin/settings?section=${section}` : '/api/admin/settings'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      
      const settingsData = await response.json()
      setData(settingsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (section: string, settings: any) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ section, settings })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update settings')
      }
      
      await fetchSettings() // Refresh settings
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      return false
    }
  }

  const performAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${action}`)
      }
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action}`)
      return false
    }
  }

  return { data, loading, error, refetch: fetchSettings, updateSettings, performAction }
}
