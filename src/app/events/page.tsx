'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RxChevronRight } from "react-icons/rx"
import { Calendar, MapPin, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Navbar14 } from '@/components/Navbar14'
import { Footer4 } from '@/components/Footer4'
import { format } from 'date-fns'

type ImageProps = {
  src: string
  alt?: string
}

type DateInfo = {
  weekday: string
  day: string
  monthYear: string
}

type Event = {
  id: string
  image: ImageProps
  date: DateInfo
  category: string
  title: string
  location: string
  description: string
}

// Sample events data - replace with API call later
const allEvents: Event[] = [
  {
    id: "1",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Workshop event",
    },
    date: {
      weekday: "Fri",
      day: "09",
      monthYear: "Feb 2024",
    },
    category: "Workshop",
    title: "Full Stack Web Development Workshop",
    location: "Online Event",
    description: "Learn modern web development with Next.js, React, and TypeScript. Build real-world projects and deploy them.",
  },
  {
    id: "2",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Seminar event",
    },
    date: {
      weekday: "Sat",
      day: "10",
      monthYear: "Feb 2024",
    },
    category: "Seminar",
    title: "Career Guidance for Engineering Students",
    location: "Main Campus, Hall A",
    description: "Industry experts share insights on career paths, interview preparation, and skill development for engineering graduates.",
  },
  {
    id: "3",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Webinar event",
    },
    date: {
      weekday: "Sun",
      day: "11",
      monthYear: "Feb 2024",
    },
    category: "Webinar",
    title: "AI and Machine Learning Fundamentals",
    location: "Virtual Event",
    description: "Explore the basics of artificial intelligence and machine learning with practical examples and use cases.",
  },
  {
    id: "4",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Workshop event",
    },
    date: {
      weekday: "Mon",
      day: "12",
      monthYear: "Feb 2024",
    },
    category: "Workshop",
    title: "Mobile App Development with React Native",
    location: "Online Event",
    description: "Build cross-platform mobile applications using React Native. Learn iOS and Android development together.",
  },
  {
    id: "5",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Conference event",
    },
    date: {
      weekday: "Tue",
      day: "13",
      monthYear: "Feb 2024",
    },
    category: "Conference",
    title: "Tech Innovation Summit 2024",
    location: "Convention Center",
    description: "Join industry leaders and innovators discussing the future of technology and digital transformation.",
  },
  {
    id: "6",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Webinar event",
    },
    date: {
      weekday: "Wed",
      day: "14",
      monthYear: "Feb 2024",
    },
    category: "Webinar",
    title: "Cloud Computing and DevOps Essentials",
    location: "Virtual Event",
    description: "Master cloud platforms like AWS, Azure, and learn DevOps practices for modern software development.",
  },
  {
    id: "7",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Seminar event",
    },
    date: {
      weekday: "Thu",
      day: "15",
      monthYear: "Feb 2024",
    },
    category: "Seminar",
    title: "Data Science and Analytics Workshop",
    location: "Tech Park Campus",
    description: "Learn data analysis, visualization, and machine learning techniques for real-world business problems.",
  },
  {
    id: "8",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Workshop event",
    },
    date: {
      weekday: "Fri",
      day: "16",
      monthYear: "Feb 2024",
    },
    category: "Workshop",
    title: "Cybersecurity Fundamentals",
    location: "Online Event",
    description: "Understanding security threats, best practices, and tools to protect digital assets and infrastructure.",
  },
  {
    id: "9",
    image: {
      src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
      alt: "Conference event",
    },
    date: {
      weekday: "Sat",
      day: "17",
      monthYear: "Feb 2024",
    },
    category: "Conference",
    title: "Blockchain and Web3 Summit",
    location: "Innovation Hub",
    description: "Explore blockchain technology, cryptocurrencies, and the decentralized web with industry pioneers.",
  },
]

const categories = ["All", "Workshop", "Seminar", "Webinar", "Conference", "Hackathon", "Meetup"]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all published events from API
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const events = data.events.map((event: any) => ({
          id: event.slug || event.id,
          image: {
            src: event.imageUrl || '/placeholder-event.jpg',
            alt: event.title,
          },
          date: {
            weekday: format(new Date(event.eventDate), 'EEE'),
            day: format(new Date(event.eventDate), 'dd'),
            monthYear: format(new Date(event.eventDate), 'MMM yyyy'),
          },
          category: event.type, // Using 'type' as category
          title: event.title,
          location: event.location,
          description: event.description,
        }))
        setAllEvents(events)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching events:', error)
        setLoading(false)
      })
  }, [])

  // Filter events based on category and search
  const filteredEvents = allEvents.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar14 />
      
      {/* Navbar Spacer */}
      <div className="h-24 md:h-28" aria-hidden="true" />

      {/* Page Content */}
      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4 text-primary border-primary/20">
                <Calendar className="w-3 h-3 mr-2" />
                Upcoming Events
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                All Events
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Join us for exciting workshops, seminars, webinars, and conferences. 
                Enhance your skills and network with industry professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSearchQuery("")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-transparent to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't Miss Out on Future Events
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified about upcoming events, workshops, and exclusive learning opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button size="lg" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer4 />
    </div>
  )
}

const EventCard: React.FC<Event> = ({
  id,
  image,
  date,
  category,
  title,
  location,
  description,
}) => {
  const eventUrl = `/events/${id}`
  
  return (
    <div className="flex flex-col items-start">
      {/* Event Image with Date Badge */}
      <a 
        href={eventUrl} 
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
      <a href={eventUrl} className="group">
        <h3 className="text-xl font-bold md:text-2xl group-hover:text-primary transition-colors">
          {title}
        </h3>
      </a>

      {/* Location */}
      <p className="mb-2 text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {location}
      </p>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>

      {/* View Event Link */}
      <Button variant="link" size="sm" className="mt-auto p-0 h-auto" asChild>
        <a href={eventUrl} className="flex items-center gap-1">
          View event
          <RxChevronRight className="size-4" />
        </a>
      </Button>
    </div>
  )
}
