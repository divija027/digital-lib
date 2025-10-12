import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getR2Service } from '@/lib/r2-client'

// GET - Get PDFs for a specific branch/semester/subject (for students)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const semester = searchParams.get('semester')
    const subjectId = searchParams.get('subjectId')

    const where: any = {}
    if (branch) where.branch = branch
    if (semester) where.semester = parseInt(semester)
    if (subjectId) where.subjectId = subjectId

    const pdfs = await prisma.pDF.findMany({
      where,
      include: {
        subject: true,
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Generate download URLs for each PDF
    const r2Service = getR2Service()
    const pdfsWithUrls = await Promise.all(
      pdfs.map(async (pdf) => {
        const downloadUrl = await r2Service.generatePresignedDownloadUrl(
          pdf.r2Key,
          3600 // 1 hour
        )
        return {
          ...pdf,
          downloadUrl,
        }
      })
    )

    return NextResponse.json(pdfsWithUrls)
  } catch (error) {
    console.error('Error fetching PDFs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    )
  }
}
