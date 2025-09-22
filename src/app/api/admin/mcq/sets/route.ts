import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/mcq/sets - Get all MCQ sets (admin version)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const featured = searchParams.get('featured')

    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (category && category !== 'All') {
      where.category = category
    }
    
    if (difficulty && difficulty !== 'All') {
      where.difficulty = difficulty
    }
    
    if (featured === 'true') {
      where.featured = true
    }

    const mcqSets = await prisma.mCQSet.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        questions: {
          select: {
            id: true
          }
        },
        attempts: {
          select: {
            id: true,
            score: true,
            totalQuestions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics for each set
    const setsWithStats = mcqSets.map(set => {
      const questionCount = set.questions.length
      const attemptCount = set.attempts.length
      
      // Calculate average score
      const totalScore = set.attempts.reduce((sum, attempt) => sum + attempt.score, 0)
      const averageScore = attemptCount > 0 ? Math.round((totalScore / attemptCount)) : 0

      return {
        id: set.id,
        title: set.title,
        description: set.description,
        difficulty: set.difficulty,
        category: set.category,
        timeLimit: set.timeLimit,
        tags: set.tags,
        companies: set.companies,
        featured: set.featured,
        status: set.status,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt,
        createdBy: set.creator.name || 'Unknown',
        questions: questionCount,
        attempts: attemptCount,
        averageScore
      }
    })

    return NextResponse.json(setsWithStats)
  } catch (error) {
    console.error('Error fetching MCQ sets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ sets' },
      { status: 500 }
    )
  }
}

// POST /api/admin/mcq/sets - Create a new MCQ set (admin version)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      tags,
      companies,
      featured
    } = body

    // For now, we'll use a default admin user ID
    // In a real app, you'd get this from the session
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'No admin user found' },
        { status: 400 }
      )
    }

    const mcqSet = await prisma.mCQSet.create({
      data: {
        title,
        description,
        difficulty: difficulty.toUpperCase(),
        category,
        timeLimit: parseInt(timeLimit),
        tags: tags || [],
        companies: companies || [],
        featured: Boolean(featured),
        status: 'ACTIVE',
        createdBy: adminUser.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        questions: true
      }
    })

    return NextResponse.json(mcqSet, { status: 201 })
  } catch (error) {
    console.error('Error creating MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to create MCQ set' },
      { status: 500 }
    )
  }
}
