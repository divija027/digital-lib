'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  MoreHorizontal,
  BookOpen,
  Clock,
  Target,
  Users,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// MCQ Set interface
interface MCQSetData {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  questions: number
  timeLimit: number
  averageScore: number
  attempts: number
  status: string
  featured: boolean
  tags: string[]
  companies?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Mock MCQ Sets data
const mockMCQSets = [
  {
    id: 'tech-fundamentals',
    title: 'Technical Fundamentals',
    description: 'Core programming concepts, data structures, and algorithms',
    difficulty: 'Beginner',
    category: 'Technical',
    questions: 25,
    timeLimit: 30,
    averageScore: 78,
    attempts: 450,
    status: 'active',
    featured: true,
    companies: ['Google', 'Microsoft', 'Amazon'],
    tags: ['DSA', 'Programming', 'Logic'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    createdBy: 'Admin User'
  },
  {
    id: 'quant-aptitude',
    title: 'Quantitative Aptitude',
    description: 'Mathematical reasoning, statistics, and logical problem solving',
    difficulty: 'Intermediate',
    category: 'Quantitative',
    questions: 30,
    timeLimit: 45,
    averageScore: 72,
    attempts: 380,
    status: 'active',
    featured: false,
    companies: ['TCS', 'Infosys', 'Wipro'],
    tags: ['Math', 'Statistics', 'Problem Solving'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    createdBy: 'Admin User'
  },
  {
    id: 'verbal-reasoning',
    title: 'Verbal Reasoning',
    description: 'English comprehension, grammar, and communication skills',
    difficulty: 'Beginner',
    category: 'Verbal',
    questions: 20,
    timeLimit: 25,
    averageScore: 81,
    attempts: 320,
    status: 'active',
    featured: false,
    companies: ['Accenture', 'Cognizant', 'HCL'],
    tags: ['English', 'Grammar', 'Communication'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    createdBy: 'Admin User'
  },
  {
    id: 'google-prep',
    title: 'Google Interview Prep',
    description: 'Real questions asked in Google technical interviews',
    difficulty: 'Advanced',
    category: 'Company Specific',
    questions: 40,
    timeLimit: 60,
    averageScore: 65,
    attempts: 290,
    status: 'active',
    featured: true,
    companies: ['Google'],
    tags: ['Google', 'System Design', 'Algorithms'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    createdBy: 'Admin User'
  },
  {
    id: 'react-advanced',
    title: 'React Advanced Concepts',
    description: 'Advanced React patterns, hooks, and performance optimization',
    difficulty: 'Advanced',
    category: 'Technical',
    questions: 35,
    timeLimit: 50,
    averageScore: 0,
    attempts: 0,
    status: 'draft',
    featured: false,
    companies: ['Facebook', 'Netflix', 'Airbnb'],
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    createdBy: 'Admin User'
  }
]

const CATEGORIES = ['All', 'Technical', 'Quantitative', 'Verbal', 'Company Specific']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']
const STATUSES = ['All', 'active', 'draft', 'archived']

export function MCQSetManager() {
  const router = useRouter()
  const [mcqSets, setMCQSets] = useState<MCQSetData[]>([])
  const [filteredSets, setFilteredSets] = useState<MCQSetData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState<string | null>(null)

  // Fetch MCQ sets from API
  const fetchMCQSets = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/mcq/sets')
      if (!response.ok) {
        throw new Error('Failed to fetch MCQ sets')
      }
      const data = await response.json()
      setMCQSets(data)
    } catch (error) {
      console.error('Error fetching MCQ sets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchMCQSets()
  }, [])

  // Filter sets based on search and filters
  useEffect(() => {
    let filtered = mcqSets

    // Text search
    if (searchTerm) {
      filtered = filtered.filter((set: MCQSetData) => 
        set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((set: MCQSetData) => set.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((set: MCQSetData) => set.difficulty === selectedDifficulty.toUpperCase())
    }

    // Status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter((set: MCQSetData) => set.status === selectedStatus.toUpperCase())
    }

    setFilteredSets(filtered)
  }, [mcqSets, searchTerm, selectedCategory, selectedDifficulty, selectedStatus])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/mcq/sets/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete MCQ set')
      }

      // Refresh the data
      await fetchMCQSets()
      setIsDeleteModalOpen(false)
      setSetToDelete(null)
    } catch (error) {
      console.error('Failed to delete MCQ set:', error)
      alert('Failed to delete MCQ set. Please try again.')
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/mcq/sets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Refresh the data
      await fetchMCQSets()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MCQ Sets Management</h2>
          <p className="text-gray-600">Create, edit, and manage your MCQ sets</p>
        </div>
        <Button
          onClick={() => router.push('/admin/mcq/sets/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Set
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter MCQ Sets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sets, descriptions, tags..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <Label>Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
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
                  {STATUSES.map(status => (
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
            {filteredSets.length} MCQ Sets Found
          </h3>
          {searchTerm && (
            <Badge variant="outline">
              Searching: "{searchTerm}"
            </Badge>
          )}
        </div>
      </div>

      {/* MCQ Sets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set Details</TableHead>
                <TableHead>Category & Difficulty</TableHead>
                <TableHead>Questions & Time</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{set.title}</p>
                        {set.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 max-w-xs">{set.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {set.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {set.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{set.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">{set.category}</Badge>
                      <Badge className={getDifficultyColor(set.difficulty)}>
                        {set.difficulty}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-3 w-3" />
                        {set.questions} questions
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {set.timeLimit} minutes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <BarChart3 className="h-3 w-3" />
                        {set.averageScore}% avg
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        {set.attempts} attempts
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={set.status} 
                      onValueChange={(value) => handleStatusChange(set.id, value)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{formatDate(set.createdAt)}</p>
                      <p className="text-xs text-gray-500">by {set.createdBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/mcq/sets/${set.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/mcq/sets/${set.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSetToDelete(set.id)
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

          {filteredSets.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">No MCQ sets found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete MCQ Set</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this MCQ set? This action cannot be undone and will also delete all associated questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setToDelete && handleDelete(setToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
