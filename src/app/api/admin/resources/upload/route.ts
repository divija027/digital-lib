import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const branch = formData.get('branch') as string
    const semester = formData.get('semester') as string
    const subject = formData.get('subject') as string
    const examYear = formData.get('examYear') as string
    const examMonth = formData.get('examMonth') as string
    const schemeYear = formData.get('schemeYear') as string
    const paperType = formData.get('paperType') as string
    const questionType = formData.get('questionType') as string
    const description = formData.get('description') as string

    // Validate required fields
    if (!file || !title || !branch || !semester || !subject || !examYear || !examMonth || !schemeYear) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return Response.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Validate file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      return Response.json({ error: 'File size must be less than 25MB' }, { status: 400 })
    }

    // Create uploads directory structure: uploads/branch/semester/subject/
    const uploadDir = path.join(process.cwd(), 'uploads', branch, semester, subject)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const sanitizedFileName = `${branch}_${semester}_${subject}_${examMonth}_${examYear}_${paperType}${fileExtension}`
    const fileName = `${timestamp}-${sanitizedFileName}`
    const filePath = path.join(uploadDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create database record
    try {
      // First, try to find or create the category for the branch
      let category = await prisma.category.findFirst({
        where: { name: branch }
      })

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: branch,
            description: `${branch} Engineering question papers and resources`
          }
        })
      }

      // Try to find or create the subject
      let subjectRecord = await prisma.subject.findFirst({
        where: { 
          name: subject,
          semester: parseInt(semester)
        }
      })

      if (!subjectRecord) {
        subjectRecord = await prisma.subject.create({
          data: {
            name: subject,
            code: subject.replace(/\s+/g, '').toUpperCase(),
            semester: parseInt(semester)
          }
        })
      }

      // Create the resource record
      const resource = await prisma.resource.create({
        data: {
          title,
          description: description || '',
          fileName,
          filePath: path.relative(process.cwd(), filePath),
          fileSize: file.size,
          mimeType: file.type,
          categoryId: category.id,
          subjectId: subjectRecord.id,
          type: questionType === 'Question Paper' ? 'QUESTION_PAPER' : 
                questionType === 'Previous Year Paper' ? 'PREVIOUS_YEAR_PAPER' :
                questionType === 'Study Material' ? 'STUDY_MATERIAL' :
                questionType === 'Notes' ? 'NOTES' :
                questionType === 'Syllabus' ? 'SYLLABUS' : 'OTHER',
          uploadedBy: 'admin_user', // Since we removed auth, use a default admin ID
          isActive: true,
          semester: parseInt(semester)
        }
      })

      return Response.json({
        message: 'Question paper uploaded successfully',
        resource: {
          id: resource.id,
          title: resource.title,
          fileName: resource.fileName,
          category: category.name,
          subject: subjectRecord.name
        }
      }, { status: 201 })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return Response.json({ error: 'Failed to save to database' }, { status: 500 })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const semester = searchParams.get('semester')
    const subject = searchParams.get('subject')
    const questionType = searchParams.get('questionType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      isActive: true
    }

    // Apply filters based on metadata
    if (branch || semester || subject || questionType) {
      where.metadata = {}
      
      if (branch) {
        where.metadata.path = ['branch']
        where.metadata.equals = branch
      }
    }

    const [resources, totalCount] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          category: true,
          subject: true,
          uploader: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.resource.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return Response.json({
      resources,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Fetch resources error:', error)
    return Response.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
