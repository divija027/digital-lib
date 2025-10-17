import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDateToLocalISO } from '@/lib/datetime-utils'

// GET /api/events/[slug] - Get single event by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const event = await prisma.event.findUnique({
      where: { slug },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.published) {
      return NextResponse.json({ error: 'Event not available' }, { status: 404 })
    }

    // Increment views
    await prisma.event.update({
      where: { id: event.id },
      data: { views: { increment: 1 } },
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
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
