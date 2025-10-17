import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const banner = formData.get('banner') as File
    
    if (!banner) {
      return NextResponse.json({ error: 'No banner file provided' }, { status: 400 })
    }

    // Validate file type
    if (!banner.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (banner.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Get event
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'events')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = banner.name.split('.').pop()
    const filename = `event-${id}-${timestamp}.${extension}`
    const filepath = path.join(uploadsDir, filename)

    // Save file
    const bytes = await banner.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Update event with new banner URL
    const bannerUrl = `/uploads/events/${filename}`
    await prisma.event.update({
      where: { id },
      data: { bannerImage: bannerUrl },
    })

    return NextResponse.json({ 
      success: true,
      bannerUrl 
    })
  } catch (error) {
    console.error('Error uploading banner:', error)
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 })
  }
}
