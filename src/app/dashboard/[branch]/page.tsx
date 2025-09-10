'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BookOpen, ArrowLeft, ChevronRight } from 'lucide-react'
import { getBranchCodeFromSlug, clearBranchCache } from '@/lib/branch-utils'

// Interface definitions
interface Subject {
  id: string
  name: string
  code: string
  description: string
  semester: number
  credits: number
  isCore: boolean
  isActive: boolean
}

interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon: string
  color: string
  isActive: boolean
}

export default function BranchPage() {
  const params = useParams()
  const router = useRouter()
  const branchSlug = params?.branch as string
  
  const [branch, setBranch] = useState<Branch | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [branchCode, setBranchCode] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranchCode = async () => {
      if (branchSlug) {
        // Clear cache to ensure fresh data for newly created branches
        clearBranchCache()
        const code = await getBranchCodeFromSlug(branchSlug)
        setBranchCode(code)
        if (code) {
          fetchBranchAndSubjects(code)
        } else {
          setError('Invalid branch')
          setIsLoading(false)
        }
      }
    }
    
    fetchBranchCode()
  }, [branchSlug])

  const fetchBranchAndSubjects = async (code: string) => {
    try {
      setIsLoading(true)
      
      // Fetch all branches to find the one with matching code
      const branchResponse = await fetch('/api/admin/branches')
      const branchData = await branchResponse.json()
      
      if (branchData.success) {
        const currentBranch = branchData.branches.find((b: Branch) => b.code === code && b.isActive)
        
        if (currentBranch) {
          setBranch(currentBranch)
          
          // Fetch subjects for this branch
          const subjectsResponse = await fetch(`/api/admin/branches/${currentBranch.id}/subjects`)
          const subjectsData = await subjectsResponse.json()
          
          if (subjectsData.success) {
            setSubjects(subjectsData.subjects.filter((s: Subject) => s.isActive))
          }
        } else {
          setError('Branch not found or inactive')
        }
      } else {
        setError('Failed to load branch data')
      }
    } catch (error) {
      console.error('Error fetching branch data:', error)
      setError('Failed to load branch data')
    } finally {
      setIsLoading(false)
    }
  }

  // For cycles (physics/chemistry), redirect directly to subjects
  if (branchCode === 'PHYSICS' || branchCode === 'CHEMISTRY') {
    router.push(`/dashboard/${branchSlug}/subjects`)
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Not Found</h1>
          <p className="text-gray-600">{error || 'The requested branch could not be found.'}</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Group subjects by semester
  const subjectsBySemester = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = []
    }
    acc[subject.semester].push(subject)
    return acc
  }, {} as Record<number, Subject[]>)

  // Get available semesters (sorted)
  const availableSemesters = Object.keys(subjectsBySemester)
    .map(Number)
    .sort((a, b) => a - b)

  // If no subjects available, show message
  if (subjects.length === 0) {
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
            <span className="font-medium text-gray-900">{branch.name}</span>
          </div>

          {/* Branch Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 bg-gradient-to-r ${branch.color} rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg`}>
                {branch.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{branch.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{branch.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">No subjects available</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subjects Available</h3>
            <p className="text-gray-600">This branch doesn't have any subjects configured yet.</p>
          </div>
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
          <span className="font-medium text-gray-900">{branch.name}</span>
        </div>

        {/* Branch Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 bg-gradient-to-r ${branch.color} rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg`}>
              {branch.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{branch.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{branch.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="default">{availableSemesters.length} Semesters</Badge>
                <Badge variant="outline">{subjects.length} Total Subjects</Badge>
                <Badge variant="secondary">Engineering</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Selection */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Select Semester</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableSemesters.map((semester) => (
              <Card 
                key={semester}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border-l-4 border-l-blue-500"
                onClick={() => router.push(`/dashboard/${branchSlug}/semester/${semester}/subjects`)}
              >
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">{semester}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                        Semester {semester}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {subjectsBySemester[semester].length} subjects
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {subjectsBySemester[semester].reduce((sum, s) => sum + s.credits, 0)} credits
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 mx-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
