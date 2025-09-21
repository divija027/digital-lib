import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/blog/categories/seed - Create sample categories for testing
export async function POST() {
  try {
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest trends and news in technology',
        color: '#3B82F6'
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and tips',
        color: '#10B981'
      },
      {
        name: 'Education',
        slug: 'education',
        description: 'Educational content and resources',
        color: '#F59E0B'
      },
      {
        name: 'Career',
        slug: 'career',
        description: 'Career advice and opportunities',
        color: '#EF4444'
      },
      {
        name: 'VTU Updates',
        slug: 'vtu-updates',
        description: 'VTU University news and updates',
        color: '#8B5CF6'
      }
    ]

    const createdCategories = []
    
    for (const categoryData of categories) {
      const existingCategory = await prisma.blogCategory.findUnique({
        where: { slug: categoryData.slug }
      })

      if (!existingCategory) {
        const category = await prisma.blogCategory.create({
          data: categoryData
        })
        createdCategories.push(category)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdCategories.length} categories`,
      data: createdCategories
    })
  } catch (error) {
    console.error('Error seeding categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed categories' },
      { status: 500 }
    )
  }
}