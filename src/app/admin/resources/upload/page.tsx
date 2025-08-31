'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResourceUpload } from '@/components/admin/ResourceUpload'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  semester: number
}

export default function UploadResourcePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockCategories: Category[] = [
        { id: '1', name: 'Computer Science' },
        { id: '2', name: 'Electronics' },
        { id: '3', name: 'Mechanical' },
        { id: '4', name: 'Civil' },
        { id: '5', name: 'Mathematics' }
      ]

      const mockSubjects: Subject[] = [
        { id: '1', name: 'Computer Networks', semester: 5 },
        { id: '2', name: 'Database Systems', semester: 4 },
        { id: '3', name: 'Operating Systems', semester: 4 },
        { id: '4', name: 'Digital Electronics', semester: 3 },
        { id: '5', name: 'Data Structures', semester: 3 },
        { id: '6', name: 'Engineering Mathematics', semester: 1 },
        { id: '7', name: 'Physics', semester: 1 },
        { id: '8', name: 'Chemistry', semester: 1 }
      ]

      setCategories(mockCategories)
      setSubjects(mockSubjects)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    // Refresh data or redirect
    router.push('/admin/resources?uploaded=true')
  }

  const getRecentStats = () => {
    // Mock recent upload stats
    return {
      todayUploads: 12,
      weekUploads: 47,
      totalPending: 8
    }
  }

  const stats = getRecentStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/resources">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Resource</h1>
          <p className="text-gray-600 mt-2">Add new study materials, question papers, and resources</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Uploads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayUploads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weekUploads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <ResourceUpload 
            categories={categories}
            subjects={subjects}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">File Requirements</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Maximum file size: 10MB</li>
                    <li>• Formats: PDF, DOC, DOCX, PPT, PPTX</li>
                    <li>• Clear, readable content only</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Content Standards</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Use descriptive titles</li>
                    <li>• Include semester and subject info</li>
                    <li>• Add detailed descriptions</li>
                    <li>• Select appropriate category</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Quality Check</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Verify content accuracy</li>
                    <li>• Check for copyright issues</li>
                    <li>• Ensure files are not corrupted</li>
                    <li>• Remove any sensitive information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/resources">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Resources
                </Button>
              </Link>
              <Link href="/admin/resources?status=pending">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Pending ({stats.totalPending})
                </Button>
              </Link>
              <Link href="/admin/resources/categories">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Database Systems Notes</p>
                  <p className="text-gray-500">Uploaded 2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">CN Question Paper 2024</p>
                  <p className="text-gray-500">Uploaded 4 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">OS Module 3 Slides</p>
                  <p className="text-gray-500">Uploaded yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
