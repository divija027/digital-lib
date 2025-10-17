import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDateToLocalISO } from '@/lib/datetime-utils'

// GET /api/events - Get all published events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        published: true,
        archived: false,
      },
      orderBy: {
        eventDate: 'asc', // Show upcoming events first
      },
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

