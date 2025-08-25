'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  Search,
  Download,
  Eye,
  FileText,
  Video,
  Users,
  Clock,
  BookmarkPlus,
  Share,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { getBranchByCode, getCycleByCode } from '@/lib/vtu-curriculum'

// Branch slug to code mapping
const BRANCH_SLUG_MAP: Record<string, string> = {
  'physics': 'PHYSICS',
  'chemistry': 'CHEMISTRY',
  'cs': 'CSE',
  'cse': 'CSE',
  'is': 'ISE', 
  'ise': 'ISE',
  'ece': 'ECE',
  'ai': 'AIML',
  'aiml': 'AIML',
  'eee': 'EEE',
  'civil': 'CE',
  'ce': 'CE',
  'mech': 'ME',
  'me': 'ME'
}

// Convert slug back to subject name (reverse of subjectToSlug)
const slugToSubject = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Mock data for subject modules and resources
const getSubjectData = (subjectName: string, branchCode: string) => {
  const baseSubject = {
    name: subjectName,
    code: `${branchCode}101`,
    credits: 4,
    type: 'theory',
    category: 'Core',
    description: `Comprehensive study of ${subjectName} fundamentals and applications in engineering.`,
    objectives: [
      `Understand the fundamental concepts of ${subjectName}`,
      'Apply theoretical knowledge to solve practical problems',
      'Analyze and evaluate engineering solutions',
      'Develop critical thinking and problem-solving skills'
    ],
    modules: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Module ${i + 1}: ${subjectName} Fundamentals`,
      topics: [
        `Introduction to ${subjectName}`,
        'Basic Principles and Laws',
        'Mathematical Modeling',
        'Applications in Engineering',
        'Problem Solving Techniques'
      ],
      hours: 8,
      resources: {
        notes: Math.floor(Math.random() * 10) + 5,
        videos: Math.floor(Math.random() * 5) + 2,
        assignments: Math.floor(Math.random() * 3) + 1,
        papers: Math.floor(Math.random() * 15) + 10
      }
    })),
    resources: {
      totalNotes: 45,
      totalVideos: 18,
      totalAssignments: 12,
      totalPapers: 75,
      textbooks: [
        `${subjectName} Principles by Dr. Smith`,
        `Advanced ${subjectName} by Prof. Johnson`,
        `Engineering ${subjectName} Handbook`
      ]
    }
  }
  
  return baseSubject
}

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const branchSlug = params?.branch as string
  const subjectSlug = params?.subject as string
  
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('overview')
  
  // Convert slug to branch code and subject name
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  const subjectName = slugToSubject(subjectSlug)
  
  // Get branch and subject data
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  const subjectData = branchData ? getSubjectData(subjectName, branchCode) : null

  if (!branchData || !subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Subject Not Found</h1>
          <p className="text-gray-600">The requested subject could not be found.</p>
          <Button onClick={() => router.push(`/dashboard/${branchSlug}/subjects`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
        </div>
      </div>
    )
  }

  const filteredModules = subjectData.modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <BookOpen className="w-4 h-4" />
            Dashboard
          </Button>
          <ChevronRight className="w-4 h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/${branchSlug}`)}
            className="hover:text-blue-600"
          >
            {branchData.name}
          </Button>
          <ChevronRight className="w-4 h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/${branchSlug}/subjects`)}
            className="hover:text-blue-600"
          >
            Subjects
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{subjectData.name}</span>
        </div>

        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-6 flex-1">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg ${
                subjectData.type === 'lab' ? 'bg-green-500' : 
                subjectData.type === 'project' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{subjectData.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{subjectData.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="default">{subjectData.code}</Badge>
                  <Badge variant="outline">{subjectData.credits} Credits</Badge>
                  <Badge variant="secondary">{subjectData.category}</Badge>
                  <Badge variant={subjectData.type === 'lab' ? 'secondary' : 'default'}>
                    {subjectData.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{subjectData.resources.totalNotes}</div>
                    <div className="text-sm text-gray-600">Notes</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Video className="w-6 h-6 text-red-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{subjectData.resources.totalVideos}</div>
                    <div className="text-sm text-gray-600">Videos</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{subjectData.resources.totalAssignments}</div>
                    <div className="text-sm text-gray-600">Assignments</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="font-bold text-lg">{subjectData.resources.totalPapers}</div>
                    <div className="text-sm text-gray-600">Papers</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
              <Button variant="outline" size="lg">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Subject Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Course Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subjectData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{objective}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Module Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Module Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {subjectData.modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.topics.length} topics • {module.hours} hours</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{module.resources.notes} Notes</Badge>
                        <Badge variant="outline">{module.resources.papers} Papers</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modules Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredModules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <Badge variant="secondary">{module.hours}h</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Topics Covered:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {module.topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{module.resources.notes} Notes</span>
                        <span>{module.resources.videos} Videos</span>
                        <span>{module.resources.papers} Papers</span>
                      </div>
                      <Button size="sm">
                        View Resources
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Resource Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl mb-2">{subjectData.resources.totalNotes}</h3>
                <p className="text-gray-600">Study Notes</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Browse Notes
                </Button>
              </Card>
              <Card className="text-center p-6">
                <Video className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl mb-2">{subjectData.resources.totalVideos}</h3>
                <p className="text-gray-600">Video Lectures</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Watch Videos
                </Button>
              </Card>
              <Card className="text-center p-6">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl mb-2">{subjectData.resources.totalAssignments}</h3>
                <p className="text-gray-600">Assignments</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Card>
              <Card className="text-center p-6">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl mb-2">{subjectData.resources.totalPapers}</h3>
                <p className="text-gray-600">Question Papers</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  View Papers
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="textbooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Textbooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectData.resources.textbooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{book}</h4>
                          <p className="text-sm text-gray-600">Recommended textbook #{index + 1}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
