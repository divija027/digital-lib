import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

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
      
      // Monthly uploads (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as uploads
        FROM resources 
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
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
        monthlyUploads
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return createAdminResponse('Failed to fetch dashboard data', 500)
  }
}
