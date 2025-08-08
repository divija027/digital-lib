import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const subject = searchParams.get('subject')
    const type = searchParams.get('type')
    const semester = searchParams.get('semester')

    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    if (category) where.categoryId = category
    if (subject) where.subjectId = subject
    if (type) where.type = type
    if (semester) where.semester = parseInt(semester)

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          category: true,
          subject: true,
          uploader: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.resource.count({ where })
    ])

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get resources error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const subjectId = formData.get('subjectId') as string
    const type = formData.get('type') as string
    const semester = formData.get('semester') as string
    const year = formData.get('year') as string

    if (!file || !title || !categoryId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save to database
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileName: file.name,
        filePath: `/uploads/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        type: type as any,
        semester: semester ? parseInt(semester) : null,
        year: year ? parseInt(year) : null,
        categoryId,
        subjectId: subjectId || null,
        uploadedBy: user.userId // Use the authenticated user
      },
      include: {
        category: true,
        subject: true
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Upload resource error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
