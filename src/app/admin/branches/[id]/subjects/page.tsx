'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  BookOpen,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

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

interface Branch {
  id: string
  name: string
  code: string
  icon: string
  color: string
}

export default function BranchSubjectsPage() {
  const router = useRouter()
  const params = useParams()
  const branchId = params.id as string

  const [branch, setBranch] = useState<Branch | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    semester: 1,
    credits: 3,
    isCore: true
  })

  useEffect(() => {
    fetchBranchAndSubjects()
  }, [branchId])

  useEffect(() => {
    filterSubjects()
  }, [subjects, searchTerm, selectedSemester])

  const fetchBranchAndSubjects = async () => {
    try {
      setIsLoading(true)
      
      // Fetch branch details
      const branchResponse = await fetch('/api/admin/branches')
      const branchData = await branchResponse.json()
      
      if (branchData.success) {
        const currentBranch = branchData.branches.find((b: Branch) => b.id === branchId)
        if (currentBranch) {
          setBranch(currentBranch)
        }
      }

      // Fetch subjects for this branch
      const subjectsResponse = await fetch(`/api/admin/branches/${branchId}/subjects`)
      const subjectsData = await subjectsResponse.json()
      
      if (subjectsData.success) {
        setSubjects(subjectsData.subjects)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load branch data')
    } finally {
      setIsLoading(false)
    }
  }

  const filterSubjects = () => {
    let filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(subject => subject.semester === selectedSemester)
    }

    setFilteredSubjects(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      semester: 1,
      credits: 3,
      isCore: true
    })
    setEditingSubject(null)
    setShowAddForm(false)
  }

  const handleAddSubject = () => {
    resetForm()
    setShowAddForm(true)
  }

  const handleEditSubject = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      semester: subject.semester,
      credits: subject.credits,
      isCore: subject.isCore
    })
    setEditingSubject(subject)
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingSubject ? 'PUT' : 'POST'
      const url = `/api/admin/branches/${branchId}/subjects`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(editingSubject && { id: editingSubject.id })
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Subject ${editingSubject ? 'updated' : 'created'} successfully!`)
        resetForm()
        fetchBranchAndSubjects()
      } else {
        toast.error(data.error || `Failed to ${editingSubject ? 'update' : 'create'} subject`)
      }
    } catch (error) {
      console.error('Error submitting subject:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/admin/branches/${branchId}/subjects`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: subjectId }),
        })

        const data = await response.json()

        if (data.success) {
          toast.success('Subject deleted successfully!')
          fetchBranchAndSubjects()
        } else {
          toast.error(data.error || 'Failed to delete subject')
        }
      } catch (error) {
        console.error('Error deleting subject:', error)
        toast.error('An unexpected error occurred')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Branch not found</AlertDescription>
        </Alert>
        <Link href="/admin/branches">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/branches">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${branch.color} flex items-center justify-center text-white text-xl`}>
            {branch.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{branch.name} - Subjects</h1>
            <p className="text-gray-600 mt-1">Manage subjects for {branch.code}</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subjects..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Semester Filter */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleAddSubject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g., CS301"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the subject..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits *</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject Type</Label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isCore"
                        checked={formData.isCore}
                        onChange={() => setFormData(prev => ({ ...prev, isCore: true }))}
                        className="mr-2"
                      />
                      Core
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isCore"
                        checked={!formData.isCore}
                        onChange={() => setFormData(prev => ({ ...prev, isCore: false }))}
                        className="mr-2"
                      />
                      Elective
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingSubject ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingSubject ? 'Update Subject' : 'Add Subject'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Subjects ({filteredSubjects.length})
        </h2>
        
        {filteredSubjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedSemester !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding your first subject.'}
              </p>
              {!searchTerm && selectedSemester === 'all' && (
                <Button onClick={handleAddSubject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Subject
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono">{subject.code}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={subject.isCore ? "default" : "secondary"}>
                        {subject.isCore ? 'Core' : 'Elective'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sem {subject.semester}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{subject.description || 'No description available'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Credits: {subject.credits}</span>
                    <span>Semester {subject.semester}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
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
  )
}
