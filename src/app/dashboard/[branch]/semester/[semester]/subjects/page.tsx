'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Clock,
  Bookmark,
  Eye,
  FileText
} from 'lucide-react'
import { getBranchByCode, getCycleByCode, getSubjectsBySemester } from '@/lib/vtu-curriculum'

// Branch slug to code mapping
const BRANCH_SLUG_MAP: Record<string, string> = {
  'physics': 'PHYSICS',
  'chemistry': 'CHEMISTRY', 
  'cs': 'CSE',
  'cse': 'CSE',
  'is': 'ISE',
  'ise': 'ISE',
  'ece': 'ECE',
  'ai': 'AIML',
  'aiml': 'AIML',
  'eee': 'EEE',
  'civil': 'CE',
  'ce': 'CE',
  'mech': 'ME',
  'me': 'ME'
}

// Convert subject name to URL-friendly slug
const subjectToSlug = (subjectName: string): string => {
  return subjectName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function SubjectsPage() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState<Set<string>>(new Set())

  const branchSlug = params?.branch as string
  const semester = params?.semester as string
  
  // Convert slug to branch code
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
  // Get semester number or handle cycles
  let semesterNumber: number | string
  if (semester === 'physics-cycle') {
    semesterNumber = 'Physics Cycle'
  } else if (semester === 'chemistry-cycle') {
    semesterNumber = 'Chemistry Cycle'
  } else {
    semesterNumber = parseInt(semester)
  }

  // Get subjects
  const subjects = branchCode ? getSubjectsBySemester(branchCode, semesterNumber) : []
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleBookmark = (subjectCode: string) => {
    setBookmarkedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subjectCode)) {
        newSet.delete(subjectCode)
      } else {
        newSet.add(subjectCode)
      }
      return newSet
    })
  }

  if (!branchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Not Found</h1>
          <p className="text-gray-600">The requested branch could not be found.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <BookOpen className="w-4 h-4" />
            Dashboard
          </Button>
          <ChevronRight className="w-4 h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/${branchSlug}`)}
            className="hover:text-blue-600"
          >
            {branchData.name}
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">
            {typeof semesterNumber === 'number' ? `Semester ${semesterNumber}` : semesterNumber}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {typeof semesterNumber === 'number' ? `Semester ${semesterNumber}` : semesterNumber} - {branchData.name}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {filteredSubjects.length} subjects • Click on any subject to access question papers
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
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
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Academic Year 2024-25
            </Badge>
          </div>
        </div>

        {/* Subjects Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard 
                key={subject.code} 
                subject={subject}
                onSelect={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subject/${subjectToSlug(subject.name)}`)}
                isBookmarked={bookmarkedSubjects.has(subject.code)}
                onBookmark={() => toggleBookmark(subject.code)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubjects.map((subject) => (
              <SubjectListItem 
                key={subject.code} 
                subject={subject}
                onSelect={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subject/${subjectToSlug(subject.name)}`)}
                isBookmarked={bookmarkedSubjects.has(subject.code)}
                onBookmark={() => toggleBookmark(subject.code)}
              />
            ))}
          </div>
        )}

        {filteredSubjects.length === 0 && subjects.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No subjects found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              Subjects for this semester will be added soon. Check back later or contact support.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button>Request Subjects</Button>
            </div>
          </div>
        )}

        {filteredSubjects.length === 0 && subjects.length > 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No matching subjects found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Subject Card Component
const SubjectCard = ({ subject, onSelect, isBookmarked, onBookmark }: {
  subject: any
  onSelect: () => void
  isBookmarked: boolean
  onBookmark: () => void
}) => (
  <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full border-l-4 border-l-blue-500">
    <CardContent className="p-6 h-full flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            subject.type === 'lab' ? 'bg-green-100' : 
            subject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            <BookOpen className={`w-7 h-7 ${
              subject.type === 'lab' ? 'text-green-600' : 
              subject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
            }`} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onBookmark()
            }}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${isBookmarked ? 'opacity-100' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
          </Button>
        </div>
        
        <div>
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {subject.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{subject.code}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge 
              variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'} 
              className="text-xs"
            >
              {subject.credits} credits
            </Badge>
            <Badge variant="outline" className="text-xs">
              {subject.type}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {subject.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Question Papers:</span> Available for download
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Resources
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 mt-4">
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
          onClick={onSelect}
        >
          View Question Papers
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </CardContent>
  </Card>
)

// Enhanced Subject List Item Component
const SubjectListItem = ({ subject, onSelect, isBookmarked, onBookmark }: {
  subject: any
  onSelect: () => void
  isBookmarked: boolean
  onBookmark: () => void
}) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1" onClick={onSelect}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            subject.type === 'lab' ? 'bg-green-100' : 
            subject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            <BookOpen className={`w-8 h-8 ${
              subject.type === 'lab' ? 'text-green-600' : 
              subject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
            }`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
                {subject.name}
              </h3>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Question Papers</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {subject.code} • {subject.credits} credits • Previous year papers available
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'}>
                {subject.type}
              </Badge>
              <Badge variant="outline">{subject.category}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onBookmark()
            }}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={onSelect}>
            Explore
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)
