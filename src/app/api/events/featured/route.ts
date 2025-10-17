import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDateToLocalISO } from '@/lib/datetime-utils'

// GET /api/events/featured - Get featured events for home page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')

    const events = await prisma.event.findMany({
      where: {
        featured: true,
        published: true,
        archived: false,
      },
      orderBy: { eventDate: 'asc' },
      take: limit,
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
    console.error('Error fetching featured events:', error)
    return NextResponse.json({ error: 'Failed to fetch featured events' }, { status: 500 })
  }
}
