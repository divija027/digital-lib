import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
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
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({
      ...user,
      resourceCount: user._count.uploadedResources
    })

  } catch (error) {
    console.error('Get user API error:', error)
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, collegeName, role } = body

    const updatedUser = await prisma.user.update({
      where: { id },
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

  } catch (error: any) {
    if (error.code === 'P2025') {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Update user API error:', error)
    return Response.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.user.delete({
      where: { id }
    })

    return Response.json({ message: 'User deleted successfully' })

  } catch (error: any) {
    if (error.code === 'P2025') {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Delete user API error:', error)
    return Response.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
