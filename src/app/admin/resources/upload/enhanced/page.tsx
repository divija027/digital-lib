'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  BookOpen, 
  Eye,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { EnhancedResourceUpload } from '@/components/admin/EnhancedResourceUpload'
import { QuestionPaperManager } from '@/components/admin/QuestionPaperManager'

export default function EnhancedUploadPage() {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadStats, setUploadStats] = useState({
    todayUploads: 0,
    weekUploads: 0,
    totalFiles: 0,
    pendingReview: 0
  })

  useEffect(() => {
    fetchUploadStats()
  }, [])

  const fetchUploadStats = async () => {
    try {
      // Mock data - replace with actual API call
      setUploadStats({
        todayUploads: 12,
        weekUploads: 47,
        totalFiles: 1250,
        pendingReview: 8
      })
    } catch (error) {
      console.error('Failed to fetch upload stats:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/resources">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management Center</h1>
            <p className="text-gray-600 mt-2">Upload, manage, and organize question papers by branch and semester</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Today&apos;s Uploads</p>
                <p className="text-2xl font-bold text-blue-900">{uploadStats.todayUploads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">This Week</p>
                <p className="text-2xl font-bold text-green-900">{uploadStats.weekUploads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Total Files</p>
                <p className="text-2xl font-bold text-purple-900">{uploadStats.totalFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-900">{uploadStats.pendingReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manage Files
          </TabsTrigger>
          <TabsTrigger value="organize" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Organize by Branch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedResourceUpload onUploadSuccess={fetchUploadStats} />
            </div>
            <div className="space-y-6">
              {/* Upload Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Paper Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">File Requirements</h4>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>• Maximum file size: 25MB</li>
                        <li>• Formats: PDF only (for question papers)</li>
                        <li>• Clear, readable scanned documents</li>
                        <li>• Original VTU question papers only</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Naming Convention</h4>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>• Branch_Semester_Subject_Year_Scheme</li>
                        <li>• Example: CSE_5_CN_2024_2022SCHEME</li>
                        <li>• Use proper abbreviations</li>
                        <li>• Include examination month if available</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Organization Standards</h4>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>• Select correct branch and semester</li>
                        <li>• Choose appropriate subject</li>
                        <li>• Add examination year and month</li>
                        <li>• Include scheme year (2022/2018/2015)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Bulk Upload (Coming Soon)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6 mt-6">
          <QuestionPaperManager />
        </TabsContent>

        <TabsContent value="organize" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Branch & Semester Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium">Branch Organization Tool</p>
                <p className="text-sm mt-2">Coming soon - Organize files by branch and semester structure</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
