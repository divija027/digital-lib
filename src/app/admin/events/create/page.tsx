'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MarkdownEditorWithImages } from '@/components/ui/markdown-editor-with-images'
import { useAdminEvents } from '@/hooks/useAdminEvents'
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { combineDateAndTime, formatTimeRange } from '@/lib/datetime-utils'

export default function CreateEventPage() {
  const router = useRouter()
  const { createEvent, loading } = useAdminEvents()
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    eventDate: '',
    eventTime: '',
    eventEndTime: '',
    isTimeRange: false,
    location: '',
    type: 'Workshop',
    category: 'Technology',
    duration: '1 hour',
    price: 'Free',
    registrationLink: '',
    featured: false,
    published: false,
    showInHomePage: false,
    seoTitle: '',
    seoDescription: '',
    schedule: [] as Array<{ time: string; title: string; description: string }>,
    speakers: [] as Array<{ name: string; designation: string; company: string; bio: string }>,
  })

  const [featuredFile, setFeaturedFile] = useState<File | null>(null)
  const [featuredPreview, setFeaturedPreview] = useState<string>('')
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [uploadingBanner, setUploadingBanner] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setFeaturedFile(file)
      setFeaturedPreview(URL.createObjectURL(file))
    }
  }

  const removeFeatured = () => {
    setFeaturedFile(null)
    setFeaturedPreview('')
  }

  const uploadFeatured = async (eventId: string): Promise<string | null> => {
    if (!featuredFile) return null

    try {
      setUploadingFeatured(true)
      const formData = new FormData()
      formData.append('featured', featuredFile)

      const response = await fetch(`/api/admin/events/${eventId}/featured`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.imageUrl
      } else {
        alert('Failed to upload featured image')
        return null
      }
    } catch (error) {
      console.error('Error uploading featured image:', error)
      alert('Failed to upload featured image')
      return null
    } finally {
      setUploadingFeatured(false)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const removeBanner = () => {
    setBannerFile(null)
    setBannerPreview('')
  }

  const uploadBanner = async (eventId: string): Promise<string | null> => {
    if (!bannerFile) return null

    try {
      setUploadingBanner(true)
      const formData = new FormData()
      formData.append('banner', bannerFile)

      const response = await fetch(`/api/admin/events/${eventId}/banner`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.bannerUrl
      } else {
        alert('Failed to upload banner')
        return null
      }
    } catch (error) {
      console.error('Error uploading banner:', error)
      alert('Failed to upload banner')
      return null
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.description || !formData.content || 
        !formData.eventDate || !formData.eventTime || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    // Validate time range if enabled
    if (formData.isTimeRange) {
      if (!formData.eventEndTime) {
        alert('Please select an end time for the time range')
        return
      }
      if (formData.eventEndTime <= formData.eventTime) {
        alert('End time must be after start time')
        return
      }
    }

    // Check if trying to add to home page and if limit reached
    if (formData.showInHomePage) {
      try {
        const response = await fetch('/api/admin/events?showInHomePage=true')
        const data = await response.json()
        const homePageEventsCount = data.events?.length || 0
        
        if (homePageEventsCount >= 3) {
          alert('Maximum 3 events can be shown on the home page. Please unmark another event first.')
          return
        }
      } catch (error) {
        console.error('Error checking home page events:', error)
      }
    }

    try {
      // Combine date and time into ISO format
      const eventDateTime = combineDateAndTime(formData.eventDate, formData.eventTime)
      
      // Format duration based on time range setting
      const formattedDuration = formData.isTimeRange && formData.eventEndTime
        ? formatTimeRange(formData.eventTime, formData.eventEndTime)
        : ''
      
      // Prepare event data without the separate time fields
      const { eventTime, eventEndTime, isTimeRange, ...restFormData } = formData
      
      // Create event first
      const eventData = {
        ...restFormData,
        eventDate: eventDateTime,
        duration: formattedDuration,
        imageUrl: formData.imageUrl || '/placeholder-event.jpg',
        published: true, // Auto-publish events since we removed the publish toggle
        countdownIsoDate: eventDateTime // Automatically use event date for countdown
      }
      
      const createdEvent = await createEvent(eventData as any)
      
      // Upload featured image if selected
      if (featuredFile && createdEvent?.id) {
        await uploadFeatured(createdEvent.id)
      }
      
      // Upload banner if selected
      if (bannerFile && createdEvent?.id) {
        await uploadBanner(createdEvent.id)
      }
      
      alert('Event created successfully!')
      router.push('/admin/events')
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  // Prevent form submission on Enter key in inputs (except textareas and buttons)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' && target.tagName !== 'BUTTON' && target.tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Full Stack Web Development Workshop"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="full-stack-web-development-workshop"
                required
              />
              <p className="text-sm text-gray-500 mt-1">URL: /events/{formData.slug}</p>
            </div>

            <div>
              <Label htmlFor="description">Short Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description for event cards"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image *</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              This image will be displayed in event cards on the home page and event listings
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!featuredPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center gap-4">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Upload featured image for event cards</p>
                    <p className="text-xs text-gray-500">Recommended: 800x600px (4:3 ratio), Max: 5MB</p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedChange}
                    className="max-w-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={featuredPreview}
                    alt="Featured image preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeFeatured}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Featured Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banner Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Image (Optional)</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              This image will be displayed in the header of the event detail page
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!bannerPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center gap-4">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Upload banner image for event detail page header</p>
                    <p className="text-xs text-gray-500">Recommended: 1920x600px (wide banner), Max: 5MB</p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="max-w-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeBanner}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Banner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Time Range Toggle */}
            <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
              <Switch
                checked={formData.isTimeRange}
                onCheckedChange={(checked) => {
                  handleChange('isTimeRange', checked)
                  if (!checked) {
                    handleChange('eventEndTime', '')
                  }
                }}
              />
              <div>
                <Label className="text-sm font-semibold">Time Range</Label>
                <p className="text-xs text-muted-foreground">
                  Enable to set a time range (e.g., 2:00 PM - 5:00 PM)
                </p>
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventTime">
                  {formData.isTimeRange ? 'Start Time *' : 'Event Time *'}
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleChange('eventTime', e.target.value)}
                  required
                />
              </div>

              {formData.isTimeRange && (
                <div>
                  <Label htmlFor="eventEndTime">End Time *</Label>
                  <Input
                    id="eventEndTime"
                    type="time"
                    value={formData.eventEndTime}
                    onChange={(e) => handleChange('eventEndTime', e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Online Event"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Event Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Webinar</option>
                  <option>Conference</option>
                  <option>Hackathon</option>
                  <option>Meetup</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Career</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="Free"
              />
            </div>

            <div>
              <Label htmlFor="registrationLink">Registration Link (Optional)</Label>
              <Input
                id="registrationLink"
                type="url"
                value={formData.registrationLink}
                onChange={(e) => handleChange('registrationLink', e.target.value)}
                placeholder="https://example.com/register"
              />
              <p className="text-xs text-gray-500 mt-1">
                External link for event registration. If provided, "Register Now" button will redirect to this link.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Event Schedule</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Add schedule items to display the event timeline
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.schedule.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Schedule Item #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newSchedule = formData.schedule.filter((_, i) => i !== index)
                      handleChange('schedule', newSchedule)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Time</Label>
                    <Input
                      value={item.time}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule]
                        newSchedule[index].time = e.target.value
                        handleChange('schedule', newSchedule)
                      }}
                      placeholder="2:00 PM"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule]
                        newSchedule[index].title = e.target.value
                        handleChange('schedule', newSchedule)
                      }}
                      placeholder="Registration & Setup"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => {
                      const newSchedule = [...formData.schedule]
                      newSchedule[index].description = e.target.value
                      handleChange('schedule', newSchedule)
                    }}
                    placeholder="Get your development environment ready"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                handleChange('schedule', [
                  ...formData.schedule,
                  { time: '', title: '', description: '' }
                ])
              }}
            >
              Add Schedule Item
            </Button>
          </CardContent>
        </Card>

        {/* Event Speakers */}
        <Card>
          <CardHeader>
            <CardTitle>Event Speakers</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Add speakers/presenters for this event
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.speakers.map((speaker, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Speaker #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newSpeakers = formData.speakers.filter((_, i) => i !== index)
                      handleChange('speakers', newSpeakers)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name <span className="text-red-500">*</span></Label>
                    <Input
                      value={speaker.name}
                      onChange={(e) => {
                        const newSpeakers = [...formData.speakers]
                        newSpeakers[index].name = e.target.value
                        handleChange('speakers', newSpeakers)
                      }}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label>Designation <span className="text-red-500">*</span></Label>
                    <Input
                      value={speaker.designation}
                      onChange={(e) => {
                        const newSpeakers = [...formData.speakers]
                        newSpeakers[index].designation = e.target.value
                        handleChange('speakers', newSpeakers)
                      }}
                      placeholder="CEO"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={speaker.company}
                    onChange={(e) => {
                      const newSpeakers = [...formData.speakers]
                      newSpeakers[index].company = e.target.value
                      handleChange('speakers', newSpeakers)
                    }}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label>Bio <span className="text-red-500">*</span></Label>
                  <Input
                    value={speaker.bio}
                    onChange={(e) => {
                      const newSpeakers = [...formData.speakers]
                      newSpeakers[index].bio = e.target.value
                      handleChange('speakers', newSpeakers)
                    }}
                    placeholder="Brief bio about the speaker..."
                    required
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                handleChange('speakers', [
                  ...formData.speakers,
                  { name: '', designation: '', company: '', bio: '' }
                ])
              }}
            >
              Add Speaker
            </Button>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Event Content (Markdown)</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditorWithImages
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Write about the event details, what attendees will learn, schedule, prerequisites, etc..."
            />
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                placeholder="Leave empty to use event title"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Input
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                placeholder="Leave empty to use short description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="showInHomePage" className="text-base">Show in Home Page</Label>
                <p className="text-sm text-gray-500">
                  Display this event in the home page events section (max 3 events)
                </p>
              </div>
              <Switch
                id="showInHomePage"
                checked={formData.showInHomePage}
                onCheckedChange={(checked) => handleChange('showInHomePage', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  )
}
