import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDateToLocalISO, parseLocalDateTime } from '@/lib/datetime-utils'

// GET /api/admin/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Convert eventDate to local ISO string to prevent timezone conversion
    const serializedEvent = {
      ...event,
      eventDate: event.eventDate 
        ? formatDateToLocalISO(event.eventDate)
        : event.eventDate
    }

    return NextResponse.json({ event: serializedEvent })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if slug is being changed and already exists
    if (slug) {
      const existingEvent = await prisma.event.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existingEvent) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    // Parse eventDate if provided, preserving local timezone
    const localEventDate = eventDate ? parseLocalDateTime(eventDate) : undefined

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(content && { content }),
        ...(imageUrl && { imageUrl }),
        ...(localEventDate && { eventDate: localEventDate }),
        ...(location && { location }),
        ...(type && { type }),
        ...(category && { category }),
        ...(duration !== undefined && { duration }),
        ...(price !== undefined && { price }),
        ...(registrationLink !== undefined && { registrationLink }),
        ...(countdownIsoDate !== undefined && { countdownIsoDate }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(showInHomePage !== undefined && { showInHomePage }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(schedule !== undefined && { schedule }),
        ...(speakers !== undefined && { speakers }),
      },
    })

    // Serialize eventDate to prevent timezone conversion
    const serializedEvent = {
      ...event,
      eventDate: event.eventDate 
        ? formatDateToLocalISO(event.eventDate)
        : event.eventDate
    }

    return NextResponse.json({ event: serializedEvent })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
