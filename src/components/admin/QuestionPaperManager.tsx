'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  BookOpen,
  FileText,
  Calendar,
  GraduationCap,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface QuestionPaper {
  id: string
  title: string
  branch: string
  semester: number
  subject: string
  examYear: string
  examMonth: string
  schemeYear: string
  paperType: string
  questionType: string
  fileName: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string
  status: 'active' | 'pending' | 'archived'
  downloads: number
}

// Mock data for demonstration
const mockQuestionPapers: QuestionPaper[] = [
  {
    id: '1',
    title: 'CSE 5th Sem Computer Networks June 2024 (2022 Scheme)',
    branch: 'CSE',
    semester: 5,
    subject: 'Computer Networks',
    examYear: '2024',
    examMonth: 'June',
    schemeYear: '2022',
    paperType: 'Regular',
    questionType: 'Question Paper',
    fileName: 'CSE_5_CN_June_2024_Regular.pdf',
    fileSize: 2.5,
    uploadedAt: '2024-08-30T10:30:00Z',
    uploadedBy: 'Admin User',
    status: 'active',
    downloads: 156
  },
  {
    id: '2',
    title: 'ECE 6th Sem Digital Signal Processing December 2023 (2018 Scheme)',
    branch: 'ECE',
    semester: 6,
    subject: 'Digital Signal Processing',
    examYear: '2023',
    examMonth: 'December',
    schemeYear: '2018',
    paperType: 'Regular',
    questionType: 'Question Paper',
    fileName: 'ECE_6_DSP_Dec_2023_Regular.pdf',
    fileSize: 1.8,
    uploadedAt: '2024-08-29T14:20:00Z',
    uploadedBy: 'Admin User',
    status: 'active',
    downloads: 89
  },
  {
    id: '3',
    title: 'ME 4th Sem Thermodynamics July 2024 (2022 Scheme)',
    branch: 'ME',
    semester: 4,
    subject: 'Thermodynamics',
    examYear: '2024',
    examMonth: 'July',
    schemeYear: '2022',
    paperType: 'Supplementary',
    questionType: 'Question Paper',
    fileName: 'ME_4_THERMO_July_2024_Supp.pdf',
    fileSize: 3.2,
    uploadedAt: '2024-08-28T09:15:00Z',
    uploadedBy: 'Admin User',
    status: 'pending',
    downloads: 23
  }
]

const BRANCHES = ['All', 'CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'CHE', 'BT', 'AE', 'AUTO']
const SEMESTERS = ['All', '3', '4', '5', '6', '7', '8']
const QUESTION_TYPES = ['All', 'Question Paper', 'Answer Key', 'Question Bank', 'Study Material', 'Notes', 'Syllabus']
const STATUS_OPTIONS = ['All', 'active', 'pending', 'archived']

export function QuestionPaperManager() {
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(mockQuestionPapers)
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>(mockQuestionPapers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null)

  // Filter papers based on search and filters
  useEffect(() => {
    let filtered = questionPapers

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Branch filter
    if (selectedBranch !== 'All') {
      filtered = filtered.filter(paper => paper.branch === selectedBranch)
    }

    // Semester filter
    if (selectedSemester !== 'All') {
      filtered = filtered.filter(paper => paper.semester.toString() === selectedSemester)
    }

    // Type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(paper => paper.questionType === selectedType)
    }

    // Status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(paper => paper.status === selectedStatus)
    }

    setFilteredPapers(filtered)
  }, [questionPapers, searchTerm, selectedBranch, selectedSemester, selectedType, selectedStatus])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeColors = {
      'Question Paper': 'bg-blue-100 text-blue-800',
      'Answer Key': 'bg-green-100 text-green-800',
      'Question Bank': 'bg-purple-100 text-purple-800',
      'Study Material': 'bg-orange-100 text-orange-800',
      'Notes': 'bg-indigo-100 text-indigo-800',
      'Syllabus': 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    )
  }

  const handleDelete = async (id: string) => {
    try {
      // Here you would call the delete API
      // await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
      
      setQuestionPapers(prev => prev.filter(paper => paper.id !== id))
      setIsDeleteModalOpen(false)
      setPaperToDelete(null)
    } catch (error) {
      console.error('Failed to delete question paper:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Here you would call the update API
      // await fetch(`/api/admin/resources/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
      
      setQuestionPapers(prev => 
        prev.map(paper => 
          paper.id === id ? { ...paper, status: newStatus as any } : paper
        )
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Question Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search papers, subjects..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Branch Filter */}
            <div>
              <Label>Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester Filter */}
            <div>
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(sem => (
                    <SelectItem key={sem} value={sem}>
                      {sem === 'All' ? 'All' : `Sem ${sem}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <Label>Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {filteredPapers.length} Question Papers Found
          </h3>
          {searchTerm && (
            <Badge variant="outline">
              Searching: "{searchTerm}"
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Question Papers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question Paper Details</TableHead>
                <TableHead>Branch & Semester</TableHead>
                <TableHead>Exam Info</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPapers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{paper.title}</p>
                      <p className="text-xs text-gray-500">{paper.subject}</p>
                      <p className="text-xs text-gray-400">Uploaded {formatDate(paper.uploadedAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{paper.branch}</Badge>
                      <Badge variant="outline">Sem {paper.semester}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {paper.examMonth} {paper.examYear}
                      </div>
                      <div className="text-xs text-gray-500">
                        {paper.schemeYear} Scheme • {paper.paperType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(paper.questionType)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-mono">{paper.fileName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(paper.fileSize)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={paper.status} 
                      onValueChange={(value) => handleStatusChange(paper.id, value)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Download className="h-3 w-3" />
                      {paper.downloads}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setPaperToDelete(paper.id)
                          setIsDeleteModalOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">No question papers found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question Paper</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question paper? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => paperToDelete && handleDelete(paperToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
