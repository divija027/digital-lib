import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params

    // Get subjects for this branch
    // In this implementation, we'll store subjects as categories with a specific naming pattern
    // and metadata to link them to branches
    const subjects = await prisma.category.findMany({
      where: {
        name: {
          startsWith: `BRANCH_${branchId}_SUBJECT_`
        }
      },
      orderBy: [
        { createdAt: 'asc' }
      ]
    })

    const formattedSubjects = subjects.map(subject => {
      let metadata: any = {}
      try {
        if (subject.description) {
          metadata = JSON.parse(subject.description)
        }
      } catch (e) {
        metadata = {}
      }

      return {
        id: subject.id,
        name: metadata.subjectName || subject.name.replace(`BRANCH_${branchId}_SUBJECT_`, ''),
        code: metadata.subjectCode || '',
        description: metadata.subjectDescription || '',
        semester: metadata.semester || 1,
        credits: metadata.credits || 3,
        isCore: metadata.isCore !== false,
        isActive: metadata.isActive !== false,
        branchId: branchId,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt
      }
    })

    return Response.json({
      success: true,
      subjects: formattedSubjects
    })

  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch subjects' 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params
    const body = await request.json()
    const { name, code, description, semester, credits, isCore } = body

    if (!name || !code) {
      return Response.json({ 
        success: false, 
        error: 'Subject name and code are required' 
      }, { status: 400 })
    }

    // Check if subject code already exists for this branch
    const existingSubject = await prisma.category.findFirst({
      where: {
        name: {
          startsWith: `BRANCH_${branchId}_SUBJECT_`
        },
        description: {
          contains: `"subjectCode":"${code.toUpperCase()}"`
        }
      }
    })

    if (existingSubject) {
      return Response.json({ 
        success: false, 
        error: 'Subject code already exists for this branch' 
      }, { status: 400 })
    }

    // Create subject metadata
    const metadata = {
      subjectName: name,
      subjectCode: code.toUpperCase(),
      subjectDescription: description || '',
      semester: parseInt(semester) || 1,
      credits: parseInt(credits) || 3,
      isCore: isCore !== false,
      isActive: true,
      type: 'subject',
      branchId: branchId
    }

    // Create the subject as a category
    const newSubject = await prisma.category.create({
      data: {
        name: `BRANCH_${branchId}_SUBJECT_${code.toUpperCase()}`,
        description: JSON.stringify(metadata)
      }
    })

    return Response.json({
      success: true,
      subject: {
        id: newSubject.id,
        name: metadata.subjectName,
        code: metadata.subjectCode,
        description: metadata.subjectDescription,
        semester: metadata.semester,
        credits: metadata.credits,
        isCore: metadata.isCore,
        isActive: metadata.isActive,
        branchId: branchId,
        createdAt: newSubject.createdAt,
        updatedAt: newSubject.updatedAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create subject:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to create subject' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: branchId } = await params
    const body = await request.json()
    const { id, name, code, description, semester, credits, isCore } = body

    if (!id || !name || !code) {
      return Response.json({ 
        success: false, 
        error: 'Subject ID, name and code are required' 
      }, { status: 400 })
    }

    // Check if subject exists
    const existingSubject = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingSubject) {
      return Response.json({ 
        success: false, 
        error: 'Subject not found' 
      }, { status: 404 })
    }

    // Check if new subject code conflicts with existing subjects (excluding current one)
    const conflictingSubject = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: {
          startsWith: `BRANCH_${branchId}_SUBJECT_`
        },
        description: {
          contains: `"subjectCode":"${code.toUpperCase()}"`
        }
      }
    })

    if (conflictingSubject) {
      return Response.json({ 
        success: false, 
        error: 'Subject code already exists for this branch' 
      }, { status: 400 })
    }

    // Parse existing metadata
    let metadata: any = {}
    try {
      if (existingSubject.description) {
        metadata = JSON.parse(existingSubject.description)
      }
    } catch (e) {
      metadata = {}
    }

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      subjectName: name,
      subjectCode: code.toUpperCase(),
      subjectDescription: description || '',
      semester: parseInt(semester) || 1,
      credits: parseInt(credits) || 3,
      isCore: isCore !== false,
      branchId: branchId
    }

    // Update the subject
    const updatedSubject = await prisma.category.update({
      where: { id },
      data: {
        name: `BRANCH_${branchId}_SUBJECT_${code.toUpperCase()}`,
        description: JSON.stringify(updatedMetadata)
      }
    })

    return Response.json({
      success: true,
      subject: {
        id: updatedSubject.id,
        name: updatedMetadata.subjectName,
        code: updatedMetadata.subjectCode,
        description: updatedMetadata.subjectDescription,
        semester: updatedMetadata.semester,
        credits: updatedMetadata.credits,
        isCore: updatedMetadata.isCore,
        isActive: updatedMetadata.isActive,
        branchId: branchId,
        createdAt: updatedSubject.createdAt,
        updatedAt: updatedSubject.updatedAt
      }
    })

  } catch (error) {
    console.error('Failed to update subject:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to update subject' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return Response.json({ 
        success: false, 
        error: 'Subject ID is required' 
      }, { status: 400 })
    }

    // Check if subject exists
    const existingSubject = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingSubject) {
      return Response.json({ 
        success: false, 
        error: 'Subject not found' 
      }, { status: 404 })
    }

    // Delete the subject
    await prisma.category.delete({
      where: { id }
    })

    return Response.json({
      success: true,
      message: 'Subject deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete subject:', error)
    return Response.json({ 
      success: false, 
      error: 'Failed to delete subject' 
    }, { status: 500 })
  }
}
