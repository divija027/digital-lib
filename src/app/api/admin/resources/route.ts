import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type && type !== 'all') {
      where.type = type
    }
    
    if (category && category !== 'all') {
      where.categoryId = category
    }
    
    if (status !== 'all') {
      where.isActive = status === 'approved'
    }

    // Get resources with pagination
    const [resources, totalResources] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: { name: true }
          },
          subject: {
            select: { name: true, code: true }
          },
          uploader: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.resource.count({ where })
    ])

    // Get resource statistics
    const [
      totalActive,
      totalPending,
      totalDownloads,
      resourcesByType
    ] = await Promise.all([
      prisma.resource.count({ where: { isActive: true } }),
      prisma.resource.count({ where: { isActive: false } }),
      prisma.resource.aggregate({ _sum: { downloads: true } }),
      prisma.resource.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isActive: true }
      })
    ])

    const totalPages = Math.ceil(totalResources / limit)

    return Response.json({
      resources,
      pagination: {
        currentPage: page,
        totalPages,
        totalResources,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalResources,
        totalActive,
        totalPending,
        totalDownloads: totalDownloads._sum.downloads || 0,
        resourcesByType: resourcesByType.map(item => ({
          type: item.type,
          count: item._count.type
        }))
      }
    })

  } catch (error) {
    console.error('Resources API error:', error)
    return Response.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, resourceIds } = body

    if (!action || !resourceIds || !Array.isArray(resourceIds)) {
      return Response.json({ error: 'Action and resourceIds are required' }, { status: 400 })
    }

    let updateData: any = {}
    
    switch (action) {
      case 'approve':
        updateData.isActive = true
        break
      case 'reject':
        updateData.isActive = false
        break
      case 'delete':
        // Handle deletion separately
        await prisma.resource.deleteMany({
          where: { id: { in: resourceIds } }
        })
        return Response.json({ 
          message: `${resourceIds.length} resource(s) deleted successfully` 
        })
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 })
    }

    const result = await prisma.resource.updateMany({
      where: { id: { in: resourceIds } },
      data: updateData
    })

    return Response.json({ 
      message: `${result.count} resource(s) ${action}d successfully`,
      count: result.count 
    })

  } catch (error) {
    console.error('Bulk resource action API error:', error)
    return Response.json({ error: 'Failed to perform bulk action' }, { status: 500 })
  }
}
