'use client'

import { useState } from 'react'
import { BranchSemesterNavigation } from '@/components/BranchSemesterNavigation'
import { ResourceCategories } from '@/components/ResourceCategories'
import { LogoutButton } from '@/components/LogoutButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Download,
  Bell,
  Settings,
  Search,
  Home
} from 'lucide-react'

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  const handleSelectionChange = (branch: string, semester: number, subject?: string) => {
    setSelectedBranch(branch)
    setSelectedSemester(semester)
    if (subject) setSelectedSubject(subject)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BrainReef</h1>
                <p className="text-xs text-gray-600">VTU Learning Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {(selectedBranch || selectedSubject) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            {selectedBranch && (
              <>
                <span>→</span>
                <span>{selectedBranch}</span>
              </>
            )}
            {selectedSemester && selectedBranch && (
              <>
                <span>→</span>
                <span>Semester {selectedSemester}</span>
              </>
            )}
            {selectedSubject && (
              <>
                <span>→</span>
                <span className="font-medium text-gray-900">{selectedSubject}</span>
              </>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedBranch ? (
          // Dashboard Overview
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Resources</p>
                      <p className="text-2xl font-bold text-gray-900">2,847</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-gray-600 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Students</p>
                      <p className="text-2xl font-bold text-gray-900">12,456</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600">+8%</span>
                    <span className="text-gray-600 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Downloads Today</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600">+15%</span>
                    <span className="text-gray-600 ml-1">from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">94.2%</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600">+2.1%</span>
                    <span className="text-gray-600 ml-1">from last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Navigation */}
            <BranchSemesterNavigation onSelectionChange={handleSelectionChange} />
          </div>
        ) : (
          // Branch/Subject Selected View
          <div className="space-y-6">
            <BranchSemesterNavigation onSelectionChange={handleSelectionChange} />
            
            {/* Resources for selected branch/semester */}
            <ResourceCategories 
              branch={selectedBranch}
              semester={selectedSemester}
              subject={selectedSubject}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">BrainReef</span>
              </div>
              <p className="text-sm text-gray-600">
                Your comprehensive VTU study materials platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Question Papers</li>
                <li>Study Notes</li>
                <li>Syllabus</li>
                <li>Previous Year Papers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Branches</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Computer Science</li>
                <li>Information Science</li>
                <li>Electronics & Communication</li>
                <li>Mechanical Engineering</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Report Issue</li>
                <li>Request Content</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <p className="text-center text-sm text-gray-600">
              © 2024 BrainReef. All rights reserved. Made for VTU students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
