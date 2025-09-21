import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/tags - Fetch all blog tags
export async function GET() {
  try {
    const tags = await (prisma as any).blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedTags = tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.posts
    }))

    return NextResponse.json({
      success: true,
      data: formattedTags
    })
  } catch (error) {
    console.error('Error fetching blog tags:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST /api/blog/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if tag already exists
    const existingTag = await (prisma as any).blogTag.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag already exists' },
        { status: 409 }
      )
    }

    const tag = await (prisma as any).blogTag.create({
      data: {
        name,
        slug
      }
    })

    return NextResponse.json({
      success: true,
      data: tag
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog tag:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}