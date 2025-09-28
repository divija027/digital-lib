import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get dashboard statistics
    const [
      totalUsers,
      totalSubjects,
      totalCategories,
      totalMCQSets,
      totalBlogPosts,
      recentUsers,
      usersByRole,
      monthlyUserSignups
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.subject.count(),
      prisma.category.count(),
      prisma.mCQSet.count(),
      prisma.blogPost.count(),
      
      // Recent activity
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          collegeName: true
        }
      }),
      
      // Analytics data
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      
      // Monthly user signups (last 6 months)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        select: {
          createdAt: true
        }
      })
    ])

    // Calculate growth percentages (mock data for now - would need historical data)
    const stats = {
      totalUsers: {
        count: totalUsers,
        growth: Math.floor(Math.random() * 20) + 5 // Mock growth
      },
      totalSubjects: {
        count: totalSubjects,
        growth: Math.floor(Math.random() * 10) + 1
      },
      totalCategories: {
        count: totalCategories,
        growth: Math.floor(Math.random() * 8) + 2
      },
      totalMCQSets: {
        count: totalMCQSets,
        growth: Math.floor(Math.random() * 15) + 3
      },
      totalBlogPosts: {
        count: totalBlogPosts,
        growth: Math.floor(Math.random() * 12) + 2
      }
    }

    // Process monthly signups manually to avoid BigInt serialization issues
    const monthlySignupsProcessed = monthlyUserSignups.reduce((acc: Record<string, number>, user: { createdAt: Date }) => {
      const month = user.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    return Response.json({
      stats,
      recentUsers,
      analytics: {
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role
        })),
        monthlySignups: Object.entries(monthlySignupsProcessed).map(([month, signups]) => ({
          month,
          signups: Number(signups)
        })).sort((a, b) => b.month.localeCompare(a.month))
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
