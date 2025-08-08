'use client'

import { useState, useRef } from 'react'
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
import { Upload, FileText } from 'lucide-react'

const uploadSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subjectId: z.string().optional(),
  type: z.enum(['QUESTION_PAPER', 'STUDY_MATERIAL', 'PREVIOUS_YEAR_PAPER', 'SYLLABUS', 'NOTES', 'OTHER']),
  semester: z.string().optional(),
  year: z.string().optional(),
})

type UploadForm = z.infer<typeof uploadSchema>

interface Category {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  semester: number
}

interface ResourceUploadProps {
  categories: Category[]
  subjects: Subject[]
  onUploadSuccess?: () => void
}

export function ResourceUpload({ categories, subjects, onUploadSuccess }: ResourceUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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

  const selectedSemester = watch('semester')

  const filteredSubjects = selectedSemester 
    ? subjects.filter(subject => subject.semester === parseInt(selectedSemester))
    : subjects

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const onSubmit = async (data: UploadForm) => {
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', data.title)
      formData.append('categoryId', data.categoryId)
      formData.append('type', data.type)
      
      if (data.description) formData.append('description', data.description)
      if (data.subjectId) formData.append('subjectId', data.subjectId)
      if (data.semester) formData.append('semester', data.semester)
      if (data.year) formData.append('year', data.year)

      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setSuccess('Resource uploaded successfully!')
      reset()
      setSelectedFile(null)
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Resource
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="flex-1"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter resource title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter resource description"
              {...register('description')}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue('categoryId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Resource Type</Label>
            <Select onValueChange={(value) => setValue('type', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QUESTION_PAPER">Question Paper</SelectItem>
                <SelectItem value="STUDY_MATERIAL">Study Material</SelectItem>
                <SelectItem value="PREVIOUS_YEAR_PAPER">Previous Year Paper</SelectItem>
                <SelectItem value="SYLLABUS">Syllabus</SelectItem>
                <SelectItem value="NOTES">Notes</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Semester and Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Semester (Optional)</Label>
              <Select onValueChange={(value) => setValue('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject (Optional)</Label>
              <Select onValueChange={(value) => setValue('subjectId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year (Optional)</Label>
            <Input
              id="year"
              type="number"
              placeholder="2024"
              {...register('year')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Resource'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
