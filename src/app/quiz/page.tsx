'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain,
  Trophy,
  Target,
  Clock,
  ChevronRight,
  Play,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  Code,
  Calculator,
  MessageCircle,
  Building,
  CheckCircle,
  Crown,
  Sparkles,
  ArrowRight,
  BarChart3,
  Flame,
  Home,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// MCQ Set interface matching API response
interface MCQSet {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  timeLimit: number
  tags: string[]
  companies: string[]
  featured: boolean
  status: string
  createdAt: string
  updatedAt: string
  createdBy: string
  questions: number
  attempts: number
  averageScore: number
}

// Icon mapping for categories
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technical': return Code
    case 'quantitative': return Calculator
    case 'verbal': return MessageCircle
    case 'company specific': return Building
    default: return Target
  }
}

// Color mapping for categories
const getCategoryColors = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technical':
      return {
        backgroundColor: 'from-blue-50 to-blue-100',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-700'
      }
    case 'quantitative':
      return {
        backgroundColor: 'from-emerald-50 to-emerald-100',
        borderColor: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        badgeColor: 'bg-emerald-100 text-emerald-700'
      }
    case 'verbal':
      return {
        backgroundColor: 'from-purple-50 to-purple-100',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-600',
        badgeColor: 'bg-purple-100 text-purple-700'
      }
    case 'company specific':
      return {
        backgroundColor: 'from-red-50 to-red-100',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-700'
      }
    default:
      return {
        backgroundColor: 'from-gray-50 to-gray-100',
        borderColor: 'border-gray-200',
        iconColor: 'text-gray-600',
        badgeColor: 'bg-gray-100 text-gray-700'
      }
  }
}

// User Progress Mock Data
const userProgress = {
  achievements: ['First Quiz', 'High Scorer']
}

export default function MCQSelectPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredSet, setHoveredSet] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch MCQ sets from API
  const fetchMCQSets = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/mcq/sets?status=ACTIVE')
      if (!response.ok) {
        throw new Error('Failed to fetch MCQ sets')
      }
      const data = await response.json()
      setMcqSets(data)
    } catch (error) {
      console.error('Error fetching MCQ sets:', error)
      setError('Failed to load quiz sets')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsVisible(true)
    fetchMCQSets()
  }, [])

  const categories = [
    { id: 'all', label: 'All Categories', icon: Target },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'quantitative', label: 'Quantitative', icon: Calculator },
    { id: 'verbal', label: 'Verbal', icon: MessageCircle },
    { id: 'company', label: 'Company Specific', icon: Building }
  ]

  const filteredSets = mcqSets.filter(set => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'technical') return set.category.toLowerCase() === 'technical'
    if (selectedCategory === 'quantitative') return set.category.toLowerCase() === 'quantitative'
    if (selectedCategory === 'verbal') return set.category.toLowerCase() === 'verbal'
    if (selectedCategory === 'company') return set.category.toLowerCase() === 'company specific'
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const handleStartQuiz = (setId: string) => {
    router.push(`/dashboard/quiz/practice/${setId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Quiz Center</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Removed stats display */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-blue-700">Choose Your Challenge</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Interview Skills
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Select from our curated collection of MCQ sets designed to help you excel in technical interviews and company assessments
          </p>
        </div>

        {/* Category Filter */}
        <div className={`mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-blue-600 border border-gray-200/60'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading quiz sets...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
              <Button 
                onClick={fetchMCQSets} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* MCQ Sets Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set, index) => {
              const IconComponent = getCategoryIcon(set.category)
              const categoryColors = getCategoryColors(set.category)
              
              return (
                <div
                  key={set.id}
                  className={`group cursor-pointer transition-all duration-700 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  } ${hoveredSet === set.id ? 'scale-105 -translate-y-2' : 'hover:scale-102 hover:-translate-y-1'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredSet(set.id)}
                  onMouseLeave={() => setHoveredSet(null)}
                >
                  <Card className={`relative border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br ${categoryColors.backgroundColor} ${categoryColors.borderColor} h-full`}>
                    {/* Featured Badge */}
                    {set.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                          <Crown className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${categoryColors.backgroundColor} border ${categoryColors.borderColor} shadow-sm`}>
                          <IconComponent className={`w-6 h-6 ${categoryColors.iconColor}`} />
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{set.attempts} attempts</span>
                          </div>
                          <Badge variant="outline" className={getDifficultyColor(set.difficulty)}>
                            {set.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {set.title}
                      </CardTitle>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {set.description}
                      </p>

                      {/* Tags */}
                      {set.tags && set.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {set.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs bg-white/60 text-gray-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/60 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-900">{set.questions}</div>
                          <div className="text-xs text-gray-600">Questions</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-900">{set.timeLimit}min</div>
                          <div className="text-xs text-gray-600">Time Limit</div>
                        </div>
                      </div>

                      {/* Companies */}
                      {set.companies && set.companies.length > 0 && (
                        <div className="mb-6">
                          <div className="text-xs text-gray-600 mb-2">Asked by:</div>
                          <div className="flex flex-wrap gap-1">
                            {set.companies.map((company, companyIndex) => (
                              <Badge key={companyIndex} className={`text-xs ${categoryColors.badgeColor}`}>
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => handleStartQuiz(set.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Practice
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      {/* Quick Info */}
                      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          <span>{set.averageScore}% avg score</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Hover Effect Shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </Card>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredSets.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Sets Found</h3>
              <p className="text-gray-600">
                {selectedCategory === 'all' 
                  ? 'No quiz sets are available at the moment.' 
                  : `No quiz sets found for the selected category.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Excel?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students who have improved their interview skills with our comprehensive practice tests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Target className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
