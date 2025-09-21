'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const branchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
  code: z.string().min(2, 'Branch code must be at least 2 characters').max(10, 'Branch code must be less than 10 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
})

type BranchForm = z.infer<typeof branchSchema>

const colorOptions = [
  { name: 'Blue', value: 'from-blue-500 to-cyan-600', preview: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
  { name: 'Green', value: 'from-green-500 to-emerald-600', preview: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  { name: 'Purple', value: 'from-purple-500 to-violet-600', preview: 'bg-gradient-to-r from-purple-500 to-violet-600' },
  { name: 'Orange', value: 'from-orange-500 to-red-600', preview: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { name: 'Cyan', value: 'from-cyan-500 to-teal-600', preview: 'bg-gradient-to-r from-cyan-500 to-teal-600' },
  { name: 'Yellow', value: 'from-yellow-500 to-orange-600', preview: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
  { name: 'Pink', value: 'from-pink-500 to-rose-600', preview: 'bg-gradient-to-r from-pink-500 to-rose-600' },
  { name: 'Indigo', value: 'from-indigo-500 to-purple-600', preview: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
]

const iconOptions = [
  '💻', '🌐', '📡', '⚙️', '⚡', '🏗️', '🔬', '🧪', '🎨', '📊', '🎯', '🚀'
]

export default function NewBranchPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BranchForm>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      isActive: true,
      color: 'from-blue-500 to-cyan-600',
      icon: '💻'
    }
  })

  const watchedValues = watch()

  const onSubmit: SubmitHandler<BranchForm> = async (data) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Branch created successfully!', {
          duration: 3000,
          position: 'top-right',
        })
        setTimeout(() => {
          router.push('/admin/branches')
        }, 1500)
      } else {
        toast.error(result.error || 'Failed to create branch', {
          duration: 4000,
          position: 'top-right',
        })
        setError(result.error || 'Failed to create branch')
      }
    } catch (error) {
      console.error('Error creating branch:', error)
      const errorMessage = 'An unexpected error occurred'
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      })
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Branch</h1>
          <p className="text-gray-600 mt-2">Create a new engineering branch for your institution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Branch Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  placeholder="Computer Science Engineering"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Branch Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Branch Code</Label>
                <Input
                  id="code"
                  placeholder="CSE"
                  className="uppercase"
                  {...register('code')}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase()
                    register('code').onChange(e)
                  }}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the branch and what students will learn..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Icon Selection */}
              <div className="space-y-2">
                <Label>Branch Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-colors ${
                        watchedValues.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setValue('icon', icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label>Branch Color</Label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`relative h-12 rounded-lg ${color.preview} transition-all ${
                        watchedValues.color === color.value
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                          : 'hover:scale-105'
                      }`}
                      onClick={() => setValue('color', color.value)}
                    >
                      {watchedValues.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Branch Status</Label>
                  <p className="text-sm text-gray-500">
                    Active branches are visible to students
                  </p>
                </div>
                <Switch
                  checked={watchedValues.isActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Branch
                    </>
                  )}
                </Button>
                <Link href="/admin/branches">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                This is how your branch will appear to students:
              </p>
              
              {/* Branch Card Preview */}
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg">
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${watchedValues.color || 'from-blue-500 to-cyan-600'} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                      {watchedValues.icon || '💻'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {watchedValues.name || 'Branch Name'}
                      </h3>
                      <p className="text-white/80 font-mono text-sm">
                        {watchedValues.code || 'CODE'}
                      </p>
                      <p className="text-white/70 text-sm mt-2">
                        {watchedValues.description || 'Branch description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    watchedValues.isActive ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {watchedValues.isActive ? 'Active (Visible to students)' : 'Inactive (Hidden)'}
                  </span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="text-xs text-gray-500 space-y-2">
                <h4 className="font-medium text-gray-700">Guidelines:</h4>
                <ul className="space-y-1">
                  <li>• Use descriptive branch names (e.g., &quot;Computer Science Engineering&quot;)</li>
                  <li>• Keep codes short and meaningful (e.g., &quot;CSE&quot;, &quot;ECE&quot;)</li>
                  <li>• Write clear descriptions for students</li>
                  <li>• Choose colors that reflect the branch identity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
