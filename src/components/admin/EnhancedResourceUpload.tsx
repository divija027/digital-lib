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

// VTU Branches with their details
const VTU_BRANCHES = [
  { 
    code: 'CSE', 
    name: 'Computer Science Engineering',
    color: 'bg-blue-100 text-blue-800',
    icon: '💻'
  },
  { 
    code: 'ISE', 
    name: 'Information Science Engineering',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🔧'
  },
  { 
    code: 'ECE', 
    name: 'Electronics & Communication Engineering',
    color: 'bg-purple-100 text-purple-800',
    icon: '📡'
  },
  { 
    code: 'EEE', 
    name: 'Electrical & Electronics Engineering',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⚡'
  },
  { 
    code: 'ME', 
    name: 'Mechanical Engineering',
    color: 'bg-orange-100 text-orange-800',
    icon: '⚙️'
  },
  { 
    code: 'CE', 
    name: 'Civil Engineering',
    color: 'bg-green-100 text-green-800',
    icon: '🏗️'
  },
  { 
    code: 'CHE', 
    name: 'Chemical Engineering',
    color: 'bg-red-100 text-red-800',
    icon: '🧪'
  },
  { 
    code: 'BT', 
    name: 'Biotechnology',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🧬'
  },
  { 
    code: 'AE', 
    name: 'Aeronautical Engineering',
    color: 'bg-sky-100 text-sky-800',
    icon: '✈️'
  },
  { 
    code: 'AUTO', 
    name: 'Automobile Engineering',
    color: 'bg-gray-100 text-gray-800',
    icon: '🚗'
  }
]

// Subjects by branch and semester (sample data)
const SUBJECTS_BY_BRANCH = {
  CSE: {
    3: [
      { code: 'DS', name: 'Data Structures', credits: 4 },
      { code: 'DE', name: 'Digital Electronics', credits: 4 },
      { code: 'CO', name: 'Computer Organization', credits: 4 },
      { code: 'M3', name: 'Mathematics III', credits: 4 },
      { code: 'OOP', name: 'Object Oriented Programming', credits: 3 }
    ],
    4: [
      { code: 'OS', name: 'Operating Systems', credits: 4 },
      { code: 'DBMS', name: 'Database Management Systems', credits: 4 },
      { code: 'DAA', name: 'Design and Analysis of Algorithms', credits: 4 },
      { code: 'M4', name: 'Mathematics IV', credits: 4 },
      { code: 'MP', name: 'Microprocessors', credits: 3 }
    ],
    5: [
      { code: 'CN', name: 'Computer Networks', credits: 4 },
      { code: 'SE', name: 'Software Engineering', credits: 4 },
      { code: 'CD', name: 'Compiler Design', credits: 4 },
      { code: 'UNIX', name: 'UNIX System Programming', credits: 3 },
      { code: 'AI', name: 'Artificial Intelligence', credits: 3 }
    ],
    6: [
      { code: 'ML', name: 'Machine Learning', credits: 4 },
      { code: 'CC', name: 'Cloud Computing', credits: 4 },
      { code: 'IS', name: 'Information Security', credits: 4 },
      { code: 'WEB', name: 'Web Technologies', credits: 3 },
      { code: 'SPM', name: 'Software Project Management', credits: 3 }
    ],
    7: [
      { code: 'BDA', name: 'Big Data Analytics', credits: 4 },
      { code: 'IOT', name: 'Internet of Things', credits: 4 },
      { code: 'BC', name: 'Blockchain Technology', credits: 3 },
      { code: 'NLP', name: 'Natural Language Processing', credits: 3 },
      { code: 'PROJECT', name: 'Major Project Phase I', credits: 6 }
    ],
    8: [
      { code: 'PROJECT2', name: 'Major Project Phase II', credits: 12 },
      { code: 'INTERN', name: 'Internship', credits: 4 },
      { code: 'SEMINAR', name: 'Technical Seminar', credits: 2 }
    ]
  },
  // Add other branches as needed
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

  // Get subjects for selected branch and semester
  const availableSubjects = selectedBranch && selectedSemester 
    ? SUBJECTS_BY_BRANCH[selectedBranch as keyof typeof SUBJECTS_BY_BRANCH]?.[parseInt(selectedSemester)] || []
    : []

  // Auto-generate title based on selections
  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedSubject && examYear && examMonth && schemeYear) {
      const branch = VTU_BRANCHES.find(b => b.code === selectedBranch)
      const subject = availableSubjects.find(s => s.code === selectedSubject)
      
      if (branch && subject) {
        const title = `${branch.code} ${selectedSemester}${getSemesterSuffix(parseInt(selectedSemester))} Sem ${subject.name} ${examMonth} ${examYear} (${schemeYear} Scheme)`
        setPreviewTitle(title)
        setValue('title', title)
      }
    }
  }, [selectedBranch, selectedSemester, selectedSubject, examYear, examMonth, schemeYear, availableSubjects, setValue])

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
            <Select onValueChange={(value) => setValue('branch', value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select engineering branch" />
              </SelectTrigger>
              <SelectContent>
                {VTU_BRANCHES.map((branch) => (
                  <SelectItem key={branch.code} value={branch.code}>
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
                  {[3, 4, 5, 6, 7, 8].map((sem) => (
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
                disabled={!selectedBranch || !selectedSemester}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={availableSubjects.length > 0 ? "Select subject" : "Select branch & semester first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.code} value={subject.code}>
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
