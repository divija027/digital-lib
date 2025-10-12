import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

/**
 * GET: Fetch current home page layout with assigned MCQ sets
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch MCQ sets with positions assigned (1-5)
    const assignedSets = await prisma.mCQSet.findMany({
      where: {
        homePreviewPosition: {
          not: null,
        },
        status: 'ACTIVE',
      },
      include: {
        questions: {
          select: { id: true },
        },
        attempts: {
          select: {
            id: true,
            score: true,
            totalQuestions: true,
          },
        },
      },
      orderBy: {
        homePreviewPosition: 'asc',
      },
    })

    // Create layout structure
    const layout = [
      { position: 1, type: 'small' as const, mcqSet: null as any },
      { position: 2, type: 'small' as const, mcqSet: null as any },
      { position: 3, type: 'small' as const, mcqSet: null as any },
      { position: 4, type: 'small' as const, mcqSet: null as any },
      { position: 5, type: 'big' as const, mcqSet: null as any },
    ]

    // Map assigned sets to their positions
    assignedSets.forEach((set) => {
      if (set.homePreviewPosition && set.homePreviewPosition >= 1 && set.homePreviewPosition <= 5) {
        const slotIndex = set.homePreviewPosition - 1
        
        // Calculate stats
        const questionCount = set.questions.length
        const attemptCount = set.attempts.length
        const totalScore = set.attempts.reduce((sum, attempt) => sum + attempt.score, 0)
        const averageScore = attemptCount > 0 ? Math.round(totalScore / attemptCount) : 0

        layout[slotIndex].mcqSet = {
          id: set.id,
          title: set.title,
          description: set.description,
          category: set.category,
          difficulty: set.difficulty,
          bannerImage: set.bannerImage,
          questions: questionCount,
          attempts: attemptCount,
          averageScore,
        }
      }
    })

    return NextResponse.json({ layout })
  } catch (error) {
    console.error('Error fetching layout:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layout' },
      { status: 500 }
    )
  }
}

/**
 * POST: Assign an MCQ set to a specific position
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { mcqSetId, position } = body

    // Validate position
    if (!position || position < 1 || position > 5) {
      return NextResponse.json(
        { error: 'Invalid position. Must be between 1 and 5.' },
        { status: 400 }
      )
    }

    // Check if MCQ set exists
    const mcqSet = await prisma.mCQSet.findUnique({
      where: { id: mcqSetId },
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'MCQ set not found' },
        { status: 404 }
      )
    }

    // Check if position is already occupied
    const existingSet = await prisma.mCQSet.findFirst({
      where: { homePreviewPosition: position },
    })

    if (existingSet && existingSet.id !== mcqSetId) {
      // Clear the existing set from this position
      await prisma.mCQSet.update({
        where: { id: existingSet.id },
        data: {
          homePreviewPosition: null,
          showInHomePreview: false,
        },
      })
    }

    // Remove MCQ set from any previous position
    if (mcqSet.homePreviewPosition && mcqSet.homePreviewPosition !== position) {
      // This set was in a different position, clear it
      await prisma.mCQSet.update({
        where: { id: mcqSetId },
        data: { homePreviewPosition: null },
      })
    }

    // Assign MCQ set to the position
    const updatedSet = await prisma.mCQSet.update({
      where: { id: mcqSetId },
      data: {
        homePreviewPosition: position,
        showInHomePreview: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'MCQ set assigned to position successfully',
      mcqSet: updatedSet,
    })
  } catch (error) {
    console.error('Error assigning MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to assign MCQ set' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove an MCQ set from a position
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const position = parseInt(searchParams.get('position') || '0')

    if (!position || position < 1 || position > 5) {
      return NextResponse.json(
        { error: 'Invalid position parameter' },
        { status: 400 }
      )
    }

    // Find and clear the set at this position
    const mcqSet = await prisma.mCQSet.findFirst({
      where: { homePreviewPosition: position },
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'No MCQ set found at this position' },
        { status: 404 }
      )
    }

    await prisma.mCQSet.update({
      where: { id: mcqSet.id },
      data: {
        homePreviewPosition: null,
        showInHomePreview: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'MCQ set removed from position successfully',
    })
  } catch (error) {
    console.error('Error removing MCQ set:', error)
    return NextResponse.json(
      { error: 'Failed to remove MCQ set' },
      { status: 500 }
    )
  }
}
