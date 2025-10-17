import { useState } from 'react'

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  eventDate: string
  location: string
  speaker: string
  type: string
  category: string
  duration: string
  price: string
  registrationLink?: string | null
  countdownIsoDate?: string | null
  featured: boolean
  published: boolean
  archived: boolean
  showInHomePage: boolean
  views: number
  registrationClicks?: number
  uniqueRegistrationUsers?: string[]
  seoTitle?: string | null
  seoDescription?: string | null
  createdAt: string
  updatedAt: string
}

export function useAdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async (filters?: { featured?: boolean; published?: boolean }) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
      if (filters?.published !== undefined) params.append('published', String(filters.published))

      const res = await fetch(`/api/admin/events?${params}`)
      if (!res.ok) throw new Error('Failed to fetch events')
      
      const data = await res.json()
      setEvents(data.events)
      return data.events
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Partial<Event>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create event')
      }
      
      const data = await res.json()
      await fetchEvents()
      return data.event
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update event')
      }
      
      const data = await res.json()
      await fetchEvents()
      return data.event
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to delete event')
      
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      })
      
      if (!res.ok) throw new Error('Failed to toggle featured status')
      
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleArchived = async (id: string, archived: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived }),
      })
      
      if (!res.ok) throw new Error('Failed to toggle archive status')
      
      await fetchEvents()
      return await res.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleFeatured,
    toggleArchived,
  }
}
