'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Search,
  Grid3X3,
  List,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  ArrowLeft,
  BookMarked,
  Home,
  Play,
  CheckCircle2,
  BarChart3,
  Target,
  Award,
  Lightbulb,
  Filter,
  Star,
  Download,
  Video,
  HelpCircle,
  Bookmark,
  Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { VTU_CURRICULUM, FIRST_YEAR_CYCLES, getBranchByCode, getCycleByCode, getSubjectsBySemester, getAllBranches, getAllCycles } from '@/lib/vtu-curriculum'

interface BranchSemesterNavigationProps {
  onSelectionChange?: (branch: string, semester: number | string, subject?: string) => void
}

type NavigationLevel = 'dashboard' | 'category' | 'branch' | 'semester' | 'subject' | 'module'

export function BranchSemesterNavigationEnhanced({ onSelectionChange }: BranchSemesterNavigationProps) {
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('dashboard')
  const [selectedCategory, setSelectedCategory] = useState<'cycles' | 'branches' | ''>('')
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<number | string>(3)
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (selectedBranch && selectedSemester && onSelectionChange) {
      onSelectionChange(selectedBranch, selectedSemester, selectedSubject)
    }
  }, [selectedBranch, selectedSemester, selectedSubject, onSelectionChange])

  // Smooth transition helper
  const handleTransition = (level: NavigationLevel, callback?: () => void) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentLevel(level)
      callback?.()
      setTimeout(() => setIsTransitioning(false), 150)
    }, 150)
  }

  // Navigation helpers
  const resetToDashboard = () => {
    handleTransition('dashboard', () => {
      setSelectedCategory('')
      setSelectedBranch('')
      setSelectedSubject('')
      setSearchTerm('')
    })
  }

  const goToCategory = (category: 'cycles' | 'branches') => {
    handleTransition('category', () => {
      setSelectedCategory(category)
      setSelectedBranch('')
      setSelectedSubject('')
    })
  }

  const goToBranch = (branchCode: string) => {
    handleTransition('branch', () => {
      setSelectedBranch(branchCode)
      if (selectedCategory === 'cycles') {
        setSelectedSemester(branchCode === 'PHYSICS' ? 'Physics Cycle' : 'Chemistry Cycle')
        setCurrentLevel('subject')
      } else {
        setSelectedSemester(3)
      }
    })
  }

  const goToSemester = (semester: number | string) => {
    handleTransition('subject', () => {
      setSelectedSemester(semester)
      setSelectedSubject('')
    })
  }

  const goToSubject = (subjectName: string) => {
    handleTransition('module', () => {
      setSelectedSubject(subjectName)
    })
  }

  // Module toggle handler
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

  const toggleBookmark = (subjectId: string) => {
    setBookmarkedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId)
      } else {
        newSet.add(subjectId)
      }
      return newSet
    })
  }

  // Breadcrumb component
  const Breadcrumb = () => {
    const selectedData = selectedCategory === 'cycles' 
      ? getCycleByCode(selectedBranch) 
      : getBranchByCode(selectedBranch)

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDashboard}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Button>
        
        {currentLevel !== 'dashboard' && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTransition('category')}
              className="hover:text-blue-600"
            >
              {selectedCategory === 'cycles' ? 'Foundation Cycles' : 'Engineering Branches'}
            </Button>
          </>
        )}

        {selectedBranch && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTransition('branch')}
              className="hover:text-blue-600"
            >
              {selectedData?.name || selectedBranch}
            </Button>
          </>
        )}

        {selectedSemester && currentLevel !== 'branch' && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTransition('subject')}
              className="hover:text-blue-600"
            >
              {typeof selectedSemester === 'number' ? `Semester ${selectedSemester}` : selectedSemester}
            </Button>
          </>
        )}

        {selectedSubject && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{selectedSubject}</span>
          </>
        )}
      </div>
    )
  }

  // Dashboard View - Enhanced 3x3 Grid
  const DashboardView = () => (
    <div className={`space-y-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Enhanced Header */}
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">Academic Programs</h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Choose your academic program to access comprehensive study materials, modules, and resources
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced 3x3 Branch Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Physics Cycle */}
          <BranchCard
            title="Physics"
            subtitle="Foundation Year"
            icon="⚛️"
            color="from-indigo-500 to-purple-600"
            hoverColor="hover:border-indigo-300"
            badges={[{ text: "First Year", variant: "secondary" }, { text: "Core", variant: "outline" }]}
            onClick={() => goToCategory('cycles')}
          />

          {/* Chemistry Cycle */}
          <BranchCard
            title="Chemistry"
            subtitle="Foundation Year"
            icon="🧪"
            color="from-green-500 to-emerald-600"
            hoverColor="hover:border-green-300"
            badges={[{ text: "First Year", variant: "secondary" }, { text: "Core", variant: "outline" }]}
            onClick={() => goToCategory('cycles')}
          />

          {/* Computer Science */}
          <BranchCard
            title="Computer Science"
            subtitle="CSE"
            icon="💻"
            color="from-blue-500 to-cyan-600"
            hoverColor="hover:border-blue-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('CSE')}
          />

          {/* Information Science */}
          <BranchCard
            title="Information Science"
            subtitle="ISE"
            icon="🌐"
            color="from-cyan-500 to-teal-600"
            hoverColor="hover:border-cyan-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('ISE')}
          />

          {/* Electronics & Communication */}
          <BranchCard
            title="Electronics & Communication"
            subtitle="ECE"
            icon="📡"
            color="from-purple-500 to-violet-600"
            hoverColor="hover:border-purple-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('ECE')}
          />

          {/* Artificial Intelligence */}
          <BranchCard
            title="Artificial Intelligence"
            subtitle="AI & ML"
            icon="🤖"
            color="from-rose-500 to-pink-600"
            hoverColor="hover:border-rose-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('AIML')}
          />

          {/* Electrical & Electronics */}
          <BranchCard
            title="Electrical & Electronics"
            subtitle="EEE"
            icon="⚡"
            color="from-yellow-500 to-amber-600"
            hoverColor="hover:border-yellow-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('EEE')}
          />

          {/* Civil Engineering */}
          <BranchCard
            title="Civil Engineering"
            subtitle="Civil"
            icon="🏗️"
            color="from-emerald-500 to-green-600"
            hoverColor="hover:border-emerald-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('CE')}
          />

          {/* Mechanical Engineering */}
          <BranchCard
            title="Mechanical Engineering"
            subtitle="Mech"
            icon="⚙️"
            color="from-orange-500 to-red-600"
            hoverColor="hover:border-orange-300"
            badges={[{ text: "Sem 3-7", variant: "secondary" }, { text: "Engineering", variant: "outline" }]}
            onClick={() => goToBranch('ME')}
          />
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 rounded-3xl p-10 mx-auto max-w-5xl">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Program Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number="9" label="Total Programs" gradient="from-blue-600 to-purple-600" />
          <StatCard number="50+" label="Subjects" gradient="from-green-600 to-emerald-600" />
          <StatCard number="250+" label="Modules" gradient="from-purple-600 to-pink-600" />
          <StatCard number="1000+" label="Resources" gradient="from-orange-600 to-red-600" />
        </div>
      </div>
    </div>
  )

  // Branch Card Component
  const BranchCard = ({ title, subtitle, icon, color, hoverColor, badges, onClick }: {
    title: string
    subtitle: string
    icon: string
    color: string
    hoverColor: string
    badges: Array<{ text: string, variant: any }>
    onClick: () => void
  }) => (
    <div 
      className={`group cursor-pointer bg-white rounded-3xl p-8 border-2 border-gray-100 ${hoverColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <span className="text-4xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant} className="text-xs">{badge.text}</Badge>
          ))}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  )

  // Statistics Card Component
  const StatCard = ({ number, label, gradient }: { number: string, label: string, gradient: string }) => (
    <div className="space-y-3">
      <div className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {number}
      </div>
      <div className="text-sm text-gray-700 font-medium">{label}</div>
    </div>
  )

  // Subject Module View - Enhanced
  const ModuleView = () => {
    const selectedData = selectedCategory === 'cycles' 
      ? getCycleByCode(selectedBranch) 
      : getBranchByCode(selectedBranch)
    
    const subjects = getSubjectsBySemester(selectedBranch, selectedSemester)
    const currentSubject = subjects.find(s => s.name === selectedSubject)
    
    if (!currentSubject) return null

    return (
      <div className="space-y-8">
        <Breadcrumb />
        
        {/* Subject Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                currentSubject.type === 'lab' ? 'bg-green-100' : 
                currentSubject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                <BookOpen className={`w-8 h-8 ${
                  currentSubject.type === 'lab' ? 'text-green-600' : 
                  currentSubject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentSubject.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{currentSubject.code}</p>
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
                onClick={() => toggleBookmark(currentSubject.code)}
                className={bookmarkedSubjects.has(currentSubject.code) ? 'bg-yellow-50 border-yellow-300' : ''}
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedSubjects.has(currentSubject.code) ? 'fill-current text-yellow-500' : ''}`} />
                {bookmarkedSubjects.has(currentSubject.code) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransition('subject')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
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
    <Card className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <CardContent className="p-0">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index}
            </div>
            <div>
              <h3 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                {module}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Click to expand module details and resources
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleComplete()
              }}
              className={isCompleted ? 'text-green-600' : 'text-gray-400'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResourceButton icon={<FileText className="w-4 h-4" />} label="Study Notes" />
              <ResourceButton icon={<Video className="w-4 h-4" />} label="Video Lectures" />
              <ResourceButton icon={<Download className="w-4 h-4" />} label="Assignments" />
              <ResourceButton icon={<HelpCircle className="w-4 h-4" />} label="Quiz" />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Learning Objectives
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Understand core concepts and principles</li>
                <li>• Apply theoretical knowledge to practical problems</li>
                <li>• Develop analytical and problem-solving skills</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Resource Button Component
  const ResourceButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50">
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  )

  // Main render logic based on current level
  const renderCurrentView = () => {
    switch (currentLevel) {
      case 'dashboard':
        return <DashboardView />
      case 'category':
        return <CategoryView />
      case 'branch':
        return <BranchView />
      case 'subject':
        return <SubjectView />
      case 'module':
        return <ModuleView />
      default:
        return <DashboardView />
    }
  }

  // Category View - Shows cycles or branches list
  const CategoryView = () => {
    const items = selectedCategory === 'cycles' ? getAllCycles() : getAllBranches()
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className={`space-y-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <Breadcrumb />
        
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'cycles' ? 'Foundation Cycles' : 'Engineering Branches'}
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              {selectedCategory === 'cycles' 
                ? 'Select your foundation cycle to access core materials'
                : 'Select your engineering branch to explore specialized courses'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${selectedCategory}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
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
        </div>

        {/* Items Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card 
                key={item.code}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 group"
                style={{ borderLeftColor: item.color.replace('bg-', '').replace('-500', '') }}
                onClick={() => goToBranch(item.code)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {selectedCategory === 'cycles' ? '1 Semester' : '5 Semesters'}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.code}
                      </h3>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookMarked className="w-3 h-3" />
                        <span>{item.semesters.length} semester{item.semesters.length > 1 ? 's' : ''}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card 
                key={item.code}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => goToBranch(item.code)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.code} • {item.semesters.length} semesters</p>
                        <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    )
  }

  // Branch View - Shows semester selection for branches
  const BranchView = () => {
    const selectedData = selectedCategory === 'cycles' 
      ? getCycleByCode(selectedBranch) 
      : getBranchByCode(selectedBranch)
    
    if (!selectedData) return null

    // For cycles, go directly to subjects
    if (selectedCategory === 'cycles') {
      setCurrentLevel('subject')
      return null
    }

    return (
      <div className={`space-y-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <Breadcrumb />
        
        {/* Branch Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 ${selectedData.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
              {selectedData.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedData.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{selectedData.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="default">5 Semesters</Badge>
                <Badge variant="outline">Semesters 3-7</Badge>
                <Badge variant="secondary">Engineering</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Selection */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Semester</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }, (_, i) => i + 3).map((sem) => (
              <Card 
                key={sem}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-l-4 border-l-blue-500"
                onClick={() => goToSemester(sem)}
              >
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                      <span className="text-2xl font-bold text-white">{sem}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        Semester {sem}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getSubjectsBySemester(selectedBranch, sem).length} subjects
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Subject View - Shows subjects for selected semester
  const SubjectView = () => {
    const selectedData = selectedCategory === 'cycles' 
      ? getCycleByCode(selectedBranch) 
      : getBranchByCode(selectedBranch)
    
    if (!selectedData) return null

    const subjects = getSubjectsBySemester(selectedBranch, selectedSemester)
    const filteredSubjects = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className={`space-y-8 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <Breadcrumb />
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {typeof selectedSemester === 'number' ? `Semester ${selectedSemester}` : selectedSemester} - {selectedData.name}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {filteredSubjects.length} subjects • Click on any subject to explore modules
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Academic Year 2024-25
            </Badge>
          </div>
        </div>

        {/* Subjects Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard 
                key={subject.code} 
                subject={subject}
                onSelect={() => goToSubject(subject.name)}
                isBookmarked={bookmarkedSubjects.has(subject.code)}
                onBookmark={() => toggleBookmark(subject.code)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubjects.map((subject) => (
              <SubjectListItem 
                key={subject.code} 
                subject={subject}
                onSelect={() => goToSubject(subject.name)}
                isBookmarked={bookmarkedSubjects.has(subject.code)}
                onBookmark={() => toggleBookmark(subject.code)}
              />
            ))}
          </div>
        )}

        {filteredSubjects.length === 0 && subjects.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No subjects found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Subjects for this semester will be added soon. Check back later or contact support.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button>Request Subjects</Button>
            </div>
          </div>
        )}

        {filteredSubjects.length === 0 && subjects.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching subjects found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    )
  }

  // Enhanced Subject Card Component
  const SubjectCard = ({ subject, onSelect, isBookmarked, onBookmark }: {
    subject: any
    onSelect: () => void
    isBookmarked: boolean
    onBookmark: () => void
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full border-l-4 border-l-blue-500">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              subject.type === 'lab' ? 'bg-green-100' : 
              subject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <BookOpen className={`w-6 h-6 ${
                subject.type === 'lab' ? 'text-green-600' : 
                subject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onBookmark()
              }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${isBookmarked ? 'opacity-100' : ''}`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
            </Button>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{subject.code}</p>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge 
                variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'} 
                className="text-xs"
              >
                {subject.credits} credits
              </Badge>
              <Badge variant="outline" className="text-xs">
                {subject.type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {subject.category}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Modules:</span> {subject.modules?.length || 5}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Resources
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Details
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
            onClick={onSelect}
          >
            Explore Modules
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Enhanced Subject List Item Component
  const SubjectListItem = ({ subject, onSelect, isBookmarked, onBookmark }: {
    subject: any
    onSelect: () => void
    isBookmarked: boolean
    onBookmark: () => void
  }) => (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1" onClick={onSelect}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              subject.type === 'lab' ? 'bg-green-100' : 
              subject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <BookOpen className={`w-7 h-7 ${
                subject.type === 'lab' ? 'text-green-600' : 
                subject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                  {subject.name}
                </h3>
                <div className="flex items-center gap-2">
                  {subject.modules?.slice(0, 3).map((_: any, index: number) => (
                    <div key={index} className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  ))}
                  {(subject.modules?.length || 5) > 3 && (
                    <span className="text-xs text-gray-500">+{(subject.modules?.length || 5) - 3}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {subject.code} • {subject.credits} credits • {subject.modules?.length || 5} modules
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'}>
                  {subject.type}
                </Badge>
                <Badge variant="outline">{subject.category}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onBookmark()
              }}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={onSelect}>
              Explore
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {renderCurrentView()}
    </div>
  )
}
