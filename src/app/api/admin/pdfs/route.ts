import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getR2Service, createR2Client, getR2Config } from '@/lib/r2-client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdminAllowed } from '@/lib/admin-rbac'
import {
  MAX_PDF_SIZE,
  ALLOWED_MIME_TYPES,
  UPLOAD_ERROR_MESSAGES,
  UPLOAD_SUCCESS_MESSAGES,
} from '@/lib/constants/upload'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds for large file uploads

/**
 * Logger utility for structured error logging
 */
const logger = {
  error: (context: string, error: unknown, metadata?: Record<string, any>) => {
    console.error(`[PDF API Error] ${context}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...metadata,
    })
  },
  info: (message: string, metadata?: Record<string, any>) => {
    console.log(`[PDF API] ${message}`, metadata || '')
  },
}

/**
 * GET /api/admin/pdfs
 * List all PDFs with optional filtering by branch, semester, subject, and featured status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const branch = searchParams.get('branch')
  const semester = searchParams.get('semester')
  const subjectId = searchParams.get('subjectId')
  const featured = searchParams.get('featured')

  try {
    const where: any = {}
    if (branch) where.branch = branch
    if (semester) where.semester = parseInt(semester)
    if (subjectId) where.subjectId = subjectId
    if (featured) where.featured = featured === 'true'

    const pdfs = await prisma.pDF.findMany({
      where,
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(pdfs)
  } catch (error) {
    logger.error('Fetching PDFs', error, { branch, semester, subjectId, featured })
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/pdfs
 * Upload a new PDF file to R2 storage and save metadata to database
 * 
 * @param request - NextRequest with FormData containing:
 *   - file: PDF file (required, max 25MB)
 *   - title: PDF title (required)
 *   - description: Optional description
 *   - branch: Branch code (required, e.g., 'CSE', 'ISE')
 *   - semester: Semester number (required, 1-8)
 *   - subjectId: Subject ID (required)
 *   - featured: Boolean flag for featured content (optional)
 * 
 * @returns JSON response with uploaded PDF metadata or error
 * 
 * Process:
 * 1. Authenticate and authorize user
 * 2. Validate form data and file
 * 3. Verify subject exists (Subject table, fallback to Category table)
 * 4. Upload file to R2 storage
 * 5. Save metadata to database
 */
export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const branch = formData.get('branch') as string
    const semester = formData.get('semester') as string
    const subjectId = formData.get('subjectId') as string
    const featured = formData.get('featured') === 'true'

    // Validate required fields
    if (!file || !title || !branch || !semester || !subjectId) {
      const missingFields = []
      if (!file) missingFields.push('file')
      if (!title) missingFields.push('title')
      if (!branch) missingFields.push('branch')
      if (!semester) missingFields.push('semester')
      if (!subjectId) missingFields.push('subjectId')
      
      return NextResponse.json(
        { error: `${UPLOAD_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS}: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== ALLOWED_MIME_TYPES.PDF) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.INVALID_FILE_TYPE },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE },
        { status: 400 }
      )
    }

    // Verify subject exists (check Subject table first, then Category table as fallback)
    let subjectRecord = await prisma.subject.findUnique({
      where: { id: subjectId },
    })

    let subjectName = ''
    let subjectCode = ''

    if (subjectRecord) {
      // Found in Subject table
      subjectName = subjectRecord.name
      subjectCode = subjectRecord.code
    } else {
      // Fallback: check Category table for backwards compatibility
      const categorySubject = await prisma.category.findUnique({
        where: { id: subjectId },
      })

      if (!categorySubject) {
        return NextResponse.json(
          { error: UPLOAD_ERROR_MESSAGES.SUBJECT_NOT_FOUND },
          { status: 404 }
        )
      }

      // Extract subject metadata from category
      let subjectMetadata: any = {}
      try {
        if (categorySubject.description) {
          subjectMetadata = JSON.parse(categorySubject.description)
        }
      } catch {
        subjectMetadata = {}
      }

      subjectName = subjectMetadata.subjectName || categorySubject.name
      subjectCode = subjectMetadata.subjectCode || ''

      // Try to find or create corresponding Subject table entry
      const existingSubject = await prisma.subject.findFirst({
        where: {
          code: subjectCode,
          semester: parseInt(semester),
        }
      })

      if (existingSubject) {
        subjectRecord = existingSubject
      } else if (subjectName && subjectCode) {
        // Create Subject record
        try {
          subjectRecord = await prisma.subject.create({
            data: {
              name: subjectName,
              code: subjectCode,
              semester: parseInt(semester),
              description: subjectMetadata.subjectDescription || null,
            }
          })
        } catch (createError) {
          logger.error('Creating subject record', createError, { 
            subjectName, 
            subjectCode, 
            semester 
          })
          // If creation fails, try to find again (may exist due to race condition)
          const foundSubject = await prisma.subject.findFirst({
            where: {
              OR: [
                { code: subjectCode },
                { name: subjectName }
              ]
            }
          })
          if (foundSubject) {
            subjectRecord = foundSubject
          }
        }
      }
    }

    // Generate unique R2 key
    const uniqueId = nanoid(16)
    const r2Key = `pdfs/${branch}/${semester}/${uniqueId}.pdf`
    const actualFileName = file.name
    const actualFileSize = file.size

    // Upload file to R2 directly using S3 SDK
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
      const r2Client = createR2Client()
      const r2Config = getR2Config()
      
      const uploadCommand = new PutObjectCommand({
        Bucket: r2Config.bucketName,
        Key: r2Key,
        Body: buffer,
        ContentType: ALLOWED_MIME_TYPES.PDF,
      })

      await r2Client.send(uploadCommand)
      logger.info('PDF uploaded to R2', { r2Key, fileName: actualFileName, size: actualFileSize })
    } catch (uploadError) {
      logger.error('R2 upload', uploadError, { r2Key, fileName: actualFileName })
      throw new Error(UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED)
    }

    // Get R2 service for public URL generation
    const r2Service = getR2Service()
    const finalPublicUrl = r2Service.getPublicUrl(r2Key)

    // Use the subjectId from Subject record if available, otherwise use the provided subjectId
    const actualSubjectId = subjectRecord?.id || subjectId

    // Save metadata to database
    const pdf = await prisma.pDF.create({
      data: {
        title,
        description: description || null,
        fileName: actualFileName,
        fileSize: actualFileSize,
        r2Key,
        publicUrl: finalPublicUrl as any, // Type assertion instead of @ts-ignore
        branch,
        semester: parseInt(semester),
        subjectId: actualSubjectId,
        uploadedBy: auth.userId,
        featured,
      },
      include: {
        subject: true,
      },
    })

    logger.info('PDF created in database', { 
      pdfId: pdf.id, 
      title: pdf.title, 
      branch, 
      semester 
    })

    return NextResponse.json({
      success: true,
      pdf,
      message: UPLOAD_SUCCESS_MESSAGES.UPLOAD_SUCCESS,
    })
  } catch (error) {
    logger.error('Uploading PDF', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload PDF' },
      { status: 500 }
    )
  }
}
