import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { R2Service, validateFile, generateFileKey } from '@/lib/r2-client'

/**
 * Blog Image Upload API
 * 
 * Handles blog image upload, retrieval, and deletion using Cloudflare R2 storage.
 * Supports presigned URL uploads for direct client-to-R2 transfers.
 */

const imageUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().positive('File size must be positive'),
  contentType: z.string().regex(
    /^image\/(jpeg|jpg|png|gif|webp)$/,
    'Only image files are allowed (JPEG, PNG, GIF, WebP)'
  ),
})

const imageDeleteSchema = z.object({
  key: z.string().min(1, 'Image key is required'),
})

/**
 * POST: Generate presigned URL for blog image upload
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, fileSize, contentType } = imageUploadSchema.parse(body)

    validateFile({ name: fileName, size: fileSize, type: contentType })

    const r2 = new R2Service()
    const key = generateFileKey(fileName, 'blog-images')

    const presignedUrl = await r2.generatePresignedUploadUrl(key, contentType)
    const publicUrl = r2.getPublicUrl(key)

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        publicUrl,
        key,
        fileName,
        fileSize,
        contentType,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.issues 
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate upload URL' 
      },
      { status: 500 }
    )
  }
}

/**
 * GET: Retrieve public URL for existing blog image
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Image key is required' 
        },
        { status: 400 }
      )
    }

    const r2 = new R2Service()
    const publicUrl = r2.getPublicUrl(key)

    return NextResponse.json({
      success: true,
      data: {
        publicUrl,
        key,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get image URL' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove blog image from R2 storage
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    const { key: validatedKey } = imageDeleteSchema.parse({ key })

    const r2 = new R2Service()
    await r2.deleteFile(validatedKey)

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        key: validatedKey,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.issues 
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete image' 
      },
      { status: 500 }
    )
  }
}