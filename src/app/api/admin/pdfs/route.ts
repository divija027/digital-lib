import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getR2Service } from '@/lib/r2-client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdminAllowed } from '@/lib/admin-rbac'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds for large file uploads

// GET - List all PDFs with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const semester = searchParams.get('semester')
    const subjectId = searchParams.get('subjectId')
    const featured = searchParams.get('featured')

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
    console.error('Error fetching PDFs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    )
  }
}

// POST - Upload new PDF
export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const branch = formData.get('branch') as string
    const semester = formData.get('semester') as string
    const subjectId = formData.get('subjectId') as string
    const featured = formData.get('featured') === 'true'

    // Validate required fields
    if (!file || !title || !branch || !semester || !subjectId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type (only PDF)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      )
    }

    // Verify subject exists (check Category table since subjects are stored there)
    const subject = await prisma.category.findUnique({
      where: { id: subjectId },
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found. Please select a valid subject.' },
        { status: 404 }
      )
    }

    // Extract subject metadata
    let subjectMetadata: any = {}
    try {
      if (subject.description) {
        subjectMetadata = JSON.parse(subject.description)
      }
    } catch {
      subjectMetadata = {}
    }

    const subjectName = subjectMetadata.subjectName || subject.name
    const subjectCode = subjectMetadata.subjectCode || ''

    // Generate unique R2 key (this is the unique ID)
    const uniqueId = nanoid(16)
    const r2Key = `${uniqueId}.pdf` // Just the unique ID + extension, no directories

    // Get R2 service
    const r2Service = getR2Service()

    // Upload file to R2
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate presigned URL for upload
    const uploadUrl = await r2Service.generatePresignedUploadUrl(
      r2Key,
      'application/pdf',
      300 // 5 minutes
    )

    // Upload to R2 using presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to R2')
    }

    // Check if we need to create a Subject record for this category
    let actualSubjectId = subjectId
    
    // Try to find if Subject already exists with this code
    let subjectRecord = await prisma.subject.findFirst({
      where: {
        code: subjectCode,
        semester: parseInt(semester),
      }
    })

    // If not, create one from the category data
    if (!subjectRecord && subjectName && subjectCode) {
      try {
        subjectRecord = await prisma.subject.create({
          data: {
            name: subjectName,
            code: subjectCode,
            semester: parseInt(semester),
            description: subjectMetadata.subjectDescription || null,
          }
        })
        actualSubjectId = subjectRecord.id
      } catch (createError: any) {
        console.error('Error creating subject record:', createError)
        // If creation fails (e.g., duplicate), try to find again
        const existingSubject = await prisma.subject.findFirst({
          where: {
            OR: [
              { code: subjectCode },
              { name: subjectName }
            ]
          }
        })
        if (existingSubject) {
          actualSubjectId = existingSubject.id
        } else {
          throw new Error(`Failed to create or find subject record: ${createError.message}`)
        }
      }
    } else if (subjectRecord) {
      actualSubjectId = subjectRecord.id
    }

    // Save metadata to database with the unique r2Key as ID
    // @ts-ignore - Prisma client type issue, will work at runtime
    const pdf = await prisma.pDF.create({
      data: {
        title,
        description: description || null,
        fileName: file.name,
        fileSize: file.size,
        r2Key, // This is the unique ID
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

    return NextResponse.json({
      success: true,
      pdf,
      message: 'PDF uploaded successfully',
    })
  } catch (error) {
    console.error('Error uploading PDF:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload PDF' },
      { status: 500 }
    )
  }
}
