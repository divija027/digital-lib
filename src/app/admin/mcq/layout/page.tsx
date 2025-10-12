'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Grid3x3,
  Image as ImageIcon,
  X,
  Eye,
  Upload,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MCQSetData {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  bannerImage?: string
  questions: number
  attempts: number
  averageScore: number
}

interface LayoutSlot {
  position: number
  type: 'small' | 'big'
  mcqSet?: MCQSetData
}

export default function MCQLayoutManagerPage() {
  const router = useRouter()
  const [layout, setLayout] = useState<LayoutSlot[]>([
    { position: 1, type: 'small' },
    { position: 2, type: 'small' },
    { position: 3, type: 'small' },
    { position: 4, type: 'small' },
    { position: 5, type: 'big' },
  ])
  const [availableMCQSets, setAvailableMCQSets] = useState<MCQSetData[]>([])
  const [uploadingImage, setUploadingImage] = useState<{ [key: number]: boolean }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [pendingChanges, setPendingChanges] = useState<{ [key: number]: string | null }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // File input refs for each position
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // Fetch current layout and available MCQ sets
  useEffect(() => {
    fetchLayoutData()
    fetchAvailableMCQSets()
  }, [])

  const fetchLayoutData = async () => {
    try {
      const response = await fetch('/api/admin/mcq/layout')
      if (response.ok) {
        const data = await response.json()
        if (data.layout) {
          setLayout(data.layout)
        }
      }
    } catch (error) {
      console.error('Failed to fetch layout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableMCQSets = async () => {
    try {
      const response = await fetch('/api/mcq/sets?status=ACTIVE')
      if (response.ok) {
        const data = await response.json()
        setAvailableMCQSets(data)
      }
    } catch (error) {
      console.error('Failed to fetch MCQ sets:', error)
    }
  }

  const handleSelectMCQSet = (position: number, mcqSetId: string) => {
    // Track pending change instead of saving immediately
    setPendingChanges(prev => ({
      ...prev,
      [position]: mcqSetId === 'none' ? null : mcqSetId
    }))
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    let successCount = 0
    let errorCount = 0

    try {
      // Process all pending changes
      for (const [positionStr, mcqSetId] of Object.entries(pendingChanges)) {
        const position = parseInt(positionStr)
        
        try {
          if (mcqSetId === null) {
            // Remove from slot
            const response = await fetch(`/api/admin/mcq/layout?position=${position}`, {
              method: 'DELETE',
            })
            if (response.ok) {
              successCount++
            } else {
              errorCount++
              console.error(`Failed to remove from position ${position}`)
            }
          } else {
            // Assign to slot
            const response = await fetch('/api/admin/mcq/layout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mcqSetId,
                position,
              }),
            })

            if (response.ok) {
              successCount++
            } else {
              const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
              console.error('API Error Response:', errorData)
              errorCount++
            }
          }
        } catch (error) {
          console.error(`Failed to update position ${position}:`, error)
          errorCount++
        }
      }

      // Refresh data after all changes
      await fetchLayoutData()
      await fetchAvailableMCQSets()

      // Clear pending changes
      setPendingChanges({})
      setHasUnsavedChanges(false)

      // Show result
      if (errorCount === 0) {
        alert(`Successfully saved ${successCount} change(s)!`)
      } else {
        alert(`Saved ${successCount} change(s), but ${errorCount} failed. Please check console for details.`)
      }
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    if (confirm('Are you sure you want to discard all unsaved changes?')) {
      setPendingChanges({})
      setHasUnsavedChanges(false)
      fetchLayoutData() // Refresh to show original state
    }
  }

  const handleRemoveFromSlot = async (position: number) => {
    try {
      const response = await fetch(`/api/admin/mcq/layout?position=${position}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchLayoutData()
        await fetchAvailableMCQSets()
      } else {
        alert('Failed to remove MCQ set from slot')
      }
    } catch (error) {
      console.error('Failed to remove from slot:', error)
      alert('Failed to remove from slot')
    }
  }

  const handleBannerUploadClick = (position: number) => {
    fileInputRefs.current[position]?.click()
  }

  const handleBannerUpload = async (position: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const slot = layout.find(s => s.position === position)
    
    if (!file || !slot?.mcqSet) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    try {
      setUploadingImage(prev => ({ ...prev, [position]: true }))
      const formData = new FormData()
      formData.append('banner', file)

      const response = await fetch(`/api/admin/mcq/sets/${slot.mcqSet.id}/banner`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        await fetchLayoutData()
        await fetchAvailableMCQSets()
        // Reset file input
        if (fileInputRefs.current[position]) {
          fileInputRefs.current[position]!.value = ''
        }
      } else {
        alert('Failed to upload banner')
      }
    } catch (error) {
      console.error('Failed to upload banner:', error)
      alert('Failed to upload banner')
    } finally {
      setUploadingImage(prev => ({ ...prev, [position]: false }))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAvailableSetsForPosition = (currentPosition: number) => {
    // Get sets that are already assigned to other positions (including pending changes)
    const assignedSetIds = layout
      .filter(slot => slot.position !== currentPosition && slot.mcqSet)
      .map(slot => slot.mcqSet!.id)
    
    // Also consider pending changes for other positions
    Object.entries(pendingChanges).forEach(([posStr, mcqSetId]) => {
      const pos = parseInt(posStr)
      if (pos !== currentPosition && mcqSetId && !assignedSetIds.includes(mcqSetId)) {
        assignedSetIds.push(mcqSetId)
      }
    })
    
    // Return sets that are not assigned to other positions
    return availableMCQSets.filter(set => !assignedSetIds.includes(set.id))
  }

  const getEffectiveValue = (position: number) => {
    // Check if there's a pending change for this position
    if (position in pendingChanges) {
      return pendingChanges[position] || 'none'
    }
    // Otherwise return the current assigned value
    const slot = layout.find(s => s.position === position)
    return slot?.mcqSet?.id || 'none'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading layout...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MCQ Home Layout Manager</h1>
          <p className="text-gray-600 mt-1">
            Select MCQ sets from dropdowns and upload banner images for each slot.
          </p>
          {hasUnsavedChanges && (
            <p className="text-amber-600 text-sm mt-2 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <>
              <Button
                variant="outline"
                onClick={handleDiscardChanges}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Discard Changes
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Home Page
          </Button>
        </div>
      </div>

      {/* Layout Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            Home Page Layout Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Small Cards (Positions 1-4) */}
            {layout.slice(0, 4).map((slot) => {
              const availableSets = getAvailableSetsForPosition(slot.position)
              
              return (
                <Card
                  key={slot.position}
                  className="border-2 border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Position Label */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Position {slot.position}
                        </Badge>
                        {slot.mcqSet && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveFromSlot(slot.position)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* MCQ Set Selector */}
                      <div>
                        <Select
                          value={getEffectiveValue(slot.position)}
                          onValueChange={(value) => handleSelectMCQSet(slot.position, value)}
                        >
                          <SelectTrigger className={`w-full ${slot.position in pendingChanges ? 'border-amber-500 bg-amber-50' : ''}`}>
                            <SelectValue placeholder="Select MCQ Set" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-- Select MCQ Set --</SelectItem>
                            {slot.mcqSet && (
                              <SelectItem value={slot.mcqSet.id}>
                                {slot.mcqSet.title}
                              </SelectItem>
                            )}
                            {availableSets.map((set) => (
                              <SelectItem key={set.id} value={set.id}>
                                {set.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {slot.position in pendingChanges && (
                          <p className="text-xs text-amber-600 mt-1">Pending change - click "Save Changes"</p>
                        )}
                      </div>

                      {/* Show MCQ set info if one exists (saved) OR if there's a pending selection */}
                      {slot.mcqSet || (slot.position in pendingChanges && pendingChanges[slot.position]) ? (
                        <>
                          {/* Banner Image */}
                          <div className="relative h-32 bg-gray-200 rounded overflow-hidden">
                            {slot.mcqSet?.bannerImage ? (
                              <img
                                src={slot.mcqSet.bannerImage}
                                alt={slot.mcqSet.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          {/* Upload Banner Button - Only show if there's a SAVED MCQ set (not just pending) */}
                          {slot.mcqSet && !(slot.position in pendingChanges) ? (
                            <>
                              <input
                                ref={(el) => {
                                  fileInputRefs.current[slot.position] = el
                                }}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerUpload(slot.position, e)}
                                className="hidden"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleBannerUploadClick(slot.position)}
                                disabled={uploadingImage[slot.position]}
                              >
                                <Upload className="h-3 w-3 mr-2" />
                                {uploadingImage[slot.position]
                                  ? 'Uploading...'
                                  : slot.mcqSet.bannerImage
                                  ? 'Change Banner'
                                  : 'Upload Banner'}
                              </Button>
                            </>
                          ) : (
                            <div className="text-xs text-amber-600 text-center p-2 bg-amber-50 rounded border border-amber-200">
                              {slot.mcqSet ? 'Save changes first to upload banner' : 'Save your selection first, then upload banner'}
                            </div>
                          )}

                          {/* MCQ Set Info - Only show if saved */}
                          {slot.mcqSet && (
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {slot.mcqSet.category}
                              </Badge>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {slot.mcqSet.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>📝 {slot.mcqSet.questions}Q</span>
                                <span>•</span>
                                <span>📊 {slot.mcqSet.averageScore}%</span>
                              </div>
                              <Badge className={getDifficultyColor(slot.mcqSet.difficulty)}>
                                {slot.mcqSet.difficulty}
                              </Badge>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded">
                          <ImageIcon className="w-12 h-12 mb-2" />
                          <p className="text-xs">Select an MCQ set above</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Big Card (Position 5) */}
            {layout.slice(4, 5).map((slot) => {
              const availableSets = getAvailableSetsForPosition(slot.position)
              
              return (
                <Card
                  key={slot.position}
                  className="md:col-span-2 lg:row-span-2 border-2 border-gray-200"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Position Label */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          Position {slot.position} - Featured
                        </Badge>
                        {slot.mcqSet && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveFromSlot(slot.position)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>

                      {/* MCQ Set Selector */}
                      <div>
                        <Select
                          value={getEffectiveValue(slot.position)}
                          onValueChange={(value) => handleSelectMCQSet(slot.position, value)}
                        >
                          <SelectTrigger className={`w-full ${slot.position in pendingChanges ? 'border-amber-500 bg-amber-50' : ''}`}>
                            <SelectValue placeholder="Select Featured MCQ Set" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-- Select MCQ Set --</SelectItem>
                            {slot.mcqSet && (
                              <SelectItem value={slot.mcqSet.id}>
                                {slot.mcqSet.title}
                              </SelectItem>
                            )}
                            {availableSets.map((set) => (
                              <SelectItem key={set.id} value={set.id}>
                                {set.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {slot.position in pendingChanges && (
                          <p className="text-xs text-amber-600 mt-1">Pending change - click "Save Changes"</p>
                        )}
                      </div>

                      {/* Show MCQ set info if one exists (saved) OR if there's a pending selection */}
                      {slot.mcqSet || (slot.position in pendingChanges && pendingChanges[slot.position]) ? (
                        <>
                          {/* Banner Image */}
                          <div className="relative h-48 bg-gray-200 rounded overflow-hidden">
                            {slot.mcqSet?.bannerImage ? (
                              <img
                                src={slot.mcqSet.bannerImage}
                                alt={slot.mcqSet.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <ImageIcon className="w-12 h-12" />
                              </div>
                            )}
                          </div>

                          {/* Upload Banner Button - Only show if there's a SAVED MCQ set (not just pending) */}
                          {slot.mcqSet && !(slot.position in pendingChanges) ? (
                            <>
                              <input
                                ref={(el) => {
                                  fileInputRefs.current[slot.position] = el
                                }}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerUpload(slot.position, e)}
                                className="hidden"
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleBannerUploadClick(slot.position)}
                                disabled={uploadingImage[slot.position]}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadingImage[slot.position]
                                  ? 'Uploading...'
                                  : slot.mcqSet.bannerImage
                                  ? 'Change Banner Image'
                                  : 'Upload Banner Image'}
                              </Button>
                            </>
                          ) : (
                            <div className="text-sm text-amber-600 text-center p-3 bg-amber-50 rounded border border-amber-200">
                              💡 {slot.mcqSet ? 'Save changes first to upload banner' : 'Save your selection first, then upload banner'}
                            </div>
                          )}

                          {/* MCQ Set Info - Only show if saved */}
                          {slot.mcqSet && (
                            <div className="space-y-3">
                              <Badge variant="outline">
                                Featured • {slot.mcqSet.category}
                              </Badge>
                              <h3 className="font-bold text-xl line-clamp-2">
                                {slot.mcqSet.title}
                              </h3>
                              <p className="text-gray-600 line-clamp-3">
                                {slot.mcqSet.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>📝 {slot.mcqSet.questions} Questions</span>
                                <span>•</span>
                                <span>👥 {slot.mcqSet.attempts} Attempts</span>
                                <span>•</span>
                                <span>📊 {slot.mcqSet.averageScore}% Avg Score</span>
                              </div>
                              <Badge className={getDifficultyColor(slot.mcqSet.difficulty)}>
                                {slot.mcqSet.difficulty}
                              </Badge>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded">
                          <ImageIcon className="w-16 h-16 mb-3" />
                          <p className="text-lg font-medium">Select a Featured MCQ Set</p>
                          <p className="text-sm">Choose from the dropdown above</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 How to use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Step 1:</strong> Select an MCQ set from the dropdown in each slot</li>
              <li>• <strong>Step 2:</strong> Click <strong>"Save Changes"</strong> button at the top to confirm your selections</li>
              <li>• <strong>Step 3:</strong> After saving, click "Upload Banner" to add custom images (1200x600px recommended)</li>
              <li>• <strong>Step 4:</strong> Preview your layout on the home page using the "Preview Home Page" button</li>
              <li>• Positions 1-4 are small cards, Position 5 is the large featured card</li>
              <li>• Each MCQ set can only be assigned to one position at a time</li>
              <li>• Banner images can only be uploaded after saving the MCQ set assignment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
