'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BookOpen, ArrowLeft, ChevronRight } from 'lucide-react'
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

export default function BranchPage() {
  const params = useParams()
  const router = useRouter()
  const branchSlug = params?.branch as string
  
  // Convert slug to branch code
  const branchCode = BRANCH_SLUG_MAP[branchSlug?.toLowerCase()]
  
  // Get branch data
  const branchData = branchCode ? (getBranchByCode(branchCode) || getCycleByCode(branchCode)) : null

  if (!branchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Not Found</h1>
          <p className="text-gray-600">The requested branch could not be found.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // For cycles, redirect directly to subjects
  if (branchCode === 'PHYSICS' || branchCode === 'CHEMISTRY') {
    router.push(`/dashboard/${branchSlug}/subjects`)
    return null
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
          <span className="font-medium text-gray-900">{branchData.name}</span>
        </div>

        {/* Branch Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 ${branchData.color} rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg`}>
              {branchData.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{branchData.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{branchData.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="default">5 Semesters</Badge>
                <Badge variant="outline">Semesters 3-7</Badge>
                <Badge variant="secondary">Engineering</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Selection */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Select Semester</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }, (_, i) => i + 3).map((sem) => (
              <Card 
                key={sem}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border-l-4 border-l-blue-500"
                onClick={() => router.push(`/dashboard/${branchSlug}/semester/${sem}/subjects`)}
              >
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">{sem}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                        Semester {sem}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {branchData.semesters.find(s => s.semester === sem)?.subjects.length || 0} subjects
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
