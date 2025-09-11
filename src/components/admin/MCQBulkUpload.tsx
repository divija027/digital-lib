'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { 
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  File,
  Trash2,
  Eye,
  Plus
} from 'lucide-react'

interface BulkUploadQuestion {
  id?: string
  text: string
  choices: string[]
  correctIndex: number
  explanation: string
  hint?: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  tags: string[]
  status?: 'valid' | 'error' | 'warning'
  errors?: string[]
  warnings?: string[]
}



const sampleJSONStructure = {
  "questions": [
    {
      "text": "What is the time complexity of binary search?",
      "choices": [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)"
      ],
      "correctIndex": 1,
      "explanation": "Binary search divides the search space in half with each comparison.",
      "hint": "Think about how the search space reduces with each step",
      "difficulty": "Intermediate",
      "category": "Technical Aptitude",
      "tags": ["algorithms", "complexity", "searching"]
    }
  ]
}

export function MCQBulkUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedQuestions, setUploadedQuestions] = useState<BulkUploadQuestion[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedMCQSet, setSelectedMCQSet] = useState('')
  const [mcqSets, setMcqSets] = useState<Array<{id: string, title: string, category: string}>>([])
  const [isLoadingSets, setIsLoadingSets] = useState(false)

  // Fetch MCQ sets from API
  const fetchMCQSets = async () => {
    setIsLoadingSets(true)
    try {
      const response = await fetch('/api/mcq/sets')
      if (response.ok) {
        const data = await response.json()
        setMcqSets(data)
      } else {
        console.error('Failed to fetch MCQ sets')
      }
    } catch (error) {
      console.error('Error fetching MCQ sets:', error)
    } finally {
      setIsLoadingSets(false)
    }
  }

  // Load MCQ sets when component mounts
  useEffect(() => {
    fetchMCQSets()
  }, [])

  const validateQuestions = (questions: any[]): BulkUploadQuestion[] => {
    return questions.map((q, index) => {
      const errors: string[] = []
      const warnings: string[] = []

      // Required field validation
      if (!q.text || q.text.trim() === '') {
        errors.push('Question text is required')
      }
      if (!q.choices || !Array.isArray(q.choices) || q.choices.length < 2) {
        errors.push('At least 2 choices are required')
      }
      if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex >= (q.choices?.length || 0)) {
        errors.push('Valid correct answer index is required')
      }
      if (!q.explanation || q.explanation.trim() === '') {
        warnings.push('Explanation is recommended for better learning')
      }

      // Content validation
      if (q.text && q.text.length > 500) {
        warnings.push('Question text is very long (>500 characters)')
      }
      if (q.choices && q.choices.some((choice: string) => choice.length > 200)) {
        warnings.push('Some answer choices are very long (>200 characters)')
      }

      // Duplicate choice validation
      if (q.choices && new Set(q.choices).size !== q.choices.length) {
        warnings.push('Duplicate answer choices detected')
      }

      const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid'

      return {
        id: `temp_${index}`,
        text: q.text || '',
        choices: q.choices || [],
        correctIndex: q.correctIndex || 0,
        explanation: q.explanation || '',
        hint: q.hint || '',
        difficulty: q.difficulty || 'Intermediate',
        category: q.category || 'General',
        tags: q.tags || [],
        status,
        errors,
        warnings
      }
    })
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        
        if (!jsonData.questions || !Array.isArray(jsonData.questions)) {
          throw new Error('Invalid JSON structure: questions array is required')
        }

        const validatedQuestions = validateQuestions(jsonData.questions)
        setUploadedQuestions(validatedQuestions)

      } catch (error) {
        console.error('Error parsing JSON:', error)
        // Handle error - show alert
      }
    }
    reader.readAsText(file)
  }, [])

  const handleBulkUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get valid questions only
      const validQuestions = uploadedQuestions.filter(q => q.status !== 'error')
      const errorQuestions = uploadedQuestions.filter(q => q.status === 'error')

      if (validQuestions.length === 0) {
        alert('No valid questions to upload')
        return
      }

      if (!selectedMCQSet || selectedMCQSet === 'loading' || selectedMCQSet === 'empty') {
        alert('Please select an MCQ set to upload to')
        return
      }

      // Update progress
      setUploadProgress(25)

      // Prepare the data for the API
      const bulkData = {
        mcqSetId: selectedMCQSet,
        questions: validQuestions.map(q => ({
          question: q.text,
          options: q.choices,
          correctAnswer: q.correctIndex,
          explanation: q.explanation,
          hint: q.hint,
          difficulty: q.difficulty.toUpperCase(), // Convert to match API enum
          tags: q.tags,
        })),
      }

      setUploadProgress(50)

      // Call the bulk upload API
      const response = await fetch('/api/mcq/questions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bulkData),
      })

      setUploadProgress(75)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      setUploadProgress(100)

      // Reset form
      setSelectedFile(null)
      setUploadedQuestions([])
      setSelectedMCQSet('')

      alert(`Successfully uploaded ${result.successCount || validQuestions.length} questions!`)

    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const downloadSampleJSON = () => {
    const blob = new Blob([JSON.stringify(sampleJSONStructure, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_mcq_format.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const validQuestions = uploadedQuestions.filter(q => q.status !== 'error').length
  const errorQuestions = uploadedQuestions.filter(q => q.status === 'error').length
  const warningQuestions = uploadedQuestions.filter(q => q.status === 'warning').length

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Upload MCQ Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Upload Instructions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Select an existing MCQ set to upload questions to
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Upload questions in JSON format only
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Each question must have text, choices, and correct answer
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Include explanations and hints for better learning experience
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Maximum file size: 10MB
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  Questions will be validated before upload
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Sample JSON Format</h4>
              <Button 
                variant="outline" 
                onClick={downloadSampleJSON}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample JSON
              </Button>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
                <pre className="text-gray-700 overflow-x-auto">
{`{
  "questions": [
    {
      "text": "Question text?",
      "choices": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Answer explanation",
      "hint": "Helpful hint for students",
      "difficulty": "Medium",
      "category": "Category",
      "tags": ["tag1", "tag2"]
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload JSON File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MCQ Set Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select MCQ Set</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMCQSets}
                disabled={isLoadingSets}
              >
                {isLoadingSets ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
            <Select 
              value={selectedMCQSet} 
              onValueChange={(value) => {
                if (value !== 'loading' && value !== 'empty') {
                  setSelectedMCQSet(value)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an existing MCQ set" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSets ? (
                  <SelectItem value="loading" disabled>
                    Loading sets...
                  </SelectItem>
                ) : mcqSets.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No MCQ sets found
                  </SelectItem>
                ) : (
                  mcqSets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.title} ({set.category})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div>
            <Label>JSON File</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".json"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">JSON files only, up to 10MB</p>
              </div>
            </div>
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">Uploading questions...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {uploadedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Validation Results</CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-100 text-green-800">
                  {validQuestions} Valid
                </Badge>
                {warningQuestions > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {warningQuestions} Warnings
                  </Badge>
                )}
                {errorQuestions > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {errorQuestions} Errors
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {errorQuestions > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Validation Errors Found</AlertTitle>
                <AlertDescription>
                  {errorQuestions} question(s) have validation errors and will not be uploaded. Please fix these issues and try again.
                </AlertDescription>
              </Alert>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Choices</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedQuestions.slice(0, 10).map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getStatusIcon(question.status || 'valid')}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium text-sm truncate">{question.text}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {question.choices.map((choice, idx) => (
                          <div key={idx} className={`${idx === question.correctIndex ? 'font-medium text-green-700' : 'text-gray-600'}`}>
                            {idx + 1}. {choice.substring(0, 30)}...
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {question.errors?.map((error, idx) => (
                          <div key={idx} className="text-xs text-red-600">
                            • {error}
                          </div>
                        ))}
                        {question.warnings?.map((warning, idx) => (
                          <div key={idx} className="text-xs text-yellow-600">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {uploadedQuestions.length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing first 10 questions. Total: {uploadedQuestions.length}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setUploadedQuestions([])
                  setSelectedFile(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBulkUpload}
                disabled={isUploading || errorQuestions > 0 || validQuestions === 0}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {validQuestions} Questions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
