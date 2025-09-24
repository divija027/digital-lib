'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react'

// Mock data for demonstration - replace with actual API call
const mockMCQSet = {
  id: 'tech-fundamentals',
  title: 'Technical Fundamentals',
  description: 'Core programming concepts, data structures, and algorithms',
  difficulty: 'Beginner',
  category: 'Technical',
  questions: 25,
  timerMode: 'TOTAL_TIME' as const,
  totalTimeLimit: 30,
  questionTimeLimit: undefined,
  averageScore: 78,
  attempts: 450,
  status: 'active',
  featured: true,
  companies: ['Google', 'Microsoft', 'Amazon'],
  tags: ['DSA', 'Programming', 'Logic'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
  createdBy: 'Admin User'
}

export default function MCQSetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [mcqSet] = useState(mockMCQSet)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // In a real app, fetch the MCQ set data based on params.id
    console.log('Loading MCQ set:', params.id)
  }, [params.id])

  const handleEdit = () => {
    router.push(`/admin/mcq/sets/${params.id}/edit`)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this MCQ set? This action cannot be undone.')) {
      setIsLoading(true)
      try {
        // API call to delete the MCQ set
        console.log('Deleting MCQ set:', params.id)
        router.push('/admin/mcq?tab=sets')
      } catch (error) {
        console.error('Failed to delete MCQ set:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddQuestions = () => {
    router.push(`/admin/mcq/sets/${params.id}/questions/new`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{mcqSet.title}</h1>
              {mcqSet.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
              )}
              <Badge className={getDifficultyColor(mcqSet.difficulty)}>
                {mcqSet.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">{mcqSet.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddQuestions}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Questions
          </Button>
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{mcqSet.questions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{mcqSet.attempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{mcqSet.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mcqSet.timerMode === 'TOTAL_TIME' 
                    ? `${mcqSet.totalTimeLimit}min`
                    : `${mcqSet.questionTimeLimit}s/q`
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {mcqSet.timerMode === 'TOTAL_TIME' ? 'Total time for entire quiz' : 'Time per question'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>MCQ Set Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <Badge variant="outline" className="mt-1">{mcqSet.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    {mcqSet.status.charAt(0).toUpperCase() + mcqSet.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(mcqSet.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(mcqSet.updatedAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {mcqSet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              {mcqSet.companies.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Associated Companies</p>
                  <div className="flex flex-wrap gap-2">
                    {mcqSet.companies.map((company) => (
                      <Badge key={company} variant="outline">{company}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/mcq/sets/${params.id}/questions`)}
                  className="justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddQuestions}
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/mcq/sets/${params.id}/analytics`)}
                  className="justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/mcq/sets/${params.id}/settings`)}
                  className="justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Set Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">New attempt</p>
                  <p className="text-gray-600">Score: 82% • 2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Question updated</p>
                  <p className="text-gray-600">Modified Q15 • 1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Featured status added</p>
                  <p className="text-gray-600">Set marked as featured • 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
