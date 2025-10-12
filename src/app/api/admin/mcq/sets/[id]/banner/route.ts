import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { R2Service, validateFile, generateFileKey } from '@/lib/r2-client'

/**
 * POST: Upload banner image for an MCQ set
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get the MCQ set
    const mcqSet = await prisma.mCQSet.findUnique({
      where: { id },
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'MCQ set not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('banner') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Delete old banner if exists
    if (mcqSet.bannerImage) {
      try {
        const r2 = new R2Service()
        // Extract key from URL
        const oldKey = mcqSet.bannerImage.split('/').slice(-3).join('/')
        await r2.deleteFile(oldKey)
      } catch (error) {
        console.error('Failed to delete old banner:', error)
        // Continue with upload even if deletion fails
      }
    }

    // Generate file key and upload to R2
    const r2 = new R2Service()
    const key = generateFileKey(file.name, 'mcq-banners')
    
    // Get presigned URL
    const presignedUrl = await r2.generatePresignedUploadUrl(key, file.type)
    
    // Upload file to R2
    const buffer = await file.arrayBuffer()
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to R2')
    }

    // Get public URL
    const publicUrl = r2.getPublicUrl(key)

    // Update MCQ set with banner URL
    const updatedSet = await prisma.mCQSet.update({
      where: { id },
      data: { bannerImage: publicUrl },
    })

    return NextResponse.json({
      success: true,
      data: {
        bannerImage: publicUrl,
        mcqSet: updatedSet,
      },
    })
  } catch (error) {
    console.error('Banner upload error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload banner image' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove banner image from an MCQ set
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get the MCQ set
    const mcqSet = await prisma.mCQSet.findUnique({
      where: { id },
    })

    if (!mcqSet) {
      return NextResponse.json(
        { error: 'MCQ set not found' },
        { status: 404 }
      )
    }

    if (!mcqSet.bannerImage) {
      return NextResponse.json(
        { error: 'No banner image to delete' },
        { status: 400 }
      )
    }

    // Delete from R2
    try {
      const r2 = new R2Service()
      const key = mcqSet.bannerImage.split('/').slice(-3).join('/')
      await r2.deleteFile(key)
    } catch (error) {
      console.error('Failed to delete banner from R2:', error)
      // Continue with database update even if R2 deletion fails
    }

    // Update MCQ set to remove banner
    const updatedSet = await prisma.mCQSet.update({
      where: { id },
      data: { bannerImage: null },
    })

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
      data: { mcqSet: updatedSet },
    })
  } catch (error) {
    console.error('Banner delete error:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete banner image' },
      { status: 500 }
    )
  }
}
