'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Footer4 } from '@/components/Footer4'
import { EventItemHeader } from '@/components/EventItemHeader'
import { Calendar, MapPin, User, Tag, Clock, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toast } from '@/components/ui/toast-notification'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { extractDateTimeComponents, format12Hour, isTimeRange } from '@/lib/datetime-utils'
import { generateUserFingerprint } from '@/lib/user-fingerprint'

// Enhanced scroll-reveal hook with visible-by-default approach
function useScrollReveal() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    const elements = document.querySelectorAll('[data-scroll-reveal]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return visibleElements
}

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [headerAnimationStep, setHeaderAnimationStep] = useState(0)
  const [headerAnimationComplete, setHeaderAnimationComplete] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const visibleElements = useScrollReveal()

  // Sequential header animation on mount (timed, not scroll-based)
  useEffect(() => {
    // Disable scrolling during animation
    document.body.style.overflow = 'hidden'
    
    const timers = [
      setTimeout(() => setHeaderAnimationStep(1), 300),      // Breadcrumbs
      setTimeout(() => setHeaderAnimationStep(2), 800),      // Heading
      setTimeout(() => setHeaderAnimationStep(3), 1300),     // Description
      setTimeout(() => setHeaderAnimationStep(4), 1800),     // Event details
      setTimeout(() => setHeaderAnimationStep(5), 2300),     // Buttons
      setTimeout(() => {
        setHeaderAnimationComplete(true)
        document.body.style.overflow = 'auto' // Re-enable scrolling
      }, 3000), // Complete after all animations
    ]

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      // Cleanup: ensure scrolling is re-enabled if component unmounts
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Fetch event data
  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data.event)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching event:', error)
        setLoading(false)
      })
  }, [slug])

  const handleRegister = async () => {
    // Track the registration click
    try {
      const userFingerprint = generateUserFingerprint()
      console.log('Tracking registration click with fingerprint:', userFingerprint)
      
      const response = await fetch(`/api/events/${slug}/register-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userFingerprint }),
      })
      
      const result = await response.json()
      console.log('Tracking result:', result)
      
      if (!response.ok) {
        console.error('Failed to track click:', result)
      }
    } catch (error) {
      console.error('Failed to track registration click:', error)
    }

    // If registration link is provided, open it in new tab
    if (event?.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer')
      return
    }
    
    // Otherwise, scroll to "About This Event" section
    const aboutSection = document.getElementById("about-section")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleShare = async () => {
    // Handle share logic
    if (!event) return

    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    }

    // Try native share API first (for mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log('Event shared successfully')
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
          // Fall back to clipboard
          copyToClipboard()
        }
      }
    } else {
      // Fallback: Copy link to clipboard for desktop browsers
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setToastMessage('Event link copied to clipboard!')
      setShowToast(true)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Final fallback: Show URL in prompt
      prompt('Copy this link to share:', window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button asChild>
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.eventDate)
  
  // Use countdownIsoDate if available, otherwise fallback to eventDate
  const countdownDate = event.countdownIsoDate || event.eventDate
  
  // Format event time for display (use shared utility)
  const formatEventTime = (dateStr: string) => {
    const { time } = extractDateTimeComponents(dateStr)
    return format12Hour(time)
  }
  
  const eventHeaderData = {
    breadcrumbs: [
      { url: "/events", title: "Events" },
      { url: "#", title: event.title },
    ],
    heading: event.title,
    description: event.description,
    image: {
      src: event.bannerImage || event.imageUrl,
      alt: event.title,
    },
    date: {
      weekday: format(eventDate, 'EEE'),
      day: format(eventDate, 'dd'),
      month: format(eventDate, 'MMM'),
      year: format(eventDate, 'yyyy'),
    },
    location: event.location,
    type: event.type,
    countdownIsoDate: countdownDate,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      <Toast 
        message={toastMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* Back to Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="secondary"
          size="sm"
          asChild
          className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
        >
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Event Header */}
      <div className="relative">
        <EventItemHeader 
          {...eventHeaderData}
          animationStep={headerAnimationStep}
          buttons={[
            { title: "Register Now", variant: "default" as const, onClick: handleRegister }
          ]}
        />

        {/* Scroll indicator - only show when animation is complete */}
        {headerAnimationComplete && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Scroll to explore</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <main className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <section 
                id="about-section"
                data-scroll-reveal
                className={cn(
                  "transition-all duration-700 ease-out",
                  visibleElements.has("about-section")
                    ? "opacity-100 translate-y-0"
                    : "opacity-95 translate-y-4"
                )}
              >
                <h2 className="text-3xl font-bold mb-6">About This Event</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-blue-600 hover:prose-a:text-blue-500">
                  <ReactMarkdown>{event.content}</ReactMarkdown>
                </div>
              </section>

              {/* Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <section 
                  id="speaker-section"
                  data-scroll-reveal
                  className={cn(
                    "transition-all duration-700 ease-out delay-100",
                    visibleElements.has("speaker-section")
                      ? "opacity-100 translate-y-0"
                      : "opacity-95 translate-y-4"
                  )}
                >
                  <h2 className="text-3xl font-bold mb-6">
                    {event.speakers.length === 1 ? 'About the Speaker' : 'About the Speakers'}
                  </h2>
                  <div className="space-y-6">
                    {event.speakers.map((speaker: any, index: number) => (
                      <div 
                        key={index}
                        id={`speaker-${index + 1}`}
                        data-scroll-reveal
                        className={cn(
                          "flex items-start gap-4 p-6 border rounded-lg bg-secondary/10 transition-all duration-700 ease-out transform hover:scale-[1.01] hover:shadow-lg",
                          visibleElements.has(`speaker-${index + 1}`)
                            ? "opacity-100 translate-y-0"
                            : "opacity-95 translate-y-4"
                        )}
                        style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                          <p className="text-primary font-medium mb-1">{speaker.designation}</p>
                          {speaker.company && (
                            <p className="text-sm text-muted-foreground mb-3">{speaker.company}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Schedule Section */}
              {event.schedule && event.schedule.length > 0 && (
                <section 
                  id="schedule-section"
                  data-scroll-reveal
                  className={cn(
                    "transition-all duration-700 ease-out delay-200",
                    visibleElements.has("schedule-section")
                      ? "opacity-100 translate-y-0"
                      : "opacity-95 translate-y-4"
                  )}
                >
                  <h2 className="text-3xl font-bold mb-6">Event Schedule</h2>
                  <div className="space-y-4">
                    {event.schedule.map((item: any, index: number) => (
                      <div 
                        key={index}
                        id={`schedule-${index + 1}`}
                        data-scroll-reveal
                        className={cn(
                          "flex gap-4 p-4 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent rounded transition-all duration-700 ease-out transform hover:scale-[1.02] hover:shadow-lg",
                          visibleElements.has(`schedule-${index + 1}`)
                            ? "opacity-100 translate-x-0"
                            : "opacity-95 -translate-x-4"
                        )}
                        style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                      >
                        <div className="font-bold text-primary min-w-[80px]">{item.time}</div>
                        <div>
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Quick Info Card */}
                <div 
                  id="sidebar-details"
                  data-scroll-reveal
                  className={cn(
                    "border rounded-lg p-6 bg-secondary/5 transition-all duration-700 ease-out delay-100",
                    visibleElements.has("sidebar-details")
                      ? "opacity-100 translate-y-0"
                      : "opacity-95 translate-y-4"
                  )}
                >
                  <h3 className="text-xl font-bold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(eventDate, 'EEE, dd MMM yyyy')}
                        </p>
                        {/* Show time range if duration contains it, otherwise show single time */}
                        <p className="text-sm text-muted-foreground">
                          {isTimeRange(event.duration) ? event.duration : formatEventTime(event.eventDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Location</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Category</p>
                        <Badge variant="secondary" className="mt-1">{event.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-2xl font-bold text-primary mb-4">{event.price}</p>
                    <Button className="w-full" size="lg" onClick={handleRegister}>
                      Register Now
                    </Button>
                  </div>
                </div>

                {/* Share Card */}
                <div 
                  id="sidebar-share"
                  data-scroll-reveal
                  className={cn(
                    "border rounded-lg p-6 bg-secondary/5 transition-all duration-700 ease-out delay-200",
                    visibleElements.has("sidebar-share")
                      ? "opacity-100 translate-y-0"
                      : "opacity-95 translate-y-4"
                  )}
                >
                  <h3 className="text-lg font-bold mb-4">Share This Event</h3>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer4 />
    </div>
  )
}
