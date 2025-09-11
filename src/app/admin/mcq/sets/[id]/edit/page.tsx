'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  BookOpen,
  Clock,
  Target,
  Tags
} from 'lucide-react'

// Form interfaces
interface MCQSet {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  timeLimit: number
  tags: string[]
  featured: boolean
  companies: string[]
  status: string
}

const CATEGORIES = ['Technical', 'Quantitative', 'Verbal', 'Company Specific', 'General Knowledge']
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

// Mock data - replace with actual API call
const mockMCQSet = {
  id: 'tech-fundamentals',
  title: 'Technical Fundamentals',
  description: 'Core programming concepts, data structures, and algorithms',
  difficulty: 'Beginner' as const,
  category: 'Technical',
  timeLimit: 30,
  tags: ['DSA', 'Programming', 'Logic'],
  featured: true,
  companies: ['Google', 'Microsoft', 'Amazon'],
  status: 'active'
}

export default function EditMCQSetPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<MCQSet>(mockMCQSet)
  const [currentTag, setCurrentTag] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // In a real app, fetch the MCQ set data based on params.id
    console.log('Loading MCQ set for editing:', params.id)
  }, [params.id])

  const handleInputChange = (field: keyof MCQSet, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addCompany = () => {
    if (currentCompany.trim() && !formData.companies.includes(currentCompany.trim())) {
      setFormData(prev => ({
        ...prev,
        companies: [...prev.companies, currentCompany.trim()]
      }))
      setCurrentCompany('')
    }
  }

  const removeCompany = (companyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.filter(company => company !== companyToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual API endpoint
      console.log('Updating MCQ Set:', formData)
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to the MCQ set detail page
      router.push(`/admin/mcq/sets/${params.id}`)
    } catch (error) {
      console.error('Failed to update MCQ set:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.title.trim() && formData.description.trim()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit MCQ Set</h1>
          <p className="text-gray-600 mt-1">Update your quiz set configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">MCQ Set Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Technical Fundamentals, Google Interview Prep"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this MCQ set covers and its learning objectives"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={formData.difficulty} onValueChange={(value: any) => handleInputChange('difficulty', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags and Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Tags & Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (e.g., DSA, Programming, Logic)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Companies */}
                <div>
                  <Label>Associated Companies (Optional)</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a company (e.g., Google, Microsoft, Amazon)"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addCompany} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.companies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.companies.map((company) => (
                          <Badge key={company} variant="outline" className="flex items-center gap-1">
                            {company}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeCompany(company)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiz Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="5"
                    max="180"
                    value={formData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 30)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Mark as Featured</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{formData.title || 'MCQ Set Title'}</p>
                    <p className="text-sm text-gray-600">{formData.description || 'Description will appear here'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{formData.category}</Badge>
                    <Badge className={
                      formData.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      formData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {formData.difficulty}
                    </Badge>
                    {formData.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                    <Badge className={
                      formData.status === 'active' ? 'bg-green-100 text-green-800' :
                      formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>⏱️ {formData.timeLimit} minutes</p>
                    <p>🏷️ {formData.tags.length} tags</p>
                    <p>🏢 {formData.companies.length} companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
