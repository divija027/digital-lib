import { NextRequest, NextResponse } from 'next/server'
import { getR2Service } from '@/lib/r2-client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdminAllowed } from '@/lib/admin-rbac'
import {
  UPLOAD_ERROR_MESSAGES,
  UPLOAD_SUCCESS_MESSAGES,
  UPLOAD_TIMEOUTS,
} from '@/lib/constants/upload'

/**
 * Logger utility for structured error logging
 */
const logger = {
  error: (context: string, error: unknown, metadata?: Record<string, any>) => {
    console.error(`[PDF Detail API Error] ${context}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...metadata,
    })
  },
  info: (message: string, metadata?: Record<string, any>) => {
    console.log(`[PDF Detail API] ${message}`, metadata || '')
  },
}

/**
 * GET /api/admin/pdfs/[id]
 * Get single PDF details with presigned download URL
 * Also increments view count
 * 
 * @param params - Route params containing PDF ID
 * @returns JSON response with PDF details and download URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const pdf = await prisma.pDF.findUnique({
      where: { id },
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
      UPLOAD_TIMEOUTS.DOWNLOAD_URL
    )

    // Increment view count
    await prisma.pDF.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    logger.info('PDF accessed', { pdfId: id, title: pdf.title })

    return NextResponse.json({
      ...pdf,
      downloadUrl,
    })
  } catch (error) {
    logger.error('Fetching PDF', error, { pdfId: id })
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/pdfs/[id]
 * Update PDF metadata (title, description, featured status, etc.)
 * Does not allow updating the actual file
 * 
 * @param params - Route params containing PDF ID
 * @param request - NextRequest with JSON body containing fields to update
 * @returns JSON response with updated PDF metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    // Verify authentication
    const auth = await getCurrentUser(request)
    if (!auth) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.UNAUTHORIZED }, 
        { status: 401 }
      )
    }

    // Check admin access
    if (!isAdminAllowed(auth.email, auth.role)) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.FORBIDDEN }, 
        { status: 403 }
      )
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
      where: { id },
      data: updateData,
      include: {
        subject: true,
      },
    })

    logger.info('PDF updated', { pdfId: id, updatedFields: Object.keys(updateData) })

    return NextResponse.json({
      success: true,
      pdf,
      message: UPLOAD_SUCCESS_MESSAGES.UPDATE_SUCCESS,
    })
  } catch (error) {
    logger.error('Updating PDF', error, { pdfId: id })
    return NextResponse.json(
      { error: 'Failed to update PDF' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/pdfs/[id]
 * Delete PDF file from R2 storage and database
 * 
 * @param params - Route params containing PDF ID
 * @returns JSON response confirming deletion
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    // Verify authentication
    const auth = await getCurrentUser(request)
    if (!auth) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.UNAUTHORIZED }, 
        { status: 401 }
      )
    }

    // Check admin access
    if (!isAdminAllowed(auth.email, auth.role)) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.FORBIDDEN }, 
        { status: 403 }
      )
    }

    // Get PDF to get r2Key
    const pdf = await prisma.pDF.findUnique({
      where: { id },
    })

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Delete from R2
    const r2Service = getR2Service()
    await r2Service.deleteFile(pdf.r2Key)

    // Delete from database
    await prisma.pDF.delete({
      where: { id },
    })

    logger.info('PDF deleted', { pdfId: id, r2Key: pdf.r2Key })

    return NextResponse.json({
      success: true,
      message: UPLOAD_SUCCESS_MESSAGES.DELETE_SUCCESS,
    })
  } catch (error) {
    logger.error('Deleting PDF', error, { pdfId: id })
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    )
  }
}
