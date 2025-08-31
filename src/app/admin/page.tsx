'use client'

import { useState } from 'react'
import { ResourceUpload } from '@/components/admin/ResourceUpload'
import { useAdminDashboard } from '@/hooks/useAdminApi'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp,
  Settings,
  RefreshCw,
  Activity,
  AlertCircle,
  Download
} from 'lucide-react'

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useAdminDashboard()
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="text-red-600">Error: {error}</span>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalUsers: { count: 0, growth: 0 },
    totalResources: { count: 0, growth: 0 },
    totalSubjects: { count: 0, growth: 0 },
    totalCategories: { count: 0, growth: 0 },
    pendingResources: { count: 0, growth: 0 }
  }

  const recentUsers = data?.recentUsers || []
  const recentResources = data?.recentResources || []
  const analytics = data?.analytics || {
    resourcesByType: [],
    usersByRole: [],
    monthlyUploads: []
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage VTU resources, users, and content</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Resources</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalResources.count}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.totalResources.growth > 0 ? '+' : ''}{stats.totalResources.growth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Users</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalUsers.count}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.totalUsers.growth > 0 ? '+' : ''}{stats.totalUsers.growth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Subjects</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalSubjects.count}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {stats.totalSubjects.growth > 0 ? '+' : ''}{stats.totalSubjects.growth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Categories</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalCategories.count}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {stats.totalCategories.growth > 0 ? '+' : ''}{stats.totalCategories.growth}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Pending</p>
                <p className="text-2xl font-bold text-red-900">{stats.pendingResources.count}</p>
                <p className="text-xs text-red-600 mt-1">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <Upload className="h-5 w-5" />
                <span className="text-sm">Upload Resource</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Add Branch</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                <Settings className="h-5 w-5" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentUsers.length > 0 || recentResources.length > 0 ? (
                <>
                  {recentUsers.slice(0, 3).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-500">
                          {user.name} ({user.email}) • {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentResources.slice(0, 2).map((resource: any) => (
                    <div key={resource.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New resource uploaded</p>
                        <p className="text-xs text-gray-500">
                          {resource.title} • {resource.downloads} downloads
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resource Distribution by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.resourcesByType.map((item: any) => (
                        <div key={item.type} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{item.type.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      ))}
                      {analytics.resourcesByType.length === 0 && (
                        <p className="text-sm text-gray-500">No resource data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Distribution by Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.usersByRole.map((item: any) => (
                        <div key={item.role} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{item.role}</span>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      ))}
                      {analytics.usersByRole.length === 0 && (
                        <p className="text-sm text-gray-500">No user data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6 mt-6">
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm">Resource upload interface</p>
                <p className="text-xs text-gray-400 mt-1">Navigate to Resources → Upload for full upload functionality</p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.monthlyUploads.map((month: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {new Date(month.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-sm font-medium">{month.uploads} uploads</span>
                        </div>
                      ))}
                      {analytics.monthlyUploads.length === 0 && (
                        <p className="text-sm text-gray-500">No upload data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentResources
                        .sort((a: any, b: any) => b.downloads - a.downloads)
                        .slice(0, 5)
                        .map((resource: any) => (
                          <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium truncate">{resource.title}</span>
                            <Badge variant="secondary">{resource.downloads} downloads</Badge>
                          </div>
                        ))}
                      {recentResources.length === 0 && (
                        <p className="text-sm text-gray-500">No resource data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database Status</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Storage Usage</span>
                        <Badge variant="secondary">75% used</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Sessions</span>
                        <Badge variant="secondary">{stats.totalUsers.count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Resources</h3>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Resources
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentResources.map((resource: any) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {resource.category?.name} • Uploaded by {resource.uploader?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <Download className="h-3 w-3 mr-1" />
                            {resource.downloads}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                    {recentResources.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm">No resources available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Users</h3>
                <Button size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.collegeName} • Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                    {recentUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm">No users available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
