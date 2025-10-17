import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/events/[id]/feature - Toggle featured status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { featured } = body

    const event = await prisma.event.update({
      where: { id: resolvedParams.id },
      data: { featured },
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error toggling event featured status:', error)
    return NextResponse.json({ error: 'Failed to update featured status' }, { status: 500 })
  }
}
