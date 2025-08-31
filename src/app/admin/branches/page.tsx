'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GripVertical,
  BookOpen,
  Users,
  FileText
} from 'lucide-react'

interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
  _count: {
    subjects: number
    resources: number
    students: number
  }
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBranches: Branch[] = [
        {
          id: '1',
          name: 'Computer Science Engineering',
          code: 'CSE',
          description: 'Software development, algorithms, and computer systems',
          icon: '💻',
          color: 'from-blue-500 to-cyan-600',
          order: 1,
          isActive: true,
          _count: { subjects: 42, resources: 156, students: 89 }
        },
        {
          id: '2',
          name: 'Information Science Engineering',
          code: 'ISE',
          description: 'Information systems, data management, and software engineering',
          icon: '🌐',
          color: 'from-cyan-500 to-teal-600',
          order: 2,
          isActive: true,
          _count: { subjects: 38, resources: 142, students: 67 }
        },
        {
          id: '3',
          name: 'Electronics & Communication',
          code: 'ECE',
          description: 'Electronic circuits, communication systems, and signal processing',
          icon: '📡',
          color: 'from-purple-500 to-violet-600',
          order: 3,
          isActive: true,
          _count: { subjects: 45, resources: 178, students: 72 }
        },
        {
          id: '4',
          name: 'Mechanical Engineering',
          code: 'ME',
          description: 'Mechanical systems, thermodynamics, and manufacturing',
          icon: '⚙️',
          color: 'from-orange-500 to-red-600',
          order: 4,
          isActive: true,
          _count: { subjects: 41, resources: 134, students: 65 }
        },
        {
          id: '5',
          name: 'Electrical Engineering',
          code: 'EEE',
          description: 'Electrical power systems, control systems, and electronics',
          icon: '⚡',
          color: 'from-yellow-500 to-orange-600',
          order: 5,
          isActive: true,
          _count: { subjects: 39, resources: 123, students: 58 }
        },
        {
          id: '6',
          name: 'Civil Engineering',
          code: 'CE',
          description: 'Infrastructure, construction, and environmental engineering',
          icon: '🏗️',
          color: 'from-emerald-500 to-green-600',
          order: 6,
          isActive: true,
          _count: { subjects: 37, resources: 98, students: 45 }
        }
      ]
      setBranches(mockBranches)
    } catch (error) {
      console.error('Failed to fetch branches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleActive = async (branchId: string) => {
    // Toggle branch active status
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { ...branch, isActive: !branch.isActive }
        : branch
    ))
  }

  const handleDelete = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      setBranches(prev => prev.filter(branch => branch.id !== branchId))
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600 mt-2">Manage engineering branches and their configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/branches/reorder">
            <Button variant="outline" size="sm">
              <GripVertical className="h-4 w-4 mr-2" />
              Reorder Branches
            </Button>
          </Link>
          <Link href="/admin/branches/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search branches by name or code..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className={`transition-all duration-200 hover:shadow-lg ${
            !branch.isActive ? 'opacity-60' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${branch.color} flex items-center justify-center text-white text-xl`}>
                    {branch.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <p className="text-sm text-gray-500 font-mono">{branch.code}</p>
                  </div>
                </div>
                <Badge variant={branch.isActive ? "default" : "secondary"}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{branch.description}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {branch._count.subjects}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Subjects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {branch._count.resources}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Resources</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {branch._count.students}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(branch.id)}
                  >
                    {branch.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/branches/${branch.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(branch.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first branch.'}
            </p>
            {!searchTerm && (
              <Link href="/admin/branches/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Branch
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
