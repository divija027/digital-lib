import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const subjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  semester: z.number().int().min(1).max(8),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')

    const where = semester ? { semester: parseInt(semester) } : {}

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        _count: {
          select: { resources: true }
        }
      },
      orderBy: [{ semester: 'asc' }, { name: 'asc' }]
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Get subjects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, code, semester, description } = subjectSchema.parse(body)

    const subject = await prisma.subject.create({
      data: { name, code, semester, description }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create subject error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
