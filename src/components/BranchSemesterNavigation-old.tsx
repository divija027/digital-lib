'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Download, 
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  BookmarkPlus,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { VTU_CURRICULUM, getSubjectsBySemester, getBranchByCode } from '@/lib/vtu-curriculum'

// VTU Engineering Branches - Updated to match VTU_CURRICULUM
const VTU_BRANCHES = VTU_CURRICULUM.map(branch => ({
  code: branch.code,
  name: branch.name,
  icon: branch.icon,
  color: branch.color,
  subjects: 8,
  description: branch.description
}))

interface BranchSemesterNavigationProps {
  onSelectionChange?: (branch: string, semester: number, subject?: string) => void
}

export function BranchSemesterNavigation({ onSelectionChange }: BranchSemesterNavigationProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (selectedBranch && onSelectionChange) {
      onSelectionChange(selectedBranch, selectedSemester)
    }
  }, [selectedBranch, selectedSemester, onSelectionChange])

  const filteredBranches = VTU_BRANCHES.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get subjects for the selected branch and semester using VTU curriculum data
  const subjects = selectedBranch ? getSubjectsBySemester(selectedBranch, selectedSemester) : []

  if (!selectedBranch) {
    return (
      <div className="space-y-6">
        {/* Branch Selection Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">VTU Study Materials</h1>
              <p className="text-gray-600">Choose your engineering branch to get started</p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBranches.map((branch) => (
            <Card 
              key={branch.code}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4"
              style={{ borderLeftColor: branch.color.replace('bg-', '').replace('-500', '') }}
              onClick={() => setSelectedBranch(branch.code)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{branch.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {branch.subjects} semesters
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {branch.code}
                    </h3>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {branch.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {branch.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    )
  }

  const selectedBranchData = getBranchByCode(selectedBranch)
  
  if (!selectedBranchData) {
    return <div>Branch not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Branch Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedBranch('')}
          >
            ← Back to Branches
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 ${selectedBranchData.color} rounded-lg flex items-center justify-center text-white text-lg`}
            >
              {selectedBranchData.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedBranchData.code}</h1>
              <p className="text-sm text-gray-600">{selectedBranchData.name}</p>
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

      {/* Semester Navigation */}
      <Tabs value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
            <TabsTrigger key={sem} value={sem.toString()} className="text-xs sm:text-sm">
              Sem {sem}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
          <TabsContent key={sem} value={sem.toString()} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Semester {sem} - {selectedBranchData.name}
                </h2>
                <p className="text-gray-600">
                  {subjects.length} subjects • Click on any subject to view resources
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
                    branch={selectedBranch}
                    semester={sem}
                    onSelectionChange={onSelectionChange}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <SubjectListItem 
                    key={subject.code} 
                    subject={subject} 
                    branch={selectedBranch}
                    semester={sem}
                    onSelectionChange={onSelectionChange}
                  />
                ))}
              </div>
            )}

            {subjects.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No subjects found for Semester {sem}
                </h3>
                <p className="text-gray-500 mb-4">
                  Subjects for this semester will be added soon.
                </p>
                <Button variant="outline" size="sm">
                  Request Subjects
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Subject Card Component
function SubjectCard({ subject, branch, semester, onSelectionChange }: { 
  subject: any, 
  branch: string, 
  semester: number,
  onSelectionChange?: (branch: string, semester: number, subject?: string) => void
}) {
  const handleClick = () => {
    if (onSelectionChange) {
      onSelectionChange(branch, semester, subject.name)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-500">{subject.code}</p>
            </div>
            <Badge 
              variant={subject.type === 'lab' ? 'secondary' : 'default'} 
              className="text-xs"
            >
              {subject.credits} credits
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                12 resources
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                245 downloads
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
  semester: number,
  onSelectionChange?: (branch: string, semester: number, subject?: string) => void
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <p className="text-sm text-gray-500">{subject.code} • {subject.credits} credits</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              12 resources
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              245 downloads
            </span>
            <Badge variant={subject.type === 'lab' ? 'secondary' : 'outline'}>
              {subject.type}
            </Badge>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
