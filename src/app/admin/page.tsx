'use client'

import { useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminApi'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  BookOpen, 
  RefreshCw,
  Activity,
  Brain,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  createdAt: string
  collegeName?: string
  role?: string
}

type AnalyticsItem = {
  role: string
  count: number
}

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useAdminDashboard()
  const [refreshing, setRefreshing] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const stats = data?.stats || {
    totalUsers: { count: 0, growth: 0 },
    totalSubjects: { count: 0, growth: 0 },
    totalCategories: { count: 0, growth: 0 },
    totalMCQSets: { count: 0, growth: 0 },
    totalBlogPosts: { count: 0, growth: 0 }
  }
  
  const recentUsers = data?.recentUsers || []
  const analytics = data?.analytics || { usersByRole: [], monthlySignups: [] }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your VTU Digital Library</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Users */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers.count}</p>
                <p className="text-xs text-blue-700 flex items-center mt-1">
                  {stats.totalUsers.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.totalUsers.growth > 0 ? '+' : ''}{stats.totalUsers.growth}% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Subjects */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalSubjects.count}</p>
                <p className="text-xs text-green-700 flex items-center mt-1">
                  {stats.totalSubjects.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.totalSubjects.growth > 0 ? '+' : ''}{stats.totalSubjects.growth}% from last month
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Categories */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalCategories.count}</p>
                <p className="text-xs text-purple-700 flex items-center mt-1">
                  {stats.totalCategories.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.totalCategories.growth > 0 ? '+' : ''}{stats.totalCategories.growth}% from last month
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total MCQ Sets */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">MCQ Sets</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalMCQSets.count}</p>
                <p className="text-xs text-orange-700 flex items-center mt-1">
                  {stats.totalMCQSets.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.totalMCQSets.growth > 0 ? '+' : ''}{stats.totalMCQSets.growth}% from last month
                </p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Blog Posts */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Blog Posts</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.totalBlogPosts.count}</p>
                <p className="text-xs text-indigo-700 flex items-center mt-1">
                  {stats.totalBlogPosts.growth > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.totalBlogPosts.growth > 0 ? '+' : ''}{stats.totalBlogPosts.growth}% from last month
                </p>
              </div>
              <FileText className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentUsers.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Latest User Registrations</h4>
                    {recentUsers.slice(0, 3).map((user: User) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.role || 'STUDENT'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Create MCQ Set
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Write Blog Post
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Subjects
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Users ({recentUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user: User) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.collegeName && (
                          <p className="text-xs text-gray-400">{user.collegeName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role || 'STUDENT'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users by Role */}
            <Card>
              <CardHeader>
                <CardTitle>Users by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.usersByRole.map((item: AnalyticsItem) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {item.role.toLowerCase()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{
                              width: `${Math.min((item.count / Math.max(...analytics.usersByRole.map(u => u.count))) * 100, 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                  {analytics.usersByRole.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.monthlySignups.slice(0, 6).map((item: any) => (
                    <div key={item.month} className="flex items-center justify-between text-sm">
                      <span>{item.month}</span>
                      <span className="font-medium">{item.signups} users</span>
                    </div>
                  ))}
                  {analytics.monthlySignups.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No signup data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}