'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  BookOpen, 
  Trash2, 
  Edit, 
  Eye,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { EnhancedResourceUpload } from '@/components/admin/EnhancedResourceUpload'
import { QuestionPaperManager } from '@/components/admin/QuestionPaperManager'

export default function UploadResourcePage() {
  const [activeTab, setActiveTab] = useState('upload')

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
            <h1 className="text-3xl font-bold text-gray-900">Question Paper Management</h1>
            <p className="text-gray-600 mt-2">Upload, manage, and organize question papers by branch and semester</p>
          </div>
        </div>
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
              <EnhancedResourceUpload />
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
                <p className="text-sm mt-2">Reorganize files by branch and semester structure with drag & drop</p>
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
