import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/categories - Fetch all blog categories
export async function GET() {
  try {
    const categories = await (prisma as any).blogCategory.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedCategories = categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      postCount: category._count.posts
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories
    })
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/blog/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color = '#3B82F6' } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if category already exists
    const existingCategory = await (prisma as any).blogCategory.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 409 }
      )
    }

    const category = await (prisma as any).blogCategory.create({
      data: {
        name,
        slug,
        description,
        color
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}