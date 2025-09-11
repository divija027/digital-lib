import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET /api/mcq/questions - Get all MCQ questions with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mcqSetId = searchParams.get('mcqSetId')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    
    if (mcqSetId) {
      where.mcqSetId = mcqSetId
    }
    
    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty
    }

    const skip = (page - 1) * limit

    const [questions, totalCount] = await Promise.all([
      prisma.mCQQuestion.findMany({
        where,
        include: {
          mcqSet: {
            select: {
              id: true,
              title: true,
              category: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.mCQQuestion.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      questions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching MCQ questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ questions' },
      { status: 500 }
    )
  }
}

// POST /api/mcq/questions - Create a new MCQ question
export async function POST(request: NextRequest) {
  try {
    // Get current user from authentication
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      question,
      options,
      correctAnswer,
      explanation,
      hint,
      difficulty,
      tags,
      mcqSetId
    } = body

    // Validate required fields
    if (!question || !options || typeof correctAnswer !== 'number' || !mcqSetId) {
      return NextResponse.json(
        { error: 'Question, options, correctAnswer, and mcqSetId are required' },
        { status: 400 }
      )
    }

    // Validate options array
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { error: 'Options must be an array of exactly 4 items' },
        { status: 400 }
      )
    }

    // Validate correct answer index
    if (correctAnswer < 0 || correctAnswer > 3) {
      return NextResponse.json(
        { error: 'Correct answer must be between 0 and 3' },
        { status: 400 }
      )
    }

    // Check if MCQ set exists
    const mcqSet = await prisma.mCQSet.findUnique({
      where: { id: mcqSetId }
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'MCQ set not found' },
        { status: 404 }
      )
    }

    const newQuestion = await prisma.mCQQuestion.create({
      data: {
        question,
        options,
        correctAnswer,
        explanation: explanation || null,
        hint: hint || null,
        difficulty: difficulty || 'BEGINNER',
        tags: tags || [],
        mcqSetId,
        createdBy: currentUser.userId
      },
      include: {
        mcqSet: {
          select: {
            id: true,
            title: true,
            category: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newQuestion, { status: 201 })
  } catch (error) {
    console.error('Error creating MCQ question:', error)
    return NextResponse.json(
      { error: 'Failed to create MCQ question' },
      { status: 500 }
    )
  }
}

// DELETE /api/mcq/questions - Bulk delete MCQ questions
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionIds } = body

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { error: 'Question IDs array is required' },
        { status: 400 }
      )
    }

    const deletedQuestions = await prisma.mCQQuestion.deleteMany({
      where: {
        id: {
          in: questionIds
        }
      }
    })

    return NextResponse.json({
      message: `${deletedQuestions.count} question(s) deleted successfully`,
      deletedCount: deletedQuestions.count
    })
  } catch (error) {
    console.error('Error deleting MCQ questions:', error)
    return NextResponse.json(
      { error: 'Failed to delete MCQ questions' },
      { status: 500 }
    )
  }
}
