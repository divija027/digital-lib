import { NextRequest, NextResponse } from 'next/server'
import { R2Service, validateFile, generateFileKey } from '@/lib/r2-client'
import { PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * Blog Image Proxy Upload API
 * 
 * Fallback upload method that proxies file uploads through the server
 * to R2 storage when direct presigned URL uploads fail.
 */

/**
 * POST: Upload image via server proxy to R2 storage
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    validateFile({ name: file.name, size: file.size, type: file.type })

    const key = generateFileKey(file.name, 'blog-images')
    const r2 = new R2Service()
    const buffer = Buffer.from(await file.arrayBuffer())

    const config = {
      region: process.env.R2_REGION || 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    }

    const { S3Client } = await import('@aws-sdk/client-s3')
    const client = new S3Client(config)

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })

    await client.send(command)

    const publicUrl = r2.getPublicUrl(key)

    return NextResponse.json({
      success: true,
      data: {
        publicUrl,
        key,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      },
    })
  } catch (error) {
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
        error: 'Failed to upload file' 
      },
      { status: 500 }
    )
  }
}