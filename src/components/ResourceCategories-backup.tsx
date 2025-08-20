'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Download, 
  Eye, 
  BookOpen, 
  FileQuestion,
  GraduationCap,
  NotebookPen,
  FileBarChart,
  Calendar,
  Clock,
  Star,
  Filter,
  Search,
  SortAsc,
  Grid3X3,
  List,
  Share
} from 'lucide-react'

const RESOURCE_CATEGORIES = [
  {
    id: 'question-papers',
    name: 'Question Papers',
    icon: FileQuestion,
    description: 'Previous year question papers and model papers',
    color: 'bg-blue-500',
    count: 45
  },
  {
    id: 'notes',
    name: 'Study Notes',
    icon: NotebookPen,
    description: 'Comprehensive notes and study materials',
    color: 'bg-green-500',
    count: 78
  },
  {
    id: 'syllabus',
    name: 'Syllabus',
    icon: FileBarChart,
    description: 'Official syllabus and curriculum documents',
    color: 'bg-purple-500',
    count: 12
  },
  {
    id: 'materials',
    name: 'Study Materials',
    icon: BookOpen,
    description: 'Reference books, handouts, and additional materials',
    color: 'bg-orange-500',
    count: 34
  }
]

// Sample resource data
const SAMPLE_RESOURCES = [
  {
    id: '1',
    title: 'Data Structures - Final Exam 2023',
    type: 'question-papers',
    subject: 'Data Structures',
    semester: 3,
    year: 2023,
    fileSize: '2.4 MB',
    downloads: 1247,
    rating: 4.8,
    uploadDate: '2023-12-15',
    tags: ['final-exam', 'theory'],
    description: 'Complete question paper with solutions'
  },
  {
    id: '2',
    title: 'Object Oriented Programming Complete Notes',
    type: 'notes',
    subject: 'OOP with Java',
    semester: 3,
    year: 2024,
    fileSize: '15.6 MB',
    downloads: 892,
    rating: 4.6,
    uploadDate: '2024-01-20',
    tags: ['complete-notes', 'java', 'concepts'],
    description: 'Comprehensive notes covering all OOP concepts with examples'
  },
  {
    id: '3',
    title: 'Computer Networks Syllabus VTU 2022 Scheme',
    type: 'syllabus',
    subject: 'Computer Networks',
    semester: 5,
    year: 2024,
    fileSize: '856 KB',
    downloads: 567,
    rating: 4.9,
    uploadDate: '2024-02-10',
    tags: ['official', '2022-scheme'],
    description: 'Official VTU syllabus for Computer Networks'
  }
]

interface ResourceCategoriesProps {
  subject?: string
  semester?: number
  branch?: string
}

export function ResourceCategories({ subject, semester, branch }: ResourceCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [resources, setResources] = useState(SAMPLE_RESOURCES)

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSemester = !semester || resource.semester === semester
    const matchesSubject = !subject || resource.subject.toLowerCase().includes(subject.toLowerCase())
    
    return matchesCategory && matchesSearch && matchesSemester && matchesSubject
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
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Resources</h2>
            <p className="text-gray-600">
              {subject && semester && branch 
                ? `${subject} • Semester ${semester} • ${branch}`
                : 'Browse and download study materials'
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
                placeholder="Search resources, subjects, or tags..."
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
          </select>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-sm text-gray-600 mb-2">View everything</p>
              <Badge variant="secondary">{resources.length} items</Badge>
            </CardContent>
          </Card>

          {RESOURCE_CATEGORIES.map((category) => {
            const Icon = category.icon
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
                  <Badge variant="secondary">{category.count} items</Badge>
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
          </p>
          
          {selectedCategory !== 'all' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Clear Filter
            </Button>
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
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Resource Card Component
function ResourceCard({ resource }: { resource: any }) {
  const category = RESOURCE_CATEGORIES.find(c => c.id === resource.type)
  const Icon = category?.icon || FileText

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 ${category?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span>{resource.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Subject: {resource.subject}</span>
              <span>Sem {resource.semester}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {resource.downloads} downloads
              </span>
              <span>{resource.fileSize}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
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
        </div>
      </CardContent>
    </Card>
  )
}

// Resource List Item Component
function ResourceListItem({ resource }: { resource: any }) {
  const category = RESOURCE_CATEGORIES.find(c => c.id === resource.type)
  const Icon = category?.icon || FileText

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 ${category?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate pr-2">
                {resource.title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-yellow-600 flex-shrink-0">
                <Star className="w-4 h-4 fill-current" />
                <span>{resource.rating}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>{resource.subject} • Semester {resource.semester}</span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {resource.downloads}
              </span>
              <span>{resource.fileSize}</span>
              <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{resource.tags.length - 3} more
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
