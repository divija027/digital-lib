'use client'

import { useState, useEffect } from 'react'
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
  Plus,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react'

interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string | null
  hint: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags: string[]
  mcqSetId: string
  createdAt: string
  updatedAt: string
  mcqSet: {
    id: string
    title: string
    category: string
  }
  creator: {
    id: string
    name: string
    email: string
  }
}

interface MCQSet {
  id: string
  title: string
  category: string
  difficulty: string
}

export function MCQQuestionManager() {
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSet, setSelectedSet] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<MCQQuestion | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form states
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    hint: '',
    difficulty: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    tags: [] as string[],
    mcqSetId: ''
  })

  // Fetch MCQ sets
  const fetchMCQSets = async () => {
    try {
      const response = await fetch('/api/mcq/sets')
      if (response.ok) {
        const data = await response.json()
        setMcqSets(data)
      }
    } catch (error) {
      console.error('Error fetching MCQ sets:', error)
    }
  }

  // Fetch questions with filters
  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (selectedSet !== 'all') {
        params.append('mcqSetId', selectedSet)
      }
      
      if (selectedDifficulty !== 'all') {
        params.append('difficulty', selectedDifficulty)
      }

      const response = await fetch(`/api/mcq/questions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMCQSets()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [currentPage, selectedSet, selectedDifficulty])

  // Create question
  const handleCreateQuestion = async () => {
    try {
      const response = await fetch('/api/mcq/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsAddModalOpen(false)
        resetForm()
        fetchQuestions()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating question:', error)
      alert('Failed to create question')
    }
  }

  // Update question
  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return

    try {
      const response = await fetch(`/api/mcq/questions/${selectedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedQuestion(null)
        resetForm()
        fetchQuestions()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating question:', error)
      alert('Failed to update question')
    }
  }

  // Delete question
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return

    try {
      const response = await fetch(`/api/mcq/questions/${selectedQuestion.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsDeleteModalOpen(false)
        setSelectedQuestion(null)
        fetchQuestions()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      hint: '',
      difficulty: 'BEGINNER',
      tags: [],
      mcqSetId: ''
    })
  }

  const handleEditClick = (question: MCQQuestion) => {
    setSelectedQuestion(question)
    setFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      hint: question.hint || '',
      difficulty: question.difficulty,
      tags: [...question.tags],
      mcqSetId: question.mcqSetId
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (question: MCQQuestion) => {
    setSelectedQuestion(question)
    setIsDeleteModalOpen(true)
  }

  const handleViewClick = (question: MCQQuestion) => {
    setSelectedQuestion(question)
    setIsViewModalOpen(true)
  }

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-700'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-700'
      case 'ADVANCED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">MCQ Questions</h2>
          <p className="text-muted-foreground">
            Manage and organize your MCQ questions
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {resetForm(); setIsAddModalOpen(true)}}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New MCQ Question</DialogTitle>
              <DialogDescription>
                Create a new multiple choice question
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mcqSet">MCQ Set</Label>
                <Select
                  value={formData.mcqSetId}
                  onValueChange={(value) => setFormData({...formData, mcqSetId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select MCQ Set" />
                  </SelectTrigger>
                  <SelectContent>
                    {mcqSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your question..."
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-8 text-center">{String.fromCharCode(65 + index)}.</span>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options]
                        newOptions[index] = e.target.value
                        setFormData({...formData, options: newOptions})
                      }}
                    />
                    {formData.correctAnswer === index && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Select
                  value={formData.correctAnswer.toString()}
                  onValueChange={(value) => setFormData({...formData, correctAnswer: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.options.map((option, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {String.fromCharCode(65 + index)}. {option || `Option ${String.fromCharCode(65 + index)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  placeholder="Explain why this is the correct answer..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hint">Hint (Optional)</Label>
                <Textarea
                  id="hint"
                  placeholder="Provide a helpful hint for students..."
                  value={formData.hint}
                  onChange={(e) => setFormData({...formData, hint: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') =>
                      setFormData({...formData, difficulty: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="algorithm, data-structure, array"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                    })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuestion}>
                Create Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Questions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by question or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>MCQ Set</Label>
              <Select value={selectedSet} onValueChange={setSelectedSet}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sets</SelectItem>
                  {mcqSets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setSelectedSet('all')
                setSelectedDifficulty('all')
                setCurrentPage(1)
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading questions...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedSet !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your filters or search term.'
                  : 'Start by creating your first MCQ question.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>MCQ Set</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <div className="font-medium truncate">
                          {question.question}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {question.mcqSet.title}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {question.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{question.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(question.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClick(question)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(question)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit MCQ Question</DialogTitle>
            <DialogDescription>
              Update the question details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">Question</Label>
              <Textarea
                id="edit-question"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-8 text-center">{String.fromCharCode(65 + index)}.</span>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options]
                      newOptions[index] = e.target.value
                      setFormData({...formData, options: newOptions})
                    }}
                  />
                  {formData.correctAnswer === index && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Select
                value={formData.correctAnswer.toString()}
                onValueChange={(value) => setFormData({...formData, correctAnswer: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.options.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {String.fromCharCode(65 + index)}. {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-explanation">Explanation</Label>
              <Textarea
                id="edit-explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({...formData, explanation: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hint">Hint</Label>
              <Textarea
                id="edit-hint"
                value={formData.hint}
                onChange={(e) => setFormData({...formData, hint: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') =>
                    setFormData({...formData, difficulty: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuestion}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Question</Label>
                <p className="mt-1 text-sm">{selectedQuestion.question}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Options</Label>
                <div className="mt-1 space-y-2">
                  {selectedQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        selectedQuestion.correctAnswer === index
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                      {selectedQuestion.correctAnswer === index && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {selectedQuestion.explanation && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Explanation</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.explanation}</p>
                </div>
              )}
              {selectedQuestion.hint && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Hint</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.hint}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Difficulty</Label>
                  <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                    {selectedQuestion.difficulty}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">MCQ Set</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.mcqSet.title}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Tags</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedQuestion.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
