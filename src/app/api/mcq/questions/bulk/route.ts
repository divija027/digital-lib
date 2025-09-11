import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// POST /api/mcq/questions/bulk - Bulk create MCQ questions
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
    const { questions, mcqSetId } = body

    // Validate required fields
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!mcqSetId) {
      return NextResponse.json(
        { error: 'MCQ set ID is required' },
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

    // Validate each question
    const validatedQuestions: any[] = []
    const errors: any[] = []

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const questionErrors = []

      if (!q.question || typeof q.question !== 'string') {
        questionErrors.push('Question text is required')
      }

      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        questionErrors.push('Options must be an array of exactly 4 items')
      }

      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        questionErrors.push('Correct answer must be a number between 0 and 3')
      }

      if (questionErrors.length > 0) {
        errors.push({
          questionIndex: i + 1,
          errors: questionErrors
        })
      } else {
        // Map difficulty to valid enum values
        const difficultyMap: Record<string, string> = {
          'EASY': 'BEGINNER',
          'MEDIUM': 'INTERMEDIATE', 
          'HARD': 'ADVANCED',
          'BEGINNER': 'BEGINNER',
          'INTERMEDIATE': 'INTERMEDIATE',
          'ADVANCED': 'ADVANCED'
        }
        
        const mappedDifficulty = difficultyMap[q.difficulty?.toUpperCase()] || 'BEGINNER'

        validatedQuestions.push({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
          hint: q.hint || null,
          difficulty: mappedDifficulty,
          tags: q.tags || [],
          mcqSetId: mcqSet.id,
          createdBy: currentUser.userId
        })
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed for some questions',
          validationErrors: errors
        },
        { status: 400 }
      )
    }

    // Create all questions in a transaction
    const createdQuestions = await prisma.$transaction(async (tx) => {
      const results = []
      for (const questionData of validatedQuestions) {
        const question = await tx.mCQQuestion.create({
          data: questionData,
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
        results.push(question)
      }
      return results
    })

    return NextResponse.json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions,
      successCount: createdQuestions.length
    }, { status: 201 })

  } catch (error) {
    console.error('Error bulk creating MCQ questions:', error)
    return NextResponse.json(
      { error: 'Failed to create MCQ questions' },
      { status: 500 }
    )
  }
}
