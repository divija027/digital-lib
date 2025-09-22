'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus,
  Settings,
  FileText,
  BarChart3,
  Users,
  Target,
  BookOpen,
  Upload
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MCQSetManager } from '@/components/admin/MCQSetManager'
import { MCQQuestionManager } from '@/components/admin/MCQQuestionManager'
import { MCQBulkUpload } from '@/components/admin/MCQBulkUpload'

// Remove the old mcqStats constant as we're now using dynamic data

// Stats Card Component for reusability
const StatCard = ({ icon: Icon, iconColor, bgColor, label, value }: {
  icon: any
  iconColor: string
  bgColor: string
  label: string
  value: string | number
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick }: {
  icon: any
  label: string
  onClick: () => void
}) => (
  <Button
    variant="outline"
    className="justify-start"
    onClick={onClick}
  >
    <Icon className="w-4 h-4 mr-2" />
    {label}
  </Button>
)

export default function MCQAdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalSets: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0
  })

  // Fetch MCQ statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/mcq/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }
      const data = await response.json()
      setStats({
        totalSets: data.totalSets,
        totalQuestions: data.totalQuestions,
        totalAttempts: data.totalAttempts,
        averageScore: data.averageScore
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [activeTab]) // Refresh stats when tab changes

  const quickActions = [
    {
      icon: Plus,
      label: 'Create New MCQ Set',
      onClick: () => router.push('/admin/mcq/sets/new')
    },
    {
      icon: FileText,
      label: 'Add Individual Question',
      onClick: () => setActiveTab('questions')
    },
    {
      icon: Upload,
      label: 'Bulk Upload Questions',
      onClick: () => setActiveTab('upload')
    },
    {
      icon: Settings,
      label: 'Manage Sets',
      onClick: () => setActiveTab('sets')
    }
  ]

  const statsConfig = [
    {
      icon: BookOpen,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Total Sets',
      value: stats.totalSets
    },
    {
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Total Questions',
      value: stats.totalQuestions
    },
    {
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      label: 'Total Attempts',
      value: stats.totalAttempts
    },
    {
      icon: BarChart3,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Avg Score',
      value: `${stats.averageScore}%`
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MCQ Management</h1>
          <p className="text-gray-600 mt-1">Manage quiz sets and bulk upload questions</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/admin/mcq/sets/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Set
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sets">MCQ Sets</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sets">
          <MCQSetManager />
        </TabsContent>

        <TabsContent value="questions">
          <MCQQuestionManager />
        </TabsContent>

        <TabsContent value="upload">
          <MCQBulkUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
