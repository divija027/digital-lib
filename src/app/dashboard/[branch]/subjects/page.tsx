'use client'

import { useState, useEffect } from 'react'
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
  Bookmark,
  Eye,
  FileText
} from 'lucide-react'
import { getBranchCodeFromSlug, subjectToSlug, clearBranchCache } from '@/lib/branch-utils'

interface Subject {
  id: string
  name: string
  code: string
  description: string
  semester: number
  credits: number
  isCore: boolean
  isActive: boolean
  resourceCount?: number
}

interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon: string
  color: string
  isActive: boolean
}

export default function SubjectsPage() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState<Set<string>>(new Set())
  const [branch, setBranch] = useState<Branch | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const branchSlug = params?.branch as string
  
  useEffect(() => {
    const fetchBranchCode = async () => {
      if (branchSlug) {
        // Clear cache to ensure fresh data for newly created branches
        clearBranchCache()
        const branchCode = await getBranchCodeFromSlug(branchSlug)
        if (branchCode) {
          fetchBranchAndSubjects(branchCode)
        } else {
          setError('Invalid branch')
          setIsLoading(false)
        }
      }
    }
    
    fetchBranchCode()
  }, [branchSlug])

  const fetchBranchAndSubjects = async (branchCode: string) => {
    try {
      setIsLoading(true)
      
      // Fetch all branches to find the one with matching code
      const branchResponse = await fetch('/api/admin/branches')
      const branchData = await branchResponse.json()
      
      if (branchData.success) {
        const currentBranch = branchData.branches.find((b: Branch) => b.code === branchCode && b.isActive)
        
        if (currentBranch) {
          setBranch(currentBranch)
          
          // Fetch subjects for this branch
          const subjectsResponse = await fetch(`/api/admin/branches/${currentBranch.id}/subjects`)
          const subjectsData = await subjectsResponse.json()
          
          if (subjectsData.success) {
            // For cycles, don't filter by semester - show all active subjects
            const activeSubjects = subjectsData.subjects.filter((s: Subject) => s.isActive)
            
            // Fetch PDF counts for each subject
            const subjectsWithCounts = await Promise.all(
              activeSubjects.map(async (subject: Subject) => {
                try {
                  // For Physics/Chemistry, use semester 1
                  const semester = (branchCode === 'PHYSICS' || branchCode === 'CHEMISTRY') ? 1 : subject.semester
                  const pdfResponse = await fetch(
                    `/api/admin/pdfs?branch=${branchCode}&semester=${semester}&subjectId=${subject.id}`
                  )
                  const pdfData = await pdfResponse.json()
                  const count = Array.isArray(pdfData) ? pdfData.length : 0
                  return { ...subject, resourceCount: count }
                } catch (err) {
                  console.error(`Error fetching PDFs for subject ${subject.id}:`, err)
                  return { ...subject, resourceCount: 0 }
                }
              })
            )
            
            setSubjects(subjectsWithCounts)
          }
        } else {
          setError('Branch not found or inactive')
        }
      } else {
        setError('Failed to load branch data')
      }
    } catch (error) {
      console.error('Error fetching branch data:', error)
      setError('Failed to load branch data')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="text-gray-600">{error}</p>
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
          <span className="font-medium text-gray-900">{branch.name} Subjects</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 bg-gradient-to-r ${branch.color} rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                {branch.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {branch.name} Subjects
                </h1>
                <p className="text-lg text-gray-600">{branch.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="default">{filteredSubjects.length} Subjects</Badge>
                  <Badge variant="outline">
                    {filteredSubjects.reduce((sum, s) => sum + s.credits, 0)} Total Credits
                  </Badge>
                  <Badge variant="secondary">
                    {filteredSubjects.filter(s => s.isCore).length} Core
                  </Badge>
                  <Badge variant="secondary">
                    {filteredSubjects.filter(s => !s.isCore).length} Electives
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* No subjects message */}
        {filteredSubjects.length === 0 && searchTerm === '' && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subjects Available</h3>
            <p className="text-gray-600">This cycle doesn't have any subjects configured yet.</p>
          </div>
        )}

        {/* No search results */}
        {filteredSubjects.length === 0 && searchTerm !== '' && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">No subjects match your search criteria.</p>
          </div>
        )}

        {/* Subjects Grid/List */}
        {filteredSubjects.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredSubjects.map((subject) => (
              <div key={subject.code}>
                {viewMode === 'grid' ? (
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {subject.name}
                            </h3>
                            <p className="text-sm font-mono text-gray-500 mb-2">{subject.code}</p>
                            {subject.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{subject.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(subject.code)
                            }}
                            className="flex-shrink-0"
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedSubjects.has(subject.code) ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant={subject.isCore ? "default" : "secondary"} className="text-xs">
                              {subject.isCore ? 'Core' : 'Elective'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {subject.credits} Credits
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{subject.resourceCount || 0} Resource{subject.resourceCount !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              // For Physics/Chemistry cycles, route to semester-based path
                              const semesterPath = branch.code === 'PHYSICS' ? 'physics-cycle' 
                                : branch.code === 'CHEMISTRY' ? 'chemistry-cycle'
                                : subject.semester.toString()
                              router.push(`/dashboard/${branchSlug}/semester/${semesterPath}/subject/${subjectToSlug(subject.name)}`)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{subject.name}</h3>
                            <span className="text-sm font-mono text-gray-500">{subject.code}</span>
                          </div>
                          {subject.description && (
                            <p className="text-sm text-gray-600 mb-3">{subject.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant={subject.isCore ? "default" : "secondary"} className="text-xs">
                              {subject.isCore ? 'Core' : 'Elective'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {subject.credits} Credits
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(subject.code)
                            }}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedSubjects.has(subject.code) ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              // For Physics/Chemistry cycles, route to semester-based path
                              const semesterPath = branch.code === 'PHYSICS' ? 'physics-cycle' 
                                : branch.code === 'CHEMISTRY' ? 'chemistry-cycle'
                                : subject.semester.toString()
                              router.push(`/dashboard/${branchSlug}/semester/${semesterPath}/subject/${subjectToSlug(subject.name)}`)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
