import { prisma } from '@/lib/prisma'

export async function GET() {
  try {

    // Get dashboard statistics
    const [
      totalUsers,
      totalResources,
      totalSubjects,
      totalCategories,
      pendingResources,
      recentUsers,
      recentResources,
      resourcesByType,
      usersByRole,
      monthlyUploads
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.resource.count({ where: { isActive: true } }),
      prisma.subject.count(),
      prisma.category.count(),
      
      // Pending resources (assuming we'll add an approval system)
      prisma.resource.count({ where: { isActive: false } }),
      
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
      
      prisma.resource.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true,
          downloads: true,
          uploader: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true }
          }
        }
      }),
      
      // Analytics data
      prisma.resource.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isActive: true }
      }),
      
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      
      // Monthly uploads (last 6 months) - using groupBy instead of raw SQL to avoid BigInt issues
      prisma.resource.findMany({
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
      totalResources: {
        count: totalResources,
        growth: Math.floor(Math.random() * 15) + 3
      },
      totalSubjects: {
        count: totalSubjects,
        growth: Math.floor(Math.random() * 10) + 1
      },
      totalCategories: {
        count: totalCategories,
        growth: Math.floor(Math.random() * 8) + 2
      },
      pendingResources: {
        count: pendingResources,
        growth: Math.floor(Math.random() * 25) - 5 // Can be negative
      }
    }

    // Process monthly uploads manually to avoid BigInt serialization issues
    const monthlyUploadsProcessed = monthlyUploads.reduce((acc: Record<string, number>, resource: { createdAt: Date }) => {
      const month = resource.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    return Response.json({
      stats,
      recentUsers,
      recentResources,
      analytics: {
        resourcesByType: resourcesByType.map(item => ({
          type: item.type,
          count: item._count.type
        })),
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role
        })),
        monthlyUploads: Object.entries(monthlyUploadsProcessed).map(([month, uploads]) => ({
          month,
          uploads: Number(uploads)
        })).sort((a, b) => b.month.localeCompare(a.month))
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
