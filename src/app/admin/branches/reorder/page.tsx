'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Branch {
  id: string
  name: string
  code: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
}

export default function ReorderBranchesPage() {
  const router = useRouter()
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/admin/branches')
      if (!response.ok) {
        throw new Error('Failed to fetch branches')
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch branches')
      }
      
      // Sort by current order
      const sortedBranches = data.branches.sort((a: Branch, b: Branch) => a.order - b.order)
      setBranches(sortedBranches)
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      setError('Failed to load branches')
    } finally {
      setIsLoading(false)
    }
  }

  const moveBranch = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= branches.length) return

    const newBranches = [...branches]
    const [movedBranch] = newBranches.splice(fromIndex, 1)
    newBranches.splice(toIndex, 0, movedBranch)

    // Update order values
    const reorderedBranches = newBranches.map((branch, index) => ({
      ...branch,
      order: index + 1
    }))

    setBranches(reorderedBranches)
    setHasChanges(true)
  }

  const moveUp = (index: number) => {
    moveBranch(index, index - 1)
  }

  const moveDown = (index: number) => {
    moveBranch(index, index + 1)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')

    try {
      const orderData = branches.map(branch => ({
        id: branch.id,
        order: branch.order
      }))

      console.log('Sending reorder data:', orderData) // Debug log

      const response = await fetch('/api/admin/branches/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branches: orderData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update branch order')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to update branch order')
      }
      
      toast.success('Branch order updated successfully!', {
        duration: 3000,
        position: 'top-right',
      })
      setHasChanges(false)
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/branches')
      }, 1500)
      
    } catch (err) {
      console.error('Reorder error:', err) // Debug log
      const errorMessage = err instanceof Error ? err.message : 'Failed to update branch order'
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      })
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    fetchBranches()
    setHasChanges(false)
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
      <div className="flex items-center gap-4">
        <Link href="/admin/branches">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reorder Branches</h1>
          <p className="text-gray-600 mt-2">Drag to reorder or use the arrow buttons to change branch order</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {hasChanges ? (
            <span className="text-orange-600 font-medium">You have unsaved changes</span>
          ) : (
            <span>Current branch order is displayed below</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              Reset Changes
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Branch List */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Order</CardTitle>
          <p className="text-sm text-gray-600">
            This order will be reflected in the student dashboard and navigation
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {branches.map((branch, index) => (
              <div
                key={branch.id}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                  hasChanges ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'
                } hover:shadow-sm`}
              >
                {/* Drag Handle */}
                <div className="flex items-center text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Order Number */}
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {index + 1}
                </div>

                {/* Branch Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${branch.color} flex items-center justify-center text-white`}>
                    {branch.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{branch.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{branch.code}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="text-sm">
                  {branch.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-gray-500">Inactive</span>
                  )}
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-8 h-8 p-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(index)}
                    disabled={index === branches.length - 1}
                    className="w-8 h-8 p-0"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-3">Instructions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Use the arrow buttons to move branches up or down in the list</p>
            <p>• The order number shows the position each branch will appear in</p>
            <p>• Save your changes to apply the new order to the student dashboard</p>
            <p>• Only active branches will be visible to students</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
