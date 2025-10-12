import { NextRequest, NextResponse } from 'next/server'
import { getR2Service } from '@/lib/r2-client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdminAllowed } from '@/lib/admin-rbac'

// GET - Get single PDF or download URL
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pdf = await prisma.pDF.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
      },
    })

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Generate presigned download URL
    const r2Service = getR2Service()
    const downloadUrl = await r2Service.generatePresignedDownloadUrl(
      pdf.r2Key,
      3600 // 1 hour
    )

    // Increment view count
    await prisma.pDF.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({
      ...pdf,
      downloadUrl,
    })
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    )
  }
}

// PATCH - Update PDF metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const auth = await getCurrentUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    if (!isAdminAllowed(auth.email, auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, featured, branch, semester, subjectId } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (featured !== undefined) updateData.featured = featured
    if (branch !== undefined) updateData.branch = branch
    if (semester !== undefined) updateData.semester = parseInt(semester)
    if (subjectId !== undefined) updateData.subjectId = subjectId

    const pdf = await prisma.pDF.update({
      where: { id: params.id },
      data: updateData,
      include: {
        subject: true,
      },
    })

    return NextResponse.json({
      success: true,
      pdf,
      message: 'PDF updated successfully',
    })
  } catch (error) {
    console.error('Error updating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to update PDF' },
      { status: 500 }
    )
  }
}

// DELETE - Delete PDF
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const auth = await getCurrentUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    if (!isAdminAllowed(auth.email, auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get PDF to get r2Key
    const pdf = await prisma.pDF.findUnique({
      where: { id: params.id },
    })

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Delete from R2
    const r2Service = getR2Service()
    await r2Service.deleteFile(pdf.r2Key)

    // Delete from database
    await prisma.pDF.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'PDF deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting PDF:', error)
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    )
  }
}
