'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PDFViewer } from '@/components/PDFViewer'
import { Download, Search, Filter, FileText, Calendar, User, Eye } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description?: string
  fileName: string
  filePath: string
  fileSize: number
  type: string
  semester?: number
  year?: number
  downloads: number
  createdAt: string
  category: { name: string }
  subject?: { name: string; code: string }
  uploader: { name: string }
}

interface Category {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  semester: number
}

interface ResourceListProps {
  showFilters?: boolean
  adminView?: boolean
}

export function ResourceList({ showFilters = true, adminView = false }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingPdf, setViewingPdf] = useState<Resource | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSemester, setSelectedSemester] = useState('all')

  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedSubject && selectedSubject !== 'all') params.append('subject', selectedSubject)
      if (selectedType && selectedType !== 'all') params.append('type', selectedType)
      if (selectedSemester && selectedSemester !== 'all') params.append('semester', selectedSemester)

      const response = await fetch(`/api/resources?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setResources(data.resources)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
    }
  }

  useEffect(() => {
    fetchResources()
    if (showFilters) {
      fetchCategories()
      fetchSubjects()
    }
  }, [selectedCategory, selectedSubject, selectedType, selectedSemester])

  const handleDownload = async (resource: Resource) => {
    try {
      const filename = resource.filePath.split('/').pop()
      const response = await fetch(`/api/uploads/${filename}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = resource.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleViewPdf = (resource: Resource) => {
    if (resource.fileName.toLowerCase().endsWith('.pdf')) {
      setViewingPdf(resource)
    } else {
      // For non-PDF files, just download them
      handleDownload(resource)
    }
  }

  const getFileUrl = (resource: Resource) => {
    // Extract filename from filePath (e.g., "/uploads/123-file.pdf" -> "123-file.pdf")
    const filename = resource.filePath.split('/').pop()
    return `/api/uploads/${filename}`
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      QUESTION_PAPER: 'bg-blue-100 text-blue-800',
      STUDY_MATERIAL: 'bg-green-100 text-green-800',
      PREVIOUS_YEAR_PAPER: 'bg-purple-100 text-purple-800',
      SYLLABUS: 'bg-orange-100 text-orange-800',
      NOTES: 'bg-yellow-100 text-yellow-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[type] || colors.OTHER
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading resources...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
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

              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                <Badge className={getTypeColor(resource.type)}>
                  {resource.type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {resource.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {resource.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{resource.category.name}</span>
                  {resource.subject && (
                    <span className="text-blue-600">• {resource.subject.name}</span>
                  )}
                </div>

                {resource.semester && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Semester {resource.semester}</span>
                    {resource.year && <span>• {resource.year}</span>}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By {resource.uploader.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>{formatFileSize(resource.fileSize)}</span>
                  <span>{resource.downloads} downloads</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleViewPdf(resource)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  onClick={() => handleDownload(resource)}
                  className="flex-1"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No resources found matching your criteria.
        </div>
      )}

      {/* PDF Viewer */}
      {viewingPdf && (
        <PDFViewer
          fileUrl={getFileUrl(viewingPdf)}
          fileName={viewingPdf.fileName}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </div>
  )
}
