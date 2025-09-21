import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/mcq/sets/[id] - Get a specific MCQ set (admin version)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mcqSet = await prisma.mCQSet.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        questions: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        attempts: {
          select: {
            id: true,
            score: true,
            totalQuestions: true,
            timeSpent: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'MCQ set not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const questionCount = mcqSet.questions.length
    const attemptCount = mcqSet.attempts.length
    const totalScore = mcqSet.attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const averageScore = attemptCount > 0 ? Math.round((totalScore / attemptCount)) : 0

    const setWithStats = {
      ...mcqSet,
      questionCount,
      attemptCount,
      averageScore
    }

    return NextResponse.json(setWithStats)
  } catch (error) {
    console.error('Error fetching MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ set' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/mcq/sets/[id] - Update a specific MCQ set (admin version)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      tags,
      companies,
      featured,
      status
    } = body

    const mcqSet = await prisma.mCQSet.update({
      where: { id },
      data: {
        title,
        description,
        difficulty: difficulty?.toUpperCase(),
        category,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
        tags: tags || [],
        companies: companies || [],
        featured: Boolean(featured),
        status: status?.toUpperCase(),
        updatedAt: new Date()
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

    return NextResponse.json(mcqSet)
  } catch (error) {
    console.error('Error updating MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to update MCQ set' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/mcq/sets/[id] - Delete a specific MCQ set (admin version)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.mCQSet.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'MCQ set deleted successfully' })
  } catch (error) {
    console.error('Error deleting MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to delete MCQ set' },
      { status: 500 }
    )
  }
}
