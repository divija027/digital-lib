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

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: { id: true, name: true }
        },
        subject: {
          select: { id: true, name: true, code: true }
        },
        uploader: {
          select: { id: true, name: true, email: true, collegeName: true }
        }
      }
    })

    if (!resource) {
      return createAdminResponse('Resource not found', 404)
    }

    return Response.json(resource)

  } catch (error) {
    console.error('Get resource API error:', error)
    return createAdminResponse('Failed to fetch resource', 500)
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
    const { 
      title, 
      description, 
      type, 
      semester, 
      year, 
      categoryId, 
      subjectId, 
      isActive 
    } = body

    const updatedResource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(semester && { semester: parseInt(semester) }),
        ...(year && { year: parseInt(year) }),
        ...(categoryId && { categoryId }),
        ...(subjectId && { subjectId }),
        ...(typeof isActive === 'boolean' && { isActive })
      },
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
    })

    return Response.json(updatedResource)

  } catch (error) {
    if (error.code === 'P2025') {
      return createAdminResponse('Resource not found', 404)
    }
    console.error('Update resource API error:', error)
    return createAdminResponse('Failed to update resource', 500)
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

    // Get resource info before deletion for file cleanup
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      select: { filePath: true }
    })

    if (!resource) {
      return createAdminResponse('Resource not found', 404)
    }

    await prisma.resource.delete({
      where: { id: params.id }
    })

    // TODO: Delete physical file from storage
    // const fs = require('fs').promises
    // try {
    //   await fs.unlink(resource.filePath)
    // } catch (fileError) {
    //   console.warn('Could not delete physical file:', fileError)
    // }

    return Response.json({ message: 'Resource deleted successfully' })

  } catch (error) {
    if (error.code === 'P2025') {
      return createAdminResponse('Resource not found', 404)
    }
    console.error('Delete resource API error:', error)
    return createAdminResponse('Failed to delete resource', 500)
  }
}
