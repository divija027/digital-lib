import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDateToLocalISO, parseLocalDateTime } from '@/lib/datetime-utils'

// GET /api/admin/events - List all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const showInHomePage = searchParams.get('showInHomePage')

    const where: any = {}
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (published === 'true') {
      where.published = true
    }
    
    if (showInHomePage === 'true') {
      where.showInHomePage = true
      where.archived = false  // Don't show archived events on home page
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Serialize eventDate for all events to prevent timezone conversion
    const serializedEvents = events.map(event => ({
      ...event,
      eventDate: event.eventDate 
        ? formatDateToLocalISO(event.eventDate)
        : event.eventDate
    }))

    return NextResponse.json({ events: serializedEvents })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/admin/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      description,
      content,
      imageUrl,
      eventDate,
      location,
      type,
      category,
      duration,
      price,
      registrationLink,
      countdownIsoDate,
      featured,
      published,
      showInHomePage,
      seoTitle,
      seoDescription,
      schedule,
      speakers,
    } = body

    // Validate required fields
    if (!title || !slug || !description || !content || !imageUrl || !eventDate || !location || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    })

    if (existingEvent) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Parse the datetime string and create a Date object preserving local time
    const localEventDate = parseLocalDateTime(eventDate)

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl,
        eventDate: localEventDate,
        location,
        speaker: '', // Keep for backwards compatibility but empty
        type,
        category,
        duration: duration || '',
        price: price || 'Free',
        registrationLink: registrationLink || null,
        countdownIsoDate,
        featured: featured || false,
        published: published || false,
        showInHomePage: showInHomePage || false,
        seoTitle,
        seoDescription,
        ...(schedule && { schedule }),
        ...(speakers && { speakers }),
      },
    })

    // Serialize eventDate to prevent timezone conversion
    const serializedEvent = {
      ...event,
      eventDate: event.eventDate 
        ? formatDateToLocalISO(event.eventDate)
        : event.eventDate
    }

    return NextResponse.json({ event: serializedEvent }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

