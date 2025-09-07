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
  Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { VTU_CURRICULUM, FIRST_YEAR_CYCLES, getBranchByCode, getCycleByCode, getSubjectsBySemester, getAllBranches, getAllCycles } from '@/lib/vtu-curriculum'

interface BranchSemesterNavigationProps {
  onSelectionChange?: (branch: string, semester: number | string, subject?: string) => void
}

export function BranchSemesterNavigation({ onSelectionChange }: BranchSemesterNavigationProps) {
  const [selectedCategory, setSelectedCategory] = useState<'cycles' | 'branches' | ''>('')
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<number | string>(3)
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (selectedItem && selectedSemester && onSelectionChange) {
      onSelectionChange(selectedItem, selectedSemester, selectedSubject)
    }
  }, [selectedItem, selectedSemester, selectedSubject, onSelectionChange])

  // Smooth transition helper
  const handleTransition = (callback: () => void) => {
    setIsTransitioning(true)
    setTimeout(() => {
      callback()
      setTimeout(() => setIsTransitioning(false), 150)
    }, 150)
  }

  // Reset navigation to dashboard
  const resetToDashboard = () => {
    handleTransition(() => {
      setSelectedCategory('')
      setSelectedItem('')
      setSelectedSubject('')
      setSearchTerm('')
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

  // Show items based on selected category
  const items = selectedCategory === 'cycles' ? getAllCycles() : getAllBranches()
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // If no item selected, show the list
  if (!selectedItem) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'cycles' ? 'Physics & Chemistry Cycles' : 'Engineering Branches'}
              </h1>
              <p className="text-gray-600">
                {selectedCategory === 'cycles' 
                  ? 'Select your cycle to access foundation materials'
                  : 'Select your branch to access specialized materials'
                }
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${selectedCategory}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.code}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4"
              style={{ borderLeftColor: item.color.replace('bg-', '').replace('-500', '') }}
              onClick={() => {
                setSelectedItem(item.code)
                if (selectedCategory === 'cycles') {
                  setSelectedSemester(item.code === 'PHYSICS' ? 'Physics Cycle' : 'Chemistry Cycle')
                } else {
                  setSelectedSemester(3) // Default to semester 3 for branches
                }
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{item.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {selectedCategory === 'cycles' ? '1 Semester' : '5 Semesters'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
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
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

  // Show subjects for selected item
  const selectedData = selectedCategory === 'cycles' 
    ? getCycleByCode(selectedItem) 
    : getBranchByCode(selectedItem)
  
  if (!selectedData) {
    return <div>Item not found</div>
  }

  const subjects = getSubjectsBySemester(selectedItem, selectedSemester)
  const availableSemesters = selectedData.semesters

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedItem('')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 ${selectedData.color} rounded-xl flex items-center justify-center text-white text-xl`}
            >
              {selectedData.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedData.code}</h1>
              <p className="text-sm text-gray-600">{selectedData.name}</p>
            </div>
          </div>
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

      {/* Semester Navigation for Branches */}
      {selectedCategory === 'branches' && (
        <Tabs value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => i + 3).map((sem) => (
              <TabsTrigger key={sem} value={sem.toString()} className="text-sm">
                Sem {sem}
              </TabsTrigger>
            ))}
          </TabsList>

          {Array.from({ length: 5 }, (_, i) => i + 3).map((sem) => (
            <TabsContent key={sem} value={sem.toString()} className="space-y-6">
              <SemesterContent 
                semester={sem}
                semesterName={`Semester ${sem}`}
                subjects={getSubjectsBySemester(selectedItem, sem)}
                viewMode={viewMode}
                branchName={selectedData.name}
                onSelectionChange={onSelectionChange}
                branch={selectedItem}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Direct content for Cycles */}
      {selectedCategory === 'cycles' && (
        <SemesterContent 
          semester={selectedSemester}
          semesterName={selectedData.semesters[0]?.name || 'Cycle Subjects'}
          subjects={subjects}
          viewMode={viewMode}
          branchName={selectedData.name}
          onSelectionChange={onSelectionChange}
          branch={selectedItem}
        />
      )}
    </div>
  )
}

// Semester Content Component
function SemesterContent({ 
  semester, 
  semesterName, 
  subjects, 
  viewMode, 
  branchName,
  onSelectionChange,
  branch
}: {
  semester: number | string
  semesterName: string
  subjects: any[]
  viewMode: 'grid' | 'list'
  branchName: string
  onSelectionChange?: (branch: string, semester: number | string, subject?: string) => void
  branch: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {semesterName} - {branchName}
          </h2>
          <p className="text-gray-600">
            {subjects.length} subjects • Click on any subject to view question papers and resources
          </p>
        </div>
        
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Academic Year 2024-25
        </Badge>
      </div>

      {/* Subjects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.code} 
              subject={subject} 
              branch={branch}
              semester={semester}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <SubjectListItem 
              key={subject.code} 
              subject={subject} 
              branch={branch}
              semester={semester}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      )}

      {subjects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No subjects found
          </h3>
          <p className="text-gray-500 mb-4">
            Subjects for this semester will be added soon.
          </p>
          <Button variant="outline" size="sm">
            Request Subjects
          </Button>
        </div>
      )}
    </div>
  )
}

// Subject Card Component
function SubjectCard({ subject, branch, semester, onSelectionChange }: { 
  subject: any, 
  branch: string, 
  semester: number | string,
  onSelectionChange?: (branch: string, semester: number | string, subject?: string) => void
}) {
  const handleClick = () => {
    if (onSelectionChange) {
      onSelectionChange(branch, semester, subject.name)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full" onClick={handleClick}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-500">{subject.code}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'} 
                className="text-xs"
              >
                {subject.credits} credits
              </Badge>
              <Badge variant="outline" className="text-xs">
                {subject.type}
              </Badge>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            <span className="font-medium">Question Papers:</span> Available for download
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Previous Years
              </span>
              <span className="flex items-center gap-1">
                <BookMarked className="w-3 h-3" />
                Model Papers
              </span>
            </div>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Subject List Item Component
function SubjectListItem({ subject, branch, semester, onSelectionChange }: { 
  subject: any, 
  branch: string, 
  semester: number | string,
  onSelectionChange?: (branch: string, semester: number | string, subject?: string) => void
}) {
  const handleClick = () => {
    if (onSelectionChange) {
      onSelectionChange(branch, semester, subject.name)
    }
  }

  return (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              subject.type === 'lab' ? 'bg-green-100' : 
              subject.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <BookOpen className={`w-6 h-6 ${
                subject.type === 'lab' ? 'text-green-600' : 
                subject.type === 'project' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <p className="text-sm text-gray-500">{subject.code} • {subject.credits} credits • Previous year papers available</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Badge variant={subject.type === 'lab' ? 'secondary' : subject.type === 'project' ? 'outline' : 'default'}>
              {subject.type}
            </Badge>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Resources
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
