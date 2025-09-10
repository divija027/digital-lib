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
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
  subjectCount?: number
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
      setIsLoading(true)
      // Add cache busting to ensure fresh data
      const timestamp = Date.now()
      const response = await fetch(`/api/admin/branches?t=${timestamp}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch branches')
      }
      
      if (data.success) {
        // Ensure proper sorting by order
        const sortedBranches = data.branches.sort((a: Branch, b: Branch) => a.order - b.order)
        
        // Fetch subject counts for each branch
        const branchesWithCounts = await Promise.all(
          sortedBranches.map(async (branch: Branch) => {
            try {
              const subjectsResponse = await fetch(`/api/admin/branches/${branch.id}/subjects`)
              const subjectsData = await subjectsResponse.json()
              return {
                ...branch,
                subjectCount: subjectsData.success ? subjectsData.subjects.length : 0
              }
            } catch (error) {
              console.error(`Error fetching subjects for branch ${branch.id}:`, error)
              return { ...branch, subjectCount: 0 }
            }
          })
        )
        
        setBranches(branchesWithCounts)
      } else {
        throw new Error(data.error || 'Failed to fetch branches')
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeBranches = filteredBranches.filter(branch => branch.isActive)
  const inactiveBranches = filteredBranches.filter(branch => !branch.isActive)

  const handleToggleActive = async (branchId: string) => {
    try {
      const branch = branches.find(b => b.id === branchId)
      const newStatus = !branch?.isActive
      
      const response = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: branchId, 
          isActive: newStatus
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setBranches(prev => prev.map(branch => 
          branch.id === branchId 
            ? { ...branch, isActive: newStatus }
            : branch
        ))
        
        toast.success(`Branch ${newStatus ? 'activated' : 'deactivated'} successfully!`, {
          duration: 3000,
          position: 'top-right',
        })
      } else {
        toast.error(data.error || 'Failed to update branch', {
          duration: 4000,
          position: 'top-right',
        })
        console.error('Failed to update branch:', data.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred', {
        duration: 4000,
        position: 'top-right',
      })
      console.error('Error updating branch:', error)
    }
  }

  const handleDelete = async (branchId: string, permanent = false) => {
    const branch = branches.find(b => b.id === branchId)
    
    if (!permanent) {
      // First step: Deactivate
      if (confirm('Are you sure you want to deactivate this branch? It will be hidden from students but can be reactivated later.')) {
        try {
          const response = await fetch(`/api/admin/branches?id=${branchId}`, {
            method: 'DELETE',
          })

          const data = await response.json()
          if (data.success) {
            // Update local state
            setBranches(prev => prev.map(branch => 
              branch.id === branchId 
                ? { ...branch, isActive: false }
                : branch
            ))
            
            toast.success('Branch deactivated successfully!', {
              duration: 3000,
              position: 'top-right',
            })
          } else {
            toast.error(data.error || 'Failed to deactivate branch', {
              duration: 4000,
              position: 'top-right',
            })
            console.error('Failed to deactivate branch:', data.error)
          }
        } catch (error) {
          toast.error('An unexpected error occurred', {
            duration: 4000,
            position: 'top-right',
          })
          console.error('Error deactivating branch:', error)
        }
      }
    } else {
      // Second step: Permanent deletion
      if (confirm(`Are you sure you want to PERMANENTLY DELETE "${branch?.name}"? This action cannot be undone and all associated data will be lost.`)) {
        try {
          const response = await fetch(`/api/admin/branches?id=${branchId}&permanent=true`, {
            method: 'DELETE',
          })

          const data = await response.json()
          if (data.success) {
            // Remove from local state completely
            setBranches(prev => prev.filter(branch => branch.id !== branchId))
            
            toast.success('Branch permanently deleted!', {
              duration: 3000,
              position: 'top-right',
            })
          } else {
            toast.error(data.error || 'Failed to permanently delete branch', {
              duration: 4000,
              position: 'top-right',
            })
            console.error('Failed to permanently delete branch:', data.error)
          }
        } catch (error) {
          toast.error('An unexpected error occurred', {
            duration: 4000,
            position: 'top-right',
          })
          console.error('Error permanently deleting branch:', error)
        }
      }
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

      {/* Info Banner */}
      {inactiveBranches.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-amber-600 mt-0.5">ℹ️</div>
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Branch Deletion Process</p>
              <p className="text-amber-700">
                Inactive branches can be permanently deleted. Once permanently deleted, all associated data will be lost and cannot be recovered.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Branches */}
      {activeBranches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Active Branches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBranches.map((branch) => (
              <Card key={branch.id} className="transition-all duration-200 hover:shadow-lg">
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
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{branch.description}</p>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link href={`/admin/branches/${branch.id}/subjects`}>
                      <Button variant="default" size="sm" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Subjects ({branch.subjectCount || 0})
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(branch.id)}
                      >
                        Deactivate
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
                        onClick={() => handleDelete(branch.id, false)}
                        className="text-red-600 hover:text-red-700"
                        title="Deactivate branch"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Branches */}
      {inactiveBranches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Inactive Branches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveBranches.map((branch) => (
              <Card key={branch.id} className="transition-all duration-200 hover:shadow-lg opacity-60 border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${branch.color} flex items-center justify-center text-white text-xl opacity-70`}>
                        {branch.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-600">{branch.name}</CardTitle>
                        <p className="text-sm text-gray-400 font-mono">{branch.code}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500">{branch.description}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(branch.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Reactivate
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/branches/${branch.id}/edit`}>
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(branch.id, true)}
                        className="text-red-800 hover:text-red-900 border-red-200 hover:border-red-300"
                        title="Permanently delete branch"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-1 text-xs">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredBranches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
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
