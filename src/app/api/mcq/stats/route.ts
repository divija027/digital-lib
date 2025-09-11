import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/mcq/stats - Get MCQ statistics
export async function GET(request: NextRequest) {
  try {
    // Get total counts
    const [totalSets, totalQuestions, totalAttempts] = await Promise.all([
      prisma.mCQSet.count(),
      prisma.mCQQuestion.count(),
      prisma.mCQAttempt.count()
    ])

    // Get average score
    const attempts = await prisma.mCQAttempt.findMany({
      select: {
        score: true,
        totalQuestions: true
      }
    })

    let averageScore = 0
    if (attempts.length > 0) {
      const totalPercentage = attempts.reduce((sum, attempt) => {
        const percentage = (attempt.score / attempt.totalQuestions) * 100
        return sum + percentage
      }, 0)
      averageScore = Math.round(totalPercentage / attempts.length)
    }

    // Get category breakdown
    const categoryStats = await prisma.mCQSet.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    // Get difficulty breakdown
    const difficultyStats = await prisma.mCQSet.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    })

    // Get recent activity (last 10 sets)
    const recentSets = await prisma.mCQSet.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        creator: {
          select: {
            name: true
          }
        }
      }
    })

    const stats = {
      totalSets,
      totalQuestions,
      totalAttempts,
      averageScore,
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.category
      })),
      difficultyBreakdown: difficultyStats.map(stat => ({
        difficulty: stat.difficulty,
        count: stat._count.difficulty
      })),
      recentActivity: recentSets.map(set => ({
        id: set.id,
        title: set.title,
        createdAt: set.createdAt,
        createdBy: set.creator.name || 'Unknown'
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching MCQ stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ statistics' },
      { status: 500 }
    )
  }
}
