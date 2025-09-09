'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const colorOptions = [
  { name: 'Blue', value: 'from-blue-500 to-cyan-600' },
  { name: 'Cyan', value: 'from-cyan-500 to-teal-600' },
  { name: 'Purple', value: 'from-purple-500 to-violet-600' },
  { name: 'Orange', value: 'from-orange-500 to-red-600' },
  { name: 'Yellow', value: 'from-yellow-500 to-orange-600' },
  { name: 'Green', value: 'from-emerald-500 to-green-600' },
  { name: 'Pink', value: 'from-pink-500 to-rose-600' },
  { name: 'Indigo', value: 'from-indigo-500 to-purple-600' },
]

const iconOptions = ['💻', '🌐', '📡', '⚙️', '⚡', '🏗️', '🔬', '🎯', '🚀', '💡']

interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon: string
  color: string
  order: number
  isActive: boolean
}

export default function EditBranchPage() {
  const router = useRouter()
  const params = useParams()
  const branchId = params.id as string

  const [branch, setBranch] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    icon: '💻',
    color: 'from-blue-500 to-cyan-600',
    isActive: true
  })

  useEffect(() => {
    fetchBranch()
  }, [branchId])

  const fetchBranch = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/branches')
      if (!response.ok) {
        throw new Error('Failed to fetch branches')
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch branches')
      }
      
      const currentBranch = data.branches.find((b: Branch) => b.id === branchId)
      
      if (!currentBranch) {
        throw new Error('Branch not found')
      }

      setBranch(currentBranch)
      setFormData({
        name: currentBranch.name,
        code: currentBranch.code,
        description: currentBranch.description,
        icon: currentBranch.icon,
        color: currentBranch.color,
        isActive: currentBranch.isActive
      })
    } catch (error) {
      console.error('Failed to fetch branch:', error)
      setError('Failed to load branch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: branchId,
          ...formData
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update branch')
      }

      toast.success('Branch updated successfully!', {
        duration: 3000,
        position: 'top-right',
      })
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/branches')
      }, 1500)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update branch'
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      })
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Branch not found</AlertDescription>
        </Alert>
        <Link href="/admin/branches">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
        </Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Branch</h1>
          <p className="text-gray-600 mt-2">Update branch information and settings</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Computer Science Engineering"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Branch Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g., CSE"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the branch..."
                rows={3}
              />
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleInputChange('icon', icon)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-colors ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange('color', color.value)}
                      className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                        formData.color === color.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded bg-gradient-to-r ${color.value}`}></div>
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('isActive', true)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.isActive
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('isActive', false)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    !formData.isActive
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${formData.color} flex items-center justify-center text-white text-xl`}>
                  {formData.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name || 'Branch Name'}</h3>
                  <p className="text-sm text-gray-500 font-mono">{formData.code || 'CODE'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/branches">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Branch
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
