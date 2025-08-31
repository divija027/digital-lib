import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, createAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { collegeName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role && role !== 'all') {
      where.role = role.toUpperCase()
    }

    // Get users with pagination
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { uploadedResources: true }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Get user statistics
    const [totalStudents, totalAdmins] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } })
    ])

    const totalPages = Math.ceil(totalUsers / limit)

    return Response.json({
      users: users.map(user => ({
        ...user,
        resourceCount: user._count.uploadedResources
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins
      }
    })

  } catch (error) {
    console.error('Users API error:', error)
    return createAdminResponse('Failed to fetch users', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return createAdminResponse('Admin access required')
    }

    const body = await request.json()
    const { email, name, collegeName, role, password } = body

    // Validate required fields
    if (!email || !name || !password) {
      return createAdminResponse('Email, name, and password are required', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return createAdminResponse('User with this email already exists', 400)
    }

    // Hash password (using bcryptjs which is already installed)
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        collegeName,
        role: role || 'STUDENT',
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        collegeName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return Response.json(newUser, { status: 201 })

  } catch (error) {
    console.error('Create user API error:', error)
    return createAdminResponse('Failed to create user', 500)
  }
}
