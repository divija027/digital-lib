'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  FileText, 
  Download, 
  Search,
  Grid3X3,
  List,
  Star,
  Clock,
  Eye,
  BookMarked,
  FileQuestion,
  GraduationCap,
  BookCheck,
  Share
} from 'lucide-react'

interface ResourceCategoriesProps {
  subject?: string
  semester?: number | string
  branch?: string
}

// Resource Categories for question papers focus
const RESOURCE_CATEGORIES = [
  {
    id: 'question-papers',
    name: 'Question Papers',
    description: 'Previous year and main exam papers',
    icon: FileQuestion,
    color: 'bg-blue-500',
    count: 45
  },
  {
    id: 'model-papers',
    name: 'Model Papers',
    description: 'Model question papers and practice tests',
    icon: BookMarked,
    color: 'bg-orange-500',
    count: 25
  },
  {
    id: 'notes',
    name: 'Study Notes',
    description: 'Comprehensive notes and study materials',
    icon: BookOpen,
    color: 'bg-green-500',
    count: 78
  },
  {
    id: 'syllabus',
    name: 'Syllabus',
    description: 'Official syllabus and course structure',
    icon: GraduationCap,
    color: 'bg-purple-500',
    count: 12
  },
  {
    id: 'assignments',
    name: 'Assignments',
    description: 'Practice assignments and solutions',
    icon: BookCheck,
    color: 'bg-red-500',
    count: 34
  }
]

// Sample resources with question papers focus
const SAMPLE_RESOURCES = [
  {
    id: '1',
    title: 'Data Structures - Main Exam 2023',
    subject: 'Data Structures and Applications',
    type: 'question-papers',
    format: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    downloads: 1250,
    rating: 4.8,
    year: 2023,
    examType: 'Main Exam',
    tags: ['2023', 'main-exam', 'theory'],
    description: 'Complete question paper with solutions from December 2023 main examination'
  },
  {
    id: '2',
    title: 'Data Structures - Supplementary 2023',
    subject: 'Data Structures and Applications',
    type: 'question-papers',
    format: 'PDF',
    size: '3.1 MB',
    uploadDate: '2024-01-20',
    downloads: 980,
    rating: 4.6,
    year: 2023,
    examType: 'Supplementary',
    tags: ['2023', 'supplementary', 'theory'],
    description: 'Supplementary examination question paper with detailed solutions'
  },
  {
    id: '3',
    title: 'Data Structures - Model Paper 2024',
    subject: 'Data Structures and Applications',
    type: 'model-papers',
    format: 'PDF',
    size: '2.8 MB',
    uploadDate: '2024-01-30',
    downloads: 875,
    rating: 4.5,
    year: 2024,
    examType: 'Model Paper',
    tags: ['2024', 'model-paper', 'practice'],
    description: 'Official model question paper for preparation and practice'
  },
  {
    id: '4',
    title: 'Data Structures - Main Exam 2022',
    subject: 'Data Structures and Applications',
    type: 'question-papers',
    format: 'PDF',
    size: '4.2 MB',
    uploadDate: '2024-02-05',
    downloads: 1150,
    rating: 4.7,
    year: 2022,
    examType: 'Main Exam',
    tags: ['2022', 'main-exam', 'solved'],
    description: 'Previous year question paper with step-by-step solutions'
  },
  {
    id: '5',
    title: 'Data Structures - Main Exam 2021',
    subject: 'Data Structures and Applications',
    type: 'question-papers',
    format: 'PDF',
    size: '3.5 MB',
    uploadDate: '2024-02-10',
    downloads: 1420,
    rating: 4.9,
    year: 2021,
    examType: 'Main Exam',
    tags: ['2021', 'main-exam', 'solutions'],
    description: 'Complete question paper with detailed explanations and marking scheme'
  },
  {
    id: '6',
    title: 'Complete Study Notes - Data Structures',
    subject: 'Data Structures and Applications',
    type: 'notes',
    format: 'PDF',
    size: '8.5 MB',
    uploadDate: '2024-01-25',
    downloads: 3200,
    rating: 4.7,
    year: 2024,
    tags: ['complete', 'notes', 'comprehensive'],
    description: 'Comprehensive study notes covering all topics with examples and practice problems'
  },
  {
    id: '7',
    title: 'Official Syllabus - 2024 Scheme',
    subject: 'Data Structures and Applications',
    type: 'syllabus',
    format: 'PDF',
    size: '0.8 MB',
    uploadDate: '2024-01-05',
    downloads: 5600,
    rating: 5.0,
    year: 2024,
    tags: ['syllabus', 'official', '2024'],
    description: 'Official VTU syllabus document for 2024 scheme'
  },
  {
    id: '8',
    title: 'Practice Assignment with Solutions',
    subject: 'Data Structures and Applications',
    type: 'assignments',
    format: 'PDF',
    size: '1.5 MB',
    uploadDate: '2024-01-12',
    downloads: 890,
    rating: 4.4,
    year: 2024,
    tags: ['assignment', 'practice', 'solutions'],
    description: 'Practice assignment covering important topics with detailed solutions'
  }
]

export function ResourceCategories({ subject, semester, branch }: ResourceCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [resources] = useState(SAMPLE_RESOURCES)

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory
    const matchesYear = selectedYear === null || resource.year === selectedYear
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = !subject || resource.subject.toLowerCase().includes(subject.toLowerCase())
    
    return matchesCategory && matchesYear && matchesSearch && matchesSubject
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case 'popular':
        return b.downloads - a.downloads
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.title.localeCompare(b.title)
      case 'year':
        return (b.year || 0) - (a.year || 0)
      default:
        return 0
    }
  })

  // Generate years (last 5 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Question Papers & Resources</h2>
            <p className="text-gray-600">
              {subject && semester && branch 
                ? `${subject} • Semester ${semester} • ${branch}`
                : 'Browse and download question papers and study materials'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search question papers, notes, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest First</option>
            <option value="popular">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
            <option value="year">By Year</option>
          </select>
        </div>
      </div>

      {/* Year Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Filter by Year</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedYear === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedYear(null)}
            className="h-9"
          >
            All Years
          </Button>
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className="h-9"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Resource Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedCategory === 'all' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">All Resources</h3>
              <p className="text-xs text-gray-600 mb-2">View everything</p>
              <Badge variant="secondary">{resources.length} items</Badge>
            </CardContent>
          </Card>

          {RESOURCE_CATEGORIES.map((category) => {
            const Icon = category.icon
            const categoryCount = resources.filter(r => r.type === category.id).length
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                  <Badge variant="secondary">{categoryCount} items</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Resources Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {sortedResources.length} of {resources.length} resources
            {selectedYear && ` for year ${selectedYear}`}
          </p>
          
          {(selectedCategory !== 'all' || selectedYear !== null) && (
            <div className="flex gap-2">
              {selectedCategory !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Clear Category
                </Button>
              )}
              {selectedYear !== null && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedYear(null)}
                >
                  Clear Year
                </Button>
              )}
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResources.map((resource) => (
              <ResourceListItem key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {sortedResources.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No resources match "${searchTerm}"`
                : 'No resources available for the selected filters'
              }
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedYear(null)
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ResourceType {
  id: string
  title: string
  type: string
  description?: string
  fileUrl?: string
  createdAt?: string
  subject?: string
  format?: string
  size?: string
  uploadDate?: string
  downloads?: number
  rating?: number
  year?: number
  examType?: string
  tags?: string[]
}

// Resource Card Component
function ResourceCard({ resource }: { resource: ResourceType }) {
  const category = RESOURCE_CATEGORIES.find(c => c.id === resource.type)
  const Icon = category?.icon || FileText

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 ${category?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span>{resource.rating}</span>
              </div>
              {resource.year && (
                <Badge variant="outline" className="text-xs">
                  {resource.year}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags?.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags && resource.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{resource.tags?.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs text-gray-500 mt-auto">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {resource.downloads?.toLocaleString() || '0'}
              </span>
              <span>{resource.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.uploadDate ? new Date(resource.uploadDate).toLocaleDateString() : 'N/A'}
              </span>
              <span className="uppercase">{resource.format}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t mt-4">
          <Button size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Resource List Item Component
function ResourceListItem({ resource }: { resource: ResourceType }) {
  const category = RESOURCE_CATEGORIES.find(c => c.id === resource.type)
  const Icon = category?.icon || FileText

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 ${category?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-sm text-yellow-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{resource.rating}</span>
                </div>
                {resource.year && (
                  <Badge variant="outline" className="text-xs">
                    {resource.year}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {resource.downloads?.toLocaleString() || '0'} downloads
              </span>
              <span>{resource.size}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.uploadDate ? new Date(resource.uploadDate).toLocaleDateString() : 'N/A'}
              </span>
              <span className="uppercase font-medium">{resource.format}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {resource.tags?.slice(0, 4).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags && resource.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{resource.tags?.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
