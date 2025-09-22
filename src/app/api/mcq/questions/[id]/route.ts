import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/mcq/questions/[id] - Get a specific MCQ question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const question = await prisma.mCQQuestion.findUnique({
      where: { id },
      include: {
        mcqSet: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true
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

    if (!question) {
      return NextResponse.json(
        { error: 'MCQ question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching MCQ question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ question' },
      { status: 500 }
    )
  }
}

// PUT /api/mcq/questions/[id] - Update a specific MCQ question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      tags
    } = body

    // Check if question exists
    const existingQuestion = await prisma.mCQQuestion.findUnique({
      where: { id }
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'MCQ question not found' },
        { status: 404 }
      )
    }

    // Validate options array if provided
    if (options && (!Array.isArray(options) || options.length !== 4)) {
      return NextResponse.json(
        { error: 'Options must be an array of exactly 4 items' },
        { status: 400 }
      )
    }

    // Validate correct answer index if provided
    if (typeof correctAnswer === 'number' && (correctAnswer < 0 || correctAnswer > 3)) {
      return NextResponse.json(
        { error: 'Correct answer must be between 0 and 3' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    if (question !== undefined) updateData.question = question
    if (options !== undefined) updateData.options = options
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer
    if (explanation !== undefined) updateData.explanation = explanation
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (tags !== undefined) updateData.tags = tags

    const updatedQuestion = await prisma.mCQQuestion.update({
      where: { id },
      data: updateData,
      include: {
        mcqSet: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true
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

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Error updating MCQ question:', error)
    return NextResponse.json(
      { error: 'Failed to update MCQ question' },
      { status: 500 }
    )
  }
}

// DELETE /api/mcq/questions/[id] - Delete a specific MCQ question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if question exists
    const existingQuestion = await prisma.mCQQuestion.findUnique({
      where: { id }
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'MCQ question not found' },
        { status: 404 }
      )
    }

    await prisma.mCQQuestion.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'MCQ question deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting MCQ question:', error)
    return NextResponse.json(
      { error: 'Failed to delete MCQ question' },
      { status: 500 }
    )
  }
}
