'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { clearBranchCache } from '@/lib/branch-utils'

// Dynamic interfaces for branch and subject data
interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon: string
  color: string
  isActive: boolean
}

interface Subject {
  id: string
  name: string
  code: string
  description: string
  semester: number
  credits: number
  isCore: boolean
  isActive: boolean
}

const uploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  branch: z.string().min(1, 'Branch is required'),
  semester: z.string().min(1, 'Semester is required'),
  subject: z.string().min(1, 'Subject is required'),
  examYear: z.string().min(4, 'Exam year is required'),
  examMonth: z.enum(['January', 'June', 'July', 'December']),
  schemeYear: z.enum(['2022', '2018', '2015']),
  paperType: z.enum(['Regular', 'Supplementary', 'Makeup']),
  questionType: z.enum(['Question Paper', 'Answer Key', 'Question Bank', 'Study Material', 'Notes', 'Syllabus']),
})

type UploadForm = z.infer<typeof uploadSchema>

interface EnhancedResourceUploadProps {
  onUploadSuccess?: () => void
}

export function EnhancedResourceUpload({ onUploadSuccess }: EnhancedResourceUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewTitle, setPreviewTitle] = useState('')
  const [branches, setBranches] = useState<Branch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
  })

  const selectedBranch = watch('branch')
  const selectedSemester = watch('semester')
  const selectedSubject = watch('subject')
  const examYear = watch('examYear')
  const examMonth = watch('examMonth')
  const schemeYear = watch('schemeYear')

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches()
  }, [])

  // Fetch subjects when branch or semester changes
  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      fetchSubjects(selectedBranch, parseInt(selectedSemester))
    } else {
      setSubjects([])
    }
  }, [selectedBranch, selectedSemester])

  const fetchBranches = async () => {
    try {
      setIsLoadingBranches(true)
      clearBranchCache() // Ensure fresh data
      const response = await fetch('/api/admin/branches')
      const data = await response.json()
      
      console.log('[EnhancedResourceUpload] Fetched branches:', data)
      
      if (data.success) {
        setBranches(data.branches.filter((b: Branch) => b.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      setError('Failed to load branches')
    } finally {
      setIsLoadingBranches(false)
    }
  }

  const fetchSubjects = async (branchId: string, semester: number) => {
    try {
      setIsLoadingSubjects(true)
      const response = await fetch(`/api/admin/branches/${branchId}/subjects`)
      const data = await response.json()
      
      console.log(`[EnhancedResourceUpload] Fetched subjects for branch ${branchId}, semester ${semester}:`, data)
      
      if (data.success) {
        // Filter subjects by semester and active status
        const semesterSubjects = data.subjects.filter(
          (s: Subject) => s.isActive && s.semester === semester
        )
        setSubjects(semesterSubjects)
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
      setError('Failed to load subjects')
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Auto-generate title based on selections
  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedSubject && examYear && examMonth && schemeYear) {
      const branch = branches.find(b => b.id === selectedBranch)
      const subject = subjects.find(s => s.id === selectedSubject)
      
      if (branch && subject) {
        const title = `${branch.code} ${selectedSemester}${getSemesterSuffix(parseInt(selectedSemester))} Sem ${subject.name} ${examMonth} ${examYear} (${schemeYear} Scheme)`
        setPreviewTitle(title)
        setValue('title', title)
      }
    }
  }, [selectedBranch, selectedSemester, selectedSubject, examYear, examMonth, schemeYear, branches, subjects, setValue])

  const getSemesterSuffix = (sem: number) => {
    if (sem === 1 || sem === 21) return 'st'
    if (sem === 2 || sem === 22) return 'nd' 
    if (sem === 3 || sem === 23) return 'rd'
    return 'th'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        setError('File size must be less than 25MB')
        return
      }
      
      if (!file.type.includes('pdf')) {
        setError('Only PDF files are allowed for question papers')
        return
      }
      
      setSelectedFile(file)
      setError('')
    }
  }

  const onSubmit = async (data: UploadForm) => {
    if (!selectedFile) {
      setError('Please select a PDF file to upload')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', data.title)
      formData.append('branch', data.branch)
      formData.append('semester', data.semester)
      formData.append('subject', data.subject)
      formData.append('examYear', data.examYear)
      formData.append('examMonth', data.examMonth)
      formData.append('schemeYear', data.schemeYear)
      formData.append('paperType', data.paperType)
      formData.append('questionType', data.questionType)
      
      if (data.description) formData.append('description', data.description)

      const response = await fetch('/api/admin/resources/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Upload failed')
      }

      setSuccess('Question paper uploaded successfully! 🎉')
      reset()
      setSelectedFile(null)
      setPreviewTitle('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUploadSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Question Paper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="file" className="text-base font-medium">Select PDF File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose PDF File
              </Button>
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-gray-500">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Upload question papers, answer keys, or study materials (PDF only, max 25MB)</p>
              )}
            </div>
          </div>

          {/* Branch Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Engineering Branch</Label>
            <Select onValueChange={(value) => setValue('branch', value)} disabled={isLoadingBranches}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select engineering branch"} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{branch.icon}</span>
                      <div>
                        <div className="font-medium">{branch.code}</div>
                        <div className="text-sm text-gray-500">{branch.name}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branch && (
              <p className="text-sm text-red-500">{errors.branch.message}</p>
            )}
          </div>

          {/* Semester and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Semester</Label>
              <Select onValueChange={(value) => setValue('semester', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Semester {sem}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-red-500">{errors.semester.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Subject</Label>
              <Select 
                onValueChange={(value) => setValue('subject', value)}
                disabled={!selectedBranch || !selectedSemester || isLoadingSubjects}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={
                    !selectedBranch || !selectedSemester 
                      ? "Select branch & semester first" 
                      : isLoadingSubjects 
                        ? "Loading subjects..." 
                        : subjects.length > 0 
                          ? "Select subject" 
                          : "No subjects available"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div>
                        <div className="font-medium">{subject.code}</div>
                        <div className="text-sm text-gray-500">{subject.name}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Exam Year</Label>
              <Select onValueChange={(value) => setValue('examYear', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.examYear && (
                <p className="text-sm text-red-500">{errors.examYear.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Exam Month</Label>
              <Select onValueChange={(value) => setValue('examMonth', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January">January</SelectItem>
                  <SelectItem value="June">June</SelectItem>
                  <SelectItem value="July">July</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
              {errors.examMonth && (
                <p className="text-sm text-red-500">{errors.examMonth.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Scheme Year</Label>
              <Select onValueChange={(value) => setValue('schemeYear', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022 Scheme</SelectItem>
                  <SelectItem value="2018">2018 Scheme</SelectItem>
                  <SelectItem value="2015">2015 Scheme</SelectItem>
                </SelectContent>
              </Select>
              {errors.schemeYear && (
                <p className="text-sm text-red-500">{errors.schemeYear.message}</p>
              )}
            </div>
          </div>

          {/* Paper Type and Question Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Paper Type</Label>
              <Select onValueChange={(value) => setValue('paperType', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select paper type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular Exam</SelectItem>
                  <SelectItem value="Supplementary">Supplementary Exam</SelectItem>
                  <SelectItem value="Makeup">Makeup Exam</SelectItem>
                </SelectContent>
              </Select>
              {errors.paperType && (
                <p className="text-sm text-red-500">{errors.paperType.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Question Type</Label>
              <Select onValueChange={(value) => setValue('questionType', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Question Paper">Question Paper</SelectItem>
                  <SelectItem value="Answer Key">Answer Key</SelectItem>
                  <SelectItem value="Question Bank">Question Bank</SelectItem>
                  <SelectItem value="Study Material">Study Material</SelectItem>
                  <SelectItem value="Notes">Notes</SelectItem>
                  <SelectItem value="Syllabus">Syllabus</SelectItem>
                </SelectContent>
              </Select>
              {errors.questionType && (
                <p className="text-sm text-red-500">{errors.questionType.message}</p>
              )}
            </div>
          </div>

          {/* Auto-generated Title Preview */}
          {previewTitle && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Generated Title</Label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="font-medium text-gray-900">{previewTitle}</p>
                <p className="text-sm text-gray-500 mt-1">This title will be automatically generated based on your selections</p>
              </div>
            </div>
          )}

          {/* Manual Title Override */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-medium">Title (Auto-generated)</Label>
            <Input
              id="title"
              placeholder="Title will be auto-generated"
              {...register('title')}
              className="h-12"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional information about this question paper..."
              {...register('description')}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base" 
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading... Please wait
              </div>
            ) : (
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Question Paper
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
