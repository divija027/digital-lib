"use client"

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { validatePDFFile, validateUploadFields } from '@/lib/validators/pdf'
import { MAX_PDF_SIZE, formatFileSize } from '@/lib/constants/upload'

interface Subject {
  id: string
  name: string
  code: string
  semester: number
}

interface Branch {
  id: string
  name: string
  code: string
  isActive: boolean
}

/**
 * PDFUpload Component
 * 
 * Admin component for uploading PDF files to R2 storage.
 * Features:
 * - Branch, semester, and subject selection
 * - File validation (type and size)
 * - Upload progress indication
 * - Toast notifications for user feedback
 * - Auto-fills title from filename
 * - Emits 'pdf-uploaded' event on success for parent components to refresh
 * 
 * @example
 * ```tsx
 * <PDFUpload />
 * 
 * // Listen for upload events in parent component:
 * useEffect(() => {
 *   const handleUpload = (e: CustomEvent) => {
 *     console.log('PDF uploaded:', e.detail)
 *     refreshPDFList()
 *   }
 *   window.addEventListener('pdf-uploaded', handleUpload)
 *   return () => window.removeEventListener('pdf-uploaded', handleUpload)
 * }, [])
 * ```
 */
export function PDFUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [branchId, setBranchId] = useState('')
  const [branchCode, setBranchCode] = useState('') // Store branch code separately for API
  const [semester, setSemester] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [featured, setFeatured] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loadingBranches, setLoadingBranches] = useState(true)
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches()
  }, [])

  // Fetch subjects when branch or semester changes
  useEffect(() => {
    if (branchId && semester) {
      fetchSubjects()
    } else {
      setSubjects([])
      setSubjectId('')
    }
  }, [branchId, semester])

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true)
      const response = await fetch('/api/admin/branches')
      if (response.ok) {
        const data = await response.json()
        const activeBranches = (data.branches || []).filter((b: Branch) => b.isActive)
        setBranches(activeBranches)
      } else {
        throw new Error('Failed to fetch branches')
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast.error('Failed to load branches. Please refresh the page.')
    } finally {
      setLoadingBranches(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true)
      const response = await fetch(`/api/admin/branches/${branchId}/subjects`)
      if (response.ok) {
        const data = await response.json()
        // Filter subjects by selected semester if needed
        const filteredSubjects = semester 
          ? (data.subjects || []).filter((s: Subject) => s.semester === parseInt(semester))
          : (data.subjects || [])
        setSubjects(filteredSubjects)
      } else {
        throw new Error('Failed to fetch subjects')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      toast.error('Failed to load subjects. Please select a different branch or semester.')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file using shared validator
    const validation = validatePDFFile(selectedFile)
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file')
      e.target.value = '' // Reset file input
      return
    }

    setFile(selectedFile)
    
    // Auto-fill title from filename if empty
    if (!title) {
      setTitle(selectedFile.name.replace('.pdf', ''))
    }
    
    toast.success(`File selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    const validation = validateUploadFields({
      file: file!,
      title,
      branch: branchCode,
      semester,
      subjectId,
    })

    if (!validation.isValid) {
      toast.error(validation.error || 'Please fill in all required fields')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Show loading toast
    const uploadToast = toast.loading('Uploading PDF...')

    try {
      const formData = new FormData()
      formData.append('file', file!)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('branch', branchCode)
      formData.append('semester', semester)
      formData.append('subjectId', subjectId)
      formData.append('featured', featured.toString())

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const response = await fetch('/api/admin/pdfs', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()

      // Dismiss loading toast and show success
      toast.success(data.message || 'PDF uploaded successfully!', { id: uploadToast })

      // Reset form
      resetForm()

      // Emit custom event for parent components to refresh data
      window.dispatchEvent(new CustomEvent('pdf-uploaded', { detail: data.pdf }))
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload PDF'
      toast.error(errorMessage, { id: uploadToast })
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setBranchId('')
    setBranchCode('')
    setSemester('')
    setSubjectId('')
    setFeatured(false)
    setUploadProgress(0)

    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>
          Upload study materials, notes, or question papers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">PDF File *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={isUploading}
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{formatFileSize(file.size)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Structures Notes - Module 1"
              disabled={isUploading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the content..."
              disabled={isUploading}
              rows={3}
            />
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label>Branch *</Label>
            <Select 
              value={branchId} 
              onValueChange={(value) => {
                setBranchId(value)
                // Find and set the branch code for API
                const selectedBranch = branches.find(b => b.id === value)
                if (selectedBranch) {
                  setBranchCode(selectedBranch.code)
                }
                // Reset subject when branch changes
                setSubjectId('')
              }} 
              disabled={isUploading || loadingBranches}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingBranches ? "Loading branches..." : "Select branch"} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label>Semester *</Label>
            <Select 
              value={semester} 
              onValueChange={(value) => {
                setSemester(value)
                // Reset subject when semester changes
                setSubjectId('')
              }} 
              disabled={isUploading}
            >
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

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              disabled={isUploading || !branchId || !semester || loadingSubjects}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingSubjects ? "Loading subjects..." : 
                  !branchId ? "Select branch first" :
                  !semester ? "Select semester first" :
                  subjects.length === 0 ? "No subjects found" :
                  "Select subject"
                } />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isUploading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Mark as featured
            </Label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading || !file}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
