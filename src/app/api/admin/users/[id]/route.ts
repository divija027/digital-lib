import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        collegeName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        uploadedResources: {
          select: {
            id: true,
            title: true,
            type: true,
            downloads: true,
            createdAt: true,
            category: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { uploadedResources: true }
        }
      }
    })

    if (!user) {
      return createAdminResponse('User not found', 404)
    }

    return Response.json({
      ...user,
      resourceCount: user._count.uploadedResources
    })

  } catch (error) {
    console.error('Get user API error:', error)
    return createAdminResponse('Failed to fetch user', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { name, collegeName, role } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(collegeName && { collegeName }),
        ...(role && { role })
      },
      select: {
        id: true,
        email: true,
        name: true,
        collegeName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return Response.json(updatedUser)

  } catch (error) {
    if (error.code === 'P2025') {
      return createAdminResponse('User not found', 404)
    }
    console.error('Update user API error:', error)
    return createAdminResponse('Failed to update user', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    // Prevent admin from deleting themselves
    if (admin.id === params.id) {
      return createAdminResponse('Cannot delete your own account', 400)
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return Response.json({ message: 'User deleted successfully' })

  } catch (error) {
    if (error.code === 'P2025') {
      return createAdminResponse('User not found', 404)
    }
    console.error('Delete user API error:', error)
    return createAdminResponse('Failed to delete user', 500)
  }
}
