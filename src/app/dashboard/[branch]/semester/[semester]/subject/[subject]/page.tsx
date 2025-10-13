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
  Filter,
  Bookmark
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

interface PDF {
  id: string
  title: string
  description: string | null
  fileName: string
  fileSize: number
  r2Key: string
  branch: string
  semester: number
  subjectId: string
  downloads: number
  views: number
  featured: boolean
  createdAt: string
  updatedAt: string
  subject: {
    id: string
    name: string
    code: string
  }
}

// Convert subject slug back to name (simplified matching)
const slugToSubjectName = (slug: string, subjects: any[]): string => {
  const subjectFromSlug = subjects.find(s => 
    s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === slug
  )
  return subjectFromSlug?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Mock question papers data
const getQuestionPapers = (subjectName: string, branchCode: string, semester: string) => {
  const currentYear = new Date().getFullYear()
  const papers = []
  
  // Generate mock question papers for last 5 years
  for (let year = currentYear; year >= currentYear - 4; year--) {
    // Main exam papers
    papers.push({
      id: `${branchCode}-${semester}-${year}-main`,
      title: `${subjectName} - Main Examination`,
      year: year,
      type: 'Main Exam',
      semester: semester,
      fileName: `${subjectName.replace(/\s+/g, '_')}_Main_${year}.pdf`,
      fileSize: '2.1 MB',
      downloadCount: Math.floor(Math.random() * 500) + 100,
      uploadDate: `${year}-12-15`,
      isVerified: true,
      hasAnswers: Math.random() > 0.5
    })
    
    // Supplementary exam papers
    papers.push({
      id: `${branchCode}-${semester}-${year}-supp`,
      title: `${subjectName} - Supplementary Examination`,
      year: year,
      type: 'Supplementary',
      semester: semester,
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
        id: `${branchCode}-${semester}-${year}-model`,
        title: `${subjectName} - Model Question Paper`,
        year: year,
        type: 'Model Paper',
        semester: semester,
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
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [branchData, setBranchData] = useState<Branch | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPdfs, setLoadingPdfs] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const branchSlug = params?.branch as string
  const semester = params?.semester as string
  const subjectSlug = params?.subject as string

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
        const branchesResponse = await branchResponse.json()
        const branchesData = branchesResponse.success ? branchesResponse.branches : []
        const branch = branchesData.find((b: Branch) => b.code === branchCode)

        if (!branch) {
          setError('Branch not found')
          return
        }

        setBranchData(branch)

        // Fetch subjects for this branch
        const subjectsResponse = await fetch(`/api/admin/branches/${branch.id}/subjects`)
        const subjectsResponseData = await subjectsResponse.json()
        const subjectsData: Subject[] = Array.isArray(subjectsResponseData) ? subjectsResponseData : (subjectsResponseData.subjects || [])

        // Filter subjects based on semester
        let filteredSubjects: Subject[]
        if (semester === 'physics-cycle' || semester === 'chemistry-cycle') {
          // Physics and Chemistry cycles use semester 1 subjects
          filteredSubjects = subjectsData.filter(s => s.semester === 1)
        } else {
          const semesterNumber = parseInt(semester)
          filteredSubjects = subjectsData.filter(s => s.semester === semesterNumber)
        }

        setSubjects(filteredSubjects)

        // Find current subject
        const subject = filteredSubjects.find(s => 
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

    if (branchSlug && semester && subjectSlug) {
      fetchData()
    }
  }, [branchSlug, semester, subjectSlug])

  // Fetch PDFs when subject is loaded
  useEffect(() => {
    const fetchPDFs = async () => {
      if (!currentSubject || !branchData) return

      try {
        setLoadingPdfs(true)
        const branchCode = branchData.code
        const semesterNum = semester === 'physics-cycle' || semester === 'chemistry-cycle' ? '1' : semester
        
        // Fetch PDFs for this subject
        console.log(`Fetching PDFs: branch=${branchCode}, semester=${semesterNum}, subjectId=${currentSubject.id}`)
        const response = await fetch(`/api/admin/pdfs?branch=${branchCode}&semester=${semesterNum}&subjectId=${currentSubject.id}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched PDFs:', data)
          setPdfs(data || [])
        } else {
          console.error('Failed to fetch PDFs, status:', response.status)
          setPdfs([])
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error)
        setPdfs([])
      } finally {
        setLoadingPdfs(false)
      }
    }

    fetchPDFs()
  }, [currentSubject, branchData, semester])

  // Convert real PDFs to paper format
  const realPapers = pdfs.map(pdf => ({
    id: pdf.id,
    title: pdf.title,
    year: new Date(pdf.createdAt).getFullYear(),
    type: pdf.featured ? 'Featured' : 'Study Material',
    semester: semester,
    fileName: pdf.fileName,
    fileSize: pdf.fileSize > 0 ? `${(pdf.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Unknown',
    downloadCount: pdf.downloads,
    uploadDate: pdf.createdAt,
    isVerified: true,
    hasAnswers: false,
    isRealPDF: true,
    r2Key: pdf.r2Key,
    publicUrl: (pdf as any).publicUrl || null, // Use public URL if available
    pdfId: pdf.id,
    description: pdf.description
  }))

  // Only use real PDFs - no mock data
  const questionPapers = realPapers
  
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

  if (loading || loadingPdfs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Loading subject data...' : 'Loading study materials...'}
          </p>
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

  const handleDownload = async (paper: any) => {
    if (paper.isRealPDF && paper.publicUrl) {
      try {
        // Fetch the PDF as blob to force download
        const response = await fetch(paper.publicUrl)
        if (!response.ok) throw new Error('Failed to fetch PDF')
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = paper.fileName || 'document.pdf'
        document.body.appendChild(a)
        a.click()
        
        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Track download count (optional)
        fetch(`/api/admin/pdfs/${paper.pdfId}/track-download`, { 
          method: 'POST' 
        }).catch(err => console.error('Failed to track download:', err))
      } catch (error) {
        console.error('Download error:', error)
        alert('Failed to download file. Please try again.')
      }
    } else if (paper.isRealPDF && paper.pdfId) {
      // Fallback: try API route if publicUrl not available
      try {
        const response = await fetch(`/api/pdfs/${paper.pdfId}/download`)
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = paper.fileName
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } else {
          alert('Failed to download file')
        }
      } catch (error) {
        console.error('Download error:', error)
        alert('Failed to download file')
      }
    } else {
      // Mock download for demo papers
      console.log('Downloading:', paper.fileName)
      alert(`Downloading: ${paper.fileName}\n(This is a demo file)`)
    }
  }

  const handlePreview = (paper: any) => {
    if (paper.isRealPDF && paper.publicUrl) {
      // Use public URL for direct preview
      window.open(paper.publicUrl, '_blank')
      
      // Track view count (optional)
      fetch(`/api/admin/pdfs/${paper.pdfId}/track-view`, { 
        method: 'POST' 
      }).catch(err => console.error('Failed to track view:', err))
    } else if (paper.isRealPDF && paper.pdfId) {
      // Fallback: try API route if publicUrl not available
      window.open(`/api/pdfs/${paper.pdfId}/view`, '_blank')
    } else {
      // Mock preview for demo papers
      console.log('Previewing:', paper.fileName)
      alert(`Opening preview for: ${paper.fileName}\n(This is a demo file)`)
    }
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
            onClick={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subjects`)}
            className="hover:text-blue-600"
          >
            {semester === 'physics-cycle' ? 'Physics Cycle' : 
             semester === 'chemistry-cycle' ? 'Chemistry Cycle' : 
             `Semester ${semester}`}
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{currentSubject.name}</span>
        </div>

        {/* Question Papers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Available Study Materials</h2>
            {pdfs.length > 0 && (
              <Badge variant="default" className="bg-green-600">
                {pdfs.length} Uploaded File{pdfs.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
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
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {(paper as any).isRealPDF && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              Uploaded
                            </Badge>
                          )}
                          <Badge 
                            variant={paper.type === 'Main Exam' ? 'default' : paper.type === 'Model Paper' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {paper.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {paper.year}
                          </Badge>
                          {paper.isVerified && !(paper as any).isRealPDF && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Demo
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
