import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/events/[id]/archive - Archive/Unarchive event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { archived } = body

    if (typeof archived !== 'boolean') {
      return NextResponse.json({ error: 'archived must be a boolean' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id },
      data: { archived },
    })

    return NextResponse.json({ 
      event,
      message: archived ? 'Event archived successfully' : 'Event unarchived successfully'
    })
  } catch (error) {
    console.error('Error archiving event:', error)
    return NextResponse.json({ error: 'Failed to archive event' }, { status: 500 })
  }
}
