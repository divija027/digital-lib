'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  Target,
  Lightbulb,
  FileText,
  Video,
  Download,
  HelpCircle,
  Bookmark
} from 'lucide-react'
import { getBranchByCode, getCycleByCode, getSubjectsBySemester } from '@/lib/vtu-curriculum'

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

// Convert subject slug back to name (simplified matching)
const slugToSubjectName = (slug: string, subjects: any[]): string => {
  const subjectFromSlug = subjects.find(s => 
    s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === slug
  )
  return subjectFromSlug?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [isBookmarked, setIsBookmarked] = useState(false)

  const branchSlug = params?.branch as string
  const semester = params?.semester as string
  const subjectSlug = params?.subject as string
  
  // Convert slug to branch code
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null
  
  // Get semester number or handle cycles
  let semesterNumber: number | string
  if (semester === 'physics-cycle') {
    semesterNumber = 'Physics Cycle'
  } else if (semester === 'chemistry-cycle') {
    semesterNumber = 'Chemistry Cycle'
  } else {
    semesterNumber = parseInt(semester)
  }

  // Get subjects and find current subject
  const subjects = branchCode ? getSubjectsBySemester(branchCode, semesterNumber) : []
  const currentSubject = subjects.find(s => 
    s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === subjectSlug
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const toggleCompleted = (moduleId: string) => {
    setCompletedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  if (!branchData || !currentSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Subject Not Found</h1>
          <p className="text-gray-600">The requested subject could not be found.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

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
            onClick={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subjects`)}
            className="hover:text-blue-600"
          >
            {typeof semesterNumber === 'number' ? `Semester ${semesterNumber}` : semesterNumber}
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{currentSubject.name}</span>
        </div>

        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                currentSubject.type === 'lab' ? 'bg-green-100' : 
                currentSubject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                <BookOpen className={`w-10 h-10 ${
                  currentSubject.type === 'lab' ? 'text-green-600' : 
                  currentSubject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{currentSubject.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{currentSubject.code}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="text-sm">{currentSubject.credits} Credits</Badge>
                  <Badge variant="outline" className="text-sm">{currentSubject.type}</Badge>
                  <Badge variant="secondary" className="text-sm">{currentSubject.category}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'bg-yellow-50 border-yellow-300' : ''}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subjects`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Course Modules</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Target className="w-3 h-3 mr-1" />
                {completedModules.size} / {currentSubject.modules?.length || 5} Complete
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(currentSubject.modules || Array.from({ length: 5 }, (_, i) => `Module ${i + 1}: Core Concepts`)).map((module, index) => (
              <ModuleCard 
                key={`${currentSubject.code}-${index}`}
                module={module}
                moduleId={`${currentSubject.code}-${index}`}
                index={index + 1}
                isExpanded={expandedModules.has(`${currentSubject.code}-${index}`)}
                isCompleted={completedModules.has(`${currentSubject.code}-${index}`)}
                onToggle={() => toggleModule(`${currentSubject.code}-${index}`)}
                onToggleComplete={() => toggleCompleted(`${currentSubject.code}-${index}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Module Card Component
const ModuleCard = ({ module, moduleId, index, isExpanded, isCompleted, onToggle, onToggleComplete }: {
  module: string
  moduleId: string
  index: number
  isExpanded: boolean
  isCompleted: boolean
  onToggle: () => void
  onToggleComplete: () => void
}) => (
  <Card className={`transition-all duration-300 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'}`}>
    <CardContent className="p-0">
      <div 
        className="flex items-center justify-between p-8 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index}
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
              {module}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Click to expand module details and resources
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete()
            }}
            className={isCompleted ? 'text-green-600' : 'text-gray-400'}
          >
            <CheckCircle2 className="w-5 h-5" />
          </Button>
          {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResourceButton icon={<FileText className="w-5 h-5" />} label="Study Notes" />
            <ResourceButton icon={<Video className="w-5 h-5" />} label="Video Lectures" />
            <ResourceButton icon={<Download className="w-5 h-5" />} label="Assignments" />
            <ResourceButton icon={<HelpCircle className="w-5 h-5" />} label="Quiz" />
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Learning Objectives
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Understand core concepts and principles</li>
              <li>• Apply theoretical knowledge to practical problems</li>
              <li>• Develop analytical and problem-solving skills</li>
              <li>• Master industry-relevant techniques and methodologies</li>
            </ul>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

// Resource Button Component
const ResourceButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-blue-50 transition-colors">
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Button>
)
