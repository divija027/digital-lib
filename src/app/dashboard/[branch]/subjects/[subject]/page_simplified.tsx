'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  Search,
  Download,
  Eye,
  FileText,
  ExternalLink,
  Calendar,
  Star,
  Filter
} from 'lucide-react'
import { getBranchCodeFromSlug } from '@/lib/branch-utils'

interface Subject {
  id: string
  name: string
  code: string
  credits: number
  type: string
  semester: number | null
  description?: string
}

interface Branch {
  id: string
  name: string
  code: string
  isActive: boolean
}

// Convert slug back to subject name
const slugToSubject = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Mock question papers data
const getQuestionPapers = (subjectName: string, branchCode: string) => {
  const currentYear = new Date().getFullYear()
  const papers = []
  
  // Generate mock question papers for last 5 years
  for (let year = currentYear; year >= currentYear - 4; year--) {
    // Main exam papers
    papers.push({
      id: `${branchCode}-${year}-main`,
      title: `${subjectName} - Main Examination`,
      year: year,
      type: 'Main Exam',
      semester: 5,
      fileName: `${subjectName.replace(/\s+/g, '_')}_Main_${year}.pdf`,
      fileSize: '2.1 MB',
      downloadCount: Math.floor(Math.random() * 500) + 100,
      uploadDate: `${year}-12-15`,
      isVerified: true,
      hasAnswers: Math.random() > 0.5
    })
    
    // Supplementary exam papers
    papers.push({
      id: `${branchCode}-${year}-supp`,
      title: `${subjectName} - Supplementary Examination`,
      year: year,
      type: 'Supplementary',
      semester: 5,
      fileName: `${subjectName.replace(/\s+/g, '_')}_Supp_${year}.pdf`,
      fileSize: '1.8 MB',
      downloadCount: Math.floor(Math.random() * 300) + 50,
      uploadDate: `${year}-06-20`,
      isVerified: Math.random() > 0.3,
      hasAnswers: Math.random() > 0.6
    })
    
    // Model question papers
    if (Math.random() > 0.4) {
      papers.push({
        id: `${branchCode}-${year}-model`,
        title: `${subjectName} - Model Question Paper`,
        year: year,
        type: 'Model Paper',
        semester: 5,
        fileName: `${subjectName.replace(/\s+/g, '_')}_Model_${year}.pdf`,
        fileSize: '1.5 MB',
        downloadCount: Math.floor(Math.random() * 800) + 200,
        uploadDate: `${year}-01-10`,
        isVerified: true,
        hasAnswers: true
      })
    }
  }
  
  return papers.sort((a, b) => b.year - a.year)
}

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const branchSlug = params?.branch as string
  const subjectSlug = params?.subject as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [branchData, setBranchData] = useState<Branch | null>(null)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const branchCode = await getBranchCodeFromSlug(branchSlug)
        
        if (!branchCode) {
          setError('Branch not found')
          return
        }

        // Fetch branch data
        const branchResponse = await fetch('/api/admin/branches')
        const branchesData = await branchResponse.json()
        const branch = branchesData.find((b: Branch) => b.code === branchCode)

        if (!branch) {
          setError('Branch not found')
          return
        }

        setBranchData(branch)

        // Fetch subjects for this branch
        const subjectsResponse = await fetch(`/api/admin/branches/${branch.id}/subjects`)
        const subjectsData: Subject[] = await subjectsResponse.json()

        // Find current subject
        const subject = subjectsData.find(s => 
          s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === subjectSlug
        )
        setCurrentSubject(subject || null)

      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (branchSlug && subjectSlug) {
      fetchData()
    }
  }, [branchSlug, subjectSlug])
  
  // Get question papers
  const questionPapers = currentSubject ? getQuestionPapers(currentSubject.name, branchData?.code || '') : []
  
  // Filter papers based on search and filters
  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || paper.type === filterType
    const matchesYear = filterYear === 'all' || paper.year.toString() === filterYear
    
    return matchesSearch && matchesType && matchesYear
  })

  // Get unique years and types for filters
  const availableYears = [...new Set(questionPapers.map(paper => paper.year))].sort((a, b) => b - a)
  const availableTypes = [...new Set(questionPapers.map(paper => paper.type))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subject data...</p>
        </div>
      </div>
    )
  }

  if (error || !branchData || !currentSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Subject not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleDownload = (paper: any) => {
    // Mock download functionality
    console.log('Downloading:', paper.fileName)
    // Here you would implement actual file download
    alert(`Downloading: ${paper.fileName}`)
  }

  const handlePreview = (paper: any) => {
    // Mock preview functionality
    console.log('Previewing:', paper.fileName)
    // Here you would open PDF viewer
    alert(`Opening preview for: ${paper.fileName}`)
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/${branchSlug}/subjects`)}
            className="hover:text-blue-600"
          >
            Subjects
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{currentSubject.name}</span>
        </div>

        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-6 flex-1">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg">
                <FileText className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{currentSubject.name}</h1>
                <p className="text-lg text-gray-600 mb-4">Question Papers and Previous Year Papers</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="default">{currentSubject.code}</Badge>
                  <Badge variant="outline">{currentSubject.credits} Credits</Badge>
                  <Badge variant="secondary">{currentSubject.type}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{questionPapers.length}</div>
                    <div className="text-sm text-gray-600">Question Papers</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{availableYears.length}</div>
                    <div className="text-sm text-gray-600">Years Available</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Download className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{questionPapers.reduce((sum, paper) => sum + paper.downloadCount, 0)}</div>
                    <div className="text-sm text-gray-600">Total Downloads</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{questionPapers.filter(p => p.isVerified).length}</div>
                    <div className="text-sm text-gray-600">Verified Papers</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" onClick={() => router.push(`/dashboard/${branchSlug}/subjects`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search question papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {availableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredPapers.length} of {questionPapers.length} papers
              </span>
            </div>
          </div>
        </div>

        {/* Question Papers Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Question Papers</h2>
          
          {filteredPapers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Question Papers Found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterYear !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Question papers for this subject will be available soon'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-2">{paper.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant={paper.type === 'Main Exam' ? 'default' : paper.type === 'Model Paper' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {paper.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {paper.year}
                          </Badge>
                          {paper.isVerified && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>File Size: {paper.fileSize}</span>
                        <span>{paper.downloadCount} downloads</span>
                      </div>
                      
                      {paper.hasAnswers && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Star className="w-4 h-4" />
                          Answer key included
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Uploaded: {new Date(paper.uploadDate).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handlePreview(paper)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(paper)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
