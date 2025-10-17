import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/events/[slug]/register-click - Track registration button click
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { userFingerprint } = body

    console.log('=== Registration Click Tracking ===')
    console.log('Slug:', slug)
    console.log('User Fingerprint:', userFingerprint)

    if (!userFingerprint) {
      console.error('Missing user fingerprint')
      return NextResponse.json({ error: 'User fingerprint required' }, { status: 400 })
    }

    // Find the event
    const event = await prisma.event.findUnique({
      where: { slug },
      select: {
        id: true,
        registrationClicks: true,
        uniqueRegistrationUsers: true,
      },
    })

    console.log('Event found:', event)

    if (!event) {
      console.error('Event not found for slug:', slug)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if this is a unique user
    const isUniqueUser = !event.uniqueRegistrationUsers.includes(userFingerprint)
    console.log('Is unique user:', isUniqueUser)
    console.log('Current clicks:', event.registrationClicks)
    console.log('Current unique users:', event.uniqueRegistrationUsers.length)
    
    // Update the event with new click data
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        registrationClicks: { increment: 1 },
        ...(isUniqueUser && {
          uniqueRegistrationUsers: {
            push: userFingerprint,
          },
        }),
      },
    })

    console.log('Updated event - clicks:', updatedEvent.registrationClicks, 'unique:', updatedEvent.uniqueRegistrationUsers.length)

    return NextResponse.json({ 
      success: true,
      isUniqueUser,
      totalClicks: updatedEvent.registrationClicks,
      uniqueUsers: updatedEvent.uniqueRegistrationUsers.length,
    })
  } catch (error) {
    console.error('Error tracking registration click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
