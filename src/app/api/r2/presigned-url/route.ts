import { NextRequest, NextResponse } from 'next/server'
import { getR2Service, validateFile, generateFileKey, R2ValidationError, R2ConfigError } from '@/lib/r2-client'
import { z } from 'zod'

// Request validation schema
const presignedUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().min(1).max(50 * 1024 * 1024), // 50MB max
  contentType: z.string().min(1),
  category: z.string().optional().default('uploads'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { fileName, fileSize, contentType, category } = presignedUrlSchema.parse(body)

    // Validate file type and size
    validateFile({
      name: fileName,
      size: fileSize,
      type: contentType,
    })

    // Generate unique file key
    const fileKey = generateFileKey(fileName, category)

    // Get R2 service and generate presigned URL
    const r2Service = getR2Service()
    const presignedUrl = await r2Service.generatePresignedUploadUrl(
      fileKey,
      contentType,
      3600 // 1 hour expiration
    )

    // Generate public URL for after upload
    const publicUrl = r2Service.getPublicUrl(fileKey)

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        fileKey,
        publicUrl,
        expiresIn: 3600,
      },
    })

  } catch (error) {
    console.error('Presigned URL generation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof R2ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }

    if (error instanceof R2ConfigError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate upload URL',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve file info (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileKey = searchParams.get('key')

    if (!fileKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'File key is required',
        },
        { status: 400 }
      )
    }

    const r2Service = getR2Service()

    // Generate a temporary download URL
    const downloadUrl = await r2Service.generatePresignedDownloadUrl(fileKey, 3600)
    const publicUrl = r2Service.getPublicUrl(fileKey)

    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        downloadUrl,
        publicUrl,
        expiresIn: 3600,
      },
    })

  } catch (error) {
    console.error('File info retrieval error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve file information',
      },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileKey = searchParams.get('key')

    if (!fileKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'File key is required',
        },
        { status: 400 }
      )
    }

    const r2Service = getR2Service()
    await r2Service.deleteFile(fileKey)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })

  } catch (error) {
    console.error('File deletion error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete file',
      },
      { status: 500 }
    )
  }
}