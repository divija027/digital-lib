'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Award,
  Download,
  Eye,
  Calendar,
  Filter
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalAttempts: number
    totalUsers: number
    averageScore: number
    averageTime: number
    completionRate: number
    popularSet: string
  }
  setPerformance: {
    id: string
    name: string
    attempts: number
    averageScore: number
    completionRate: number
    averageTime: number
    difficulty: string
    category: string
    lastUpdated: string
  }[]
  questionPerformance: {
    id: string
    text: string
    setName: string
    correctRate: number
    attempts: number
    averageTime: number
    difficulty: string
    category: string
  }[]
  userEngagement: {
    period: string
    attempts: number
    users: number
    averageScore: number
  }[]
  difficultyBreakdown: {
    difficulty: string
    count: number
    averageScore: number
    attempts: number
  }[]
  categoryBreakdown: {
    category: string
    count: number
    averageScore: number
    attempts: number
  }[]
}

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalAttempts: 1247,
    totalUsers: 89,
    averageScore: 72.5,
    averageTime: 18.3,
    completionRate: 87.2,
    popularSet: 'Technical Fundamentals'
  },
  setPerformance: [
    {
      id: 'set1',
      name: 'Technical Fundamentals',
      attempts: 450,
      averageScore: 78.2,
      completionRate: 92.1,
      averageTime: 16.5,
      difficulty: 'Medium',
      category: 'Technical Aptitude',
      lastUpdated: '2024-01-16T10:30:00Z'
    },
    {
      id: 'set2',
      name: 'Quantitative Aptitude',
      attempts: 380,
      averageScore: 72.1,
      completionRate: 85.3,
      averageTime: 22.1,
      difficulty: 'Hard',
      category: 'Quantitative Reasoning',
      lastUpdated: '2024-01-15T14:20:00Z'
    },
    {
      id: 'set3',
      name: 'JavaScript Fundamentals',
      attempts: 290,
      averageScore: 81.4,
      completionRate: 89.7,
      averageTime: 14.2,
      difficulty: 'Easy',
      category: 'Programming',
      lastUpdated: '2024-01-14T09:15:00Z'
    },
    {
      id: 'set4',
      name: 'Verbal Aptitude',
      attempts: 127,
      averageScore: 68.9,
      completionRate: 78.4,
      averageTime: 19.8,
      difficulty: 'Medium',
      category: 'Verbal Reasoning',
      lastUpdated: '2024-01-13T16:45:00Z'
    }
  ],
  questionPerformance: [
    {
      id: 'q1',
      text: 'What is the time complexity of binary search algorithm?',
      setName: 'Technical Fundamentals',
      correctRate: 78.2,
      attempts: 245,
      averageTime: 1.8,
      difficulty: 'Medium',
      category: 'Technical Aptitude'
    },
    {
      id: 'q2',
      text: 'Which data structure uses LIFO principle?',
      setName: 'Technical Fundamentals',
      correctRate: 85.1,
      attempts: 312,
      averageTime: 1.2,
      difficulty: 'Easy',
      category: 'Technical Aptitude'
    },
    {
      id: 'q3',
      text: 'Find the missing number: 2, 5, 11, 23, ?',
      setName: 'Quantitative Aptitude',
      correctRate: 62.1,
      attempts: 167,
      averageTime: 3.4,
      difficulty: 'Hard',
      category: 'Quantitative Reasoning'
    },
    {
      id: 'q4',
      text: 'JavaScript variable declaration syntax',
      setName: 'JavaScript Fundamentals',
      correctRate: 92.3,
      attempts: 198,
      averageTime: 0.9,
      difficulty: 'Easy',
      category: 'Programming'
    },
    {
      id: 'q5',
      text: 'Synonym for "Ubiquitous"',
      setName: 'Verbal Aptitude',
      correctRate: 71.2,
      attempts: 134,
      averageTime: 2.1,
      difficulty: 'Medium',
      category: 'Verbal Reasoning'
    }
  ],
  userEngagement: [
    { period: 'Last 7 days', attempts: 456, users: 34, averageScore: 74.2 },
    { period: 'Last 30 days', attempts: 1247, users: 89, averageScore: 72.5 },
    { period: 'Last 90 days', attempts: 3204, users: 156, averageScore: 71.8 },
    { period: 'All time', attempts: 5678, users: 234, averageScore: 72.1 }
  ],
  difficultyBreakdown: [
    { difficulty: 'Easy', count: 45, averageScore: 87.3, attempts: 1456 },
    { difficulty: 'Medium', count: 38, averageScore: 72.1, attempts: 2234 },
    { difficulty: 'Hard', count: 22, averageScore: 58.9, attempts: 987 }
  ],
  categoryBreakdown: [
    { category: 'Technical Aptitude', count: 42, averageScore: 75.6, attempts: 1876 },
    { category: 'Quantitative Reasoning', count: 28, averageScore: 68.4, attempts: 1345 },
    { category: 'Programming', count: 25, averageScore: 82.1, attempts: 1123 },
    { category: 'Verbal Reasoning', count: 18, averageScore: 71.2, attempts: 789 },
    { category: 'Logical Reasoning', count: 12, averageScore: 69.8, attempts: 544 }
  ]
}

export function MCQAnalytics() {
  const [analytics] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days')
  const [selectedMetric, setSelectedMetric] = useState('score')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'Hard': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageScore}%</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Attempts</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalAttempts.toLocaleString()}</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.completionRate}%</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Analytics Period
            </CardTitle>
            <div className="flex gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                  <SelectItem value="All time">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analytics.userEngagement.map((period, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{period.period}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium">{period.attempts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Users:</span>
                    <span className="font-medium">{period.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className={`font-medium ${getPerformanceColor(period.averageScore)}`}>
                      {period.averageScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MCQ Set Performance */}
      <Card>
        <CardHeader>
          <CardTitle>MCQ Set Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set Name</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Average Time</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.setPerformance.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{set.name}</p>
                      <p className="text-sm text-gray-500">{set.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {set.attempts}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getPerformanceColor(set.averageScore)}>
                      {set.averageScore}%
                    </span>
                  </TableCell>
                  <TableCell>{set.completionRate}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {set.averageTime}m
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getDifficultyColor(set.difficulty)}`}
                    >
                      {set.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(set.averageScore)}
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
        </CardContent>
      </Card>

      {/* Question Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>MCQ Set</TableHead>
                <TableHead>Correct Rate</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.questionPerformance.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium text-sm truncate">{question.text}</p>
                      <p className="text-xs text-gray-500">{question.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {question.setName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getPerformanceColor(question.correctRate)}>
                      {question.correctRate}%
                    </span>
                  </TableCell>
                  <TableCell>{question.attempts}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {question.averageTime}s
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getDifficultyColor(question.difficulty)} text-xs`}
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(question.correctRate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category & Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{category.category}</p>
                    <p className="text-xs text-gray-500">{category.count} questions</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getPerformanceColor(category.averageScore)}`}>
                      {category.averageScore}%
                    </p>
                    <p className="text-xs text-gray-500">{category.attempts} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.difficultyBreakdown.map((difficulty, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(difficulty.difficulty)}
                    >
                      {difficulty.difficulty}
                    </Badge>
                    <p className="text-sm text-gray-500">{difficulty.count} questions</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getPerformanceColor(difficulty.averageScore)}`}>
                      {difficulty.averageScore}%
                    </p>
                    <p className="text-xs text-gray-500">{difficulty.attempts} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Most Popular Set</h4>
              <p className="text-sm text-blue-700">
                "{analytics.overview.popularSet}" has the highest engagement with {analytics.setPerformance[0]?.attempts} attempts.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Improvement Needed</h4>
              <p className="text-sm text-yellow-700">
                Hard difficulty questions have a low average score of {analytics.difficultyBreakdown[2]?.averageScore}%. Consider adding more explanations.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">High Performance</h4>
              <p className="text-sm text-green-700">
                Programming category shows excellent performance with {analytics.categoryBreakdown[2]?.averageScore}% average score.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
