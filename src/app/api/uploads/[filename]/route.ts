import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // Optional: Add authentication check
    // const user = await getCurrentUser(request)
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const filename = params.filename
    const filePath = join(process.cwd(), 'uploads', filename)

    try {
      const fileBuffer = await readFile(filePath)
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase()
      const contentType = getContentType(ext)

      // Check if this is a view request vs download request
      const isViewRequest = request.nextUrl.searchParams.get('view') === 'true'
      const disposition = isViewRequest 
        ? `inline; filename="${filename}"`
        : `attachment; filename="${filename}"`

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': disposition,
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      })
    } catch (fileError) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getContentType(extension?: string): string {
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
  }

  return mimeTypes[extension || ''] || 'application/octet-stream'
}
