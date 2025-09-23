'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  History, 
  Search, 
  Filter, 
  Download,
  Eye,
  User,
  FileText,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  action: string
  resource: string
  resourceId?: string
  userId: string
  userName: string
  userRole: 'ADMIN' | 'STUDENT'
  ipAddress: string
  userAgent: string
  status: 'SUCCESS' | 'FAILURE' | 'WARNING'
  details?: string
  metadata?: Record<string, string | number | boolean>
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d')
  const [isLoading, setIsLoading] = useState(true)

  const filterLogs = useCallback(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction)
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userRole === selectedUser)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(log => log.status === selectedStatus)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedAction, selectedUser, selectedStatus])

  useEffect(() => {
    fetchLogs()
  }, [selectedPeriod])

  useEffect(() => {
    filterLogs()
  }, [filterLogs])

  const fetchLogs = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-08-30T09:15:00Z',
          action: 'LOGIN',
          resource: 'AUTH',
          userId: '1',
          userName: 'Admin User',
          userRole: 'ADMIN',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS'
        },
        {
          id: '2',
          timestamp: '2024-08-30T09:20:00Z',
          action: 'UPLOAD_RESOURCE',
          resource: 'RESOURCE',
          resourceId: '42',
          userId: '1',
          userName: 'Admin User',
          userRole: 'ADMIN',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: 'Uploaded "Computer Networks - Module 1.pdf"',
          metadata: { fileSize: 2048000, category: 'Computer Science' }
        },
        {
          id: '3',
          timestamp: '2024-08-30T08:45:00Z',
          action: 'LOGIN',
          resource: 'AUTH',
          userId: '2',
          userName: 'john@student.vtu.ac.in',
          userRole: 'STUDENT',
          ipAddress: '10.0.0.45',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
          status: 'FAILURE',
          details: 'Invalid password attempt'
        },
        {
          id: '4',
          timestamp: '2024-08-30T08:30:00Z',
          action: 'DOWNLOAD_RESOURCE',
          resource: 'RESOURCE',
          resourceId: '38',
          userId: '3',
          userName: 'jane@student.vtu.ac.in',
          userRole: 'STUDENT',
          ipAddress: '172.16.0.25',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'SUCCESS',
          details: 'Downloaded "Database Systems Question Paper 2023.pdf"'
        },
        {
          id: '5',
          timestamp: '2024-08-30T07:15:00Z',
          action: 'CREATE_USER',
          resource: 'USER',
          resourceId: '5',
          userId: '1',
          userName: 'Admin User',
          userRole: 'ADMIN',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: 'Created student account for sarah@student.vtu.ac.in'
        },
        {
          id: '6',
          timestamp: '2024-08-29T18:45:00Z',
          action: 'UPDATE_SETTINGS',
          resource: 'SYSTEM',
          userId: '1',
          userName: 'Admin User',
          userRole: 'ADMIN',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'SUCCESS',
          details: 'Updated upload settings',
          metadata: { maxFileSize: '10MB', requireApproval: true }
        },
        {
          id: '7',
          timestamp: '2024-08-29T16:30:00Z',
          action: 'DELETE_RESOURCE',
          resource: 'RESOURCE',
          resourceId: '35',
          userId: '1',
          userName: 'Admin User',
          userRole: 'ADMIN',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'WARNING',
          details: 'Deleted resource "Outdated Syllabus.pdf" due to policy violation'
        }
      ]
      setLogs(mockLogs)
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      LOGIN: User,
      LOGOUT: User,
      UPLOAD_RESOURCE: FileText,
      DOWNLOAD_RESOURCE: Download,
      DELETE_RESOURCE: XCircle,
      CREATE_USER: User,
      UPDATE_USER: User,
      UPDATE_SETTINGS: Settings,
      VIEW_RESOURCE: Eye
    }
    return icons[action] || AlertTriangle
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FAILURE':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800'
      case 'FAILURE':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStats = () => {
    const totalLogs = logs.length
    const successLogs = logs.filter(l => l.status === 'SUCCESS').length
    const failureLogs = logs.filter(l => l.status === 'FAILURE').length
    const warningLogs = logs.filter(l => l.status === 'WARNING').length

    return { totalLogs, successLogs, failureLogs, warningLogs }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Monitor system activity and user actions</p>
        </div>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failureLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.warningLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="UPLOAD_RESOURCE">Upload</SelectItem>
                  <SelectItem value="DOWNLOAD_RESOURCE">Download</SelectItem>
                  <SelectItem value="DELETE_RESOURCE">Delete</SelectItem>
                  <SelectItem value="UPDATE_SETTINGS">Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>User Type</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILURE">Failure</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action)
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(log.timestamp)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ActionIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">
                            {log.action.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.userRole === 'ADMIN' ? (
                            <Shield className="h-4 w-4 text-purple-600" />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{log.userName}</p>
                            <Badge variant="secondary" className="text-xs">
                              {log.userRole}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{log.resource}</span>
                        {log.resourceId && (
                          <span className="text-xs text-gray-400 block">
                            ID: {log.resourceId}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 font-mono">
                          {log.ipAddress}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {log.details && (
                            <p className="text-sm text-gray-600 truncate">
                              {log.details}
                            </p>
                          )}
                          {log.metadata && (
                            <p className="text-xs text-gray-400 mt-1">
                              Additional data available
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedAction !== 'all' || selectedUser !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria.' 
                  : 'No audit logs available for the selected time period.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
