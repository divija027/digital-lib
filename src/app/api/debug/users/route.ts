import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@vtu.in' }
    })

    // Get all users for debugging
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      adminExists: !!adminUser,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      } : null,
      allUsers,
      totalUsers: allUsers.length
    })
  } catch (error) {
    console.error('Database verification error:', error)
    return NextResponse.json(
      { error: 'Database error', details: error },
      { status: 500 }
    )
  }
}
