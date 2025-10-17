'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { RxChevronRight } from "react-icons/rx"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'

interface EventImage {
  src: string
  alt: string
}

interface EventDate {
  weekday: string
  day: string
  monthYear: string
}

interface FeaturedEvent {
  url: string
  image: EventImage
  date: EventDate
  category: string
  title: string
  location: string
  description: string
}

interface EventSectionProps {
  className?: string
}

export const EventSection = ({ className }: EventSectionProps) => {
  const [events, setEvents] = useState<FeaturedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/admin/events?showInHomePage=true')
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        const formattedEvents = (data.events || [])
          .slice(0, 3)
          .map((event: any) => ({
            url: `/events/${event.slug}`,
            image: {
              src: event.imageUrl || '/placeholder-event.jpg',
              alt: event.title,
            },
            date: {
              weekday: format(new Date(event.eventDate), 'EEE'),
              day: format(new Date(event.eventDate), 'dd'),
              monthYear: format(new Date(event.eventDate), 'MMM yyyy'),
            },
            category: event.type,
            title: event.title,
            location: event.location,
            description: event.description,
          }))

        setEvents(formattedEvents)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className={cn("py-16 md:py-24 lg:py-28", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-muted-foreground">Loading events...</div>
        </div>
      </section>
    )
  }

  if (error || events.length === 0) {
    return null
  }

  return (
    <section className={cn("py-16 md:py-24 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold text-primary">Upcoming Events</h4>
            <h2 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">
              Events
            </h2>
            <p className="mt-5 text-base text-muted-foreground md:mt-6 md:text-md">
              Join us for exciting events, workshops, and learning opportunities.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={`${event.url}-${index}`} {...event} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/events">View all events</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

const EventCard: React.FC<FeaturedEvent> = ({
  url,
  image,
  date,
  category,
  title,
  location,
  description,
}) => {
  return (
    <div className="flex flex-col items-start">
      {/* Event Image with Date Badge */}
      <a 
        href={url} 
        className="relative mb-5 block aspect-[3/2] w-full overflow-hidden rounded-lg md:mb-6 group"
      >
        <img 
          src={image.src} 
          alt={image.alt} 
          className="absolute size-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        {/* Date Badge */}
        <div className="absolute right-4 top-4 flex min-w-28 flex-col items-center bg-white dark:bg-gray-900 px-1 py-3 text-sm shadow-lg rounded-md">
          <span className="text-muted-foreground">{date.weekday}</span>
          <span className="text-2xl font-bold md:text-3xl lg:text-4xl">{date.day}</span>
          <span className="text-muted-foreground text-xs">{date.monthYear}</span>
        </div>
      </a>

      {/* Category Badge */}
      <span className="mb-3 bg-secondary px-2 py-1 text-sm font-semibold rounded-md md:mb-4">
        {category}
      </span>

      {/* Event Title */}
      <a href={url} className="group">
        <h3 className="text-xl font-bold md:text-2xl group-hover:text-primary transition-colors">
          {title}
        </h3>
      </a>

      {/* Location */}
      <p className="mb-2 text-sm text-muted-foreground">{location}</p>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

      {/* View Event Link */}
      <Button variant="link" size="sm" className="mt-5 p-0 h-auto md:mt-6" asChild>
        <a href={url} className="flex items-center gap-1">
          View event
          <RxChevronRight className="size-4" />
        </a>
      </Button>
    </div>
  )
}
