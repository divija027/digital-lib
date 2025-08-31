'use client'

import { useState, useEffect } from 'react'
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
  Upload, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  description?: string
  fileName: string
  fileSize: number
  mimeType: string
  type: 'QUESTION_PAPER' | 'STUDY_MATERIAL' | 'PREVIOUS_YEAR_PAPER' | 'SYLLABUS' | 'NOTES' | 'OTHER'
  semester?: number
  year?: number
  createdAt: string
  updatedAt: string
  downloadCount: number
  isApproved: boolean
  category: {
    id: string
    name: string
  }
  subject?: {
    id: string
    name: string
    code: string
  }
  uploadedBy: {
    id: string
    name: string
  }
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, searchTerm, selectedType, selectedCategory, selectedStatus])

  const fetchResources = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Computer Networks - Module 1',
          description: 'Introduction to computer networks and OSI model',
          fileName: 'CN_Module1.pdf',
          fileSize: 2048000,
          mimeType: 'application/pdf',
          type: 'STUDY_MATERIAL',
          semester: 5,
          year: 2024,
          createdAt: '2024-08-25T10:30:00Z',
          updatedAt: '2024-08-25T10:30:00Z',
          downloadCount: 234,
          isApproved: true,
          category: { id: '1', name: 'Computer Science' },
          subject: { id: '1', name: 'Computer Networks', code: 'CS501' },
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '2',
          title: 'Database Systems Question Paper - 2023',
          description: 'Previous year question paper for Database Systems',
          fileName: 'DBMS_QP_2023.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf',
          type: 'PREVIOUS_YEAR_PAPER',
          semester: 4,
          year: 2023,
          createdAt: '2024-08-20T14:15:00Z',
          updatedAt: '2024-08-20T14:15:00Z',
          downloadCount: 189,
          isApproved: true,
          category: { id: '1', name: 'Computer Science' },
          subject: { id: '2', name: 'Database Systems', code: 'CS401' },
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '3',
          title: 'Operating Systems Notes',
          description: 'Comprehensive notes covering all OS concepts',
          fileName: 'OS_Notes.pdf',
          fileSize: 3072000,
          mimeType: 'application/pdf',
          type: 'NOTES',
          semester: 4,
          year: 2024,
          createdAt: '2024-08-15T09:45:00Z',
          updatedAt: '2024-08-15T09:45:00Z',
          downloadCount: 156,
          isApproved: false,
          category: { id: '1', name: 'Computer Science' },
          subject: { id: '3', name: 'Operating Systems', code: 'CS402' },
          uploadedBy: { id: '1', name: 'Admin User' }
        },
        {
          id: '4',
          title: 'Digital Electronics Syllabus',
          fileName: 'DE_Syllabus.pdf',
          fileSize: 512000,
          mimeType: 'application/pdf',
          type: 'SYLLABUS',
          semester: 3,
          year: 2024,
          createdAt: '2024-08-10T16:20:00Z',
          updatedAt: '2024-08-10T16:20:00Z',
          downloadCount: 98,
          isApproved: true,
          category: { id: '2', name: 'Electronics' },
          subject: { id: '4', name: 'Digital Electronics', code: 'EC301' },
          uploadedBy: { id: '1', name: 'Admin User' }
        }
      ]
      setResources(mockResources)
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = resources

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category.id === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(resource => 
        selectedStatus === 'approved' ? resource.isApproved : !resource.isApproved
      )
    }

    setFilteredResources(filtered)
  }

  const handleApprove = async (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isApproved: true }
        : resource
    ))
  }

  const handleReject = async (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isApproved: false }
        : resource
    ))
  }

  const handleDelete = async (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      setResources(prev => prev.filter(resource => resource.id !== resourceId))
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'QUESTION_PAPER': 'bg-blue-100 text-blue-800',
      'STUDY_MATERIAL': 'bg-green-100 text-green-800',
      'PREVIOUS_YEAR_PAPER': 'bg-purple-100 text-purple-800',
      'SYLLABUS': 'bg-orange-100 text-orange-800',
      'NOTES': 'bg-cyan-100 text-cyan-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStats = () => {
    const totalResources = resources.length
    const approvedResources = resources.filter(r => r.isApproved).length
    const pendingResources = resources.filter(r => !r.isApproved).length
    const totalDownloads = resources.reduce((sum, r) => sum + r.downloadCount, 0)

    return { totalResources, approvedResources, pendingResources, totalDownloads }
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
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-2">Manage uploaded files and approve content</p>
        </div>
        <Link href="/admin/resources/upload">
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="QUESTION_PAPER">Question Paper</SelectItem>
                  <SelectItem value="STUDY_MATERIAL">Study Material</SelectItem>
                  <SelectItem value="PREVIOUS_YEAR_PAPER">Previous Year Paper</SelectItem>
                  <SelectItem value="SYLLABUS">Syllabus</SelectItem>
                  <SelectItem value="NOTES">Notes</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="1">Computer Science</SelectItem>
                  <SelectItem value="2">Electronics</SelectItem>
                  <SelectItem value="3">Mechanical</SelectItem>
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">
                          {resource.title}
                        </p>
                        {resource.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {resource.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">{resource.fileName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{resource.subject?.name || '-'}</p>
                        <p className="text-gray-500">
                          {resource.subject?.code} • Sem {resource.semester}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={resource.isApproved ? 'default' : 'secondary'}
                      >
                        {resource.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{resource.downloadCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatFileSize(resource.fileSize)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(resource.createdAt)}</p>
                        <p className="text-gray-500">by {resource.uploadedBy.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!resource.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(resource.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                        )}
                        {resource.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(resource.id)}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Reject
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(resource.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria.' 
                  : 'No resources have been uploaded yet.'
                }
              </p>
              {!searchTerm && selectedType === 'all' && selectedCategory === 'all' && selectedStatus === 'all' && (
                <Link href="/admin/resources/upload">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Resource
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
