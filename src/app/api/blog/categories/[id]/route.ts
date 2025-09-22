import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blog/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await (prisma as any).blogCategory.findUnique({
      where: {
        id
      },
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
      }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      postCount: category._count.posts
    }

    return NextResponse.json({
      success: true,
      data: formattedCategory
    })
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/categories/[id] - Update a category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await (prisma as any).blogCategory.findUnique({
      where: {
        id
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Generate new slug from name if name changed
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if another category with the same name/slug exists (excluding current one)
    const duplicateCategory = await (prisma as any).blogCategory.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name },
              { slug }
            ]
          },
          {
            id: {
              not: id
            }
          }
        ]
      }
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    const updatedCategory = await (prisma as any).blogCategory.update({
      where: {
        id
      },
      data: {
        name,
        slug,
        description,
        color: color || existingCategory.color
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    console.error('Error updating blog category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/categories/[id] - Delete a category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if category exists
    const existingCategory = await (prisma as any).blogCategory.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has associated posts
    if (existingCategory._count.posts > 0) {
      // Option 1: Prevent deletion if posts exist
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. It has ${existingCategory._count.posts} associated post(s). Please reassign or delete the posts first.` 
        },
        { status: 409 }
      )

      // Option 2: Move posts to "Uncategorized" category (uncomment below if preferred)
      /*
      // Find or create an "Uncategorized" category
      let uncategorizedCategory = await (prisma as any).blogCategory.findFirst({
        where: {
          slug: 'uncategorized'
        }
      })

      if (!uncategorizedCategory) {
        uncategorizedCategory = await (prisma as any).blogCategory.create({
          data: {
            name: 'Uncategorized',
            slug: 'uncategorized',
            description: 'Posts without a specific category',
            color: '#6B7280'
          }
        })
      }

      // Move all posts to uncategorized
      await (prisma as any).blogPost.updateMany({
        where: {
          categoryId: params.id
        },
        data: {
          categoryId: uncategorizedCategory.id
        }
      })
      */
    }

    // Delete the category
    await (prisma as any).blogCategory.delete({
      where: {
        id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}