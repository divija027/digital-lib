import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Testing login for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found',
        email 
      })
    }
    
    // Test password
    const isValid = await verifyPassword(password, user.password)
    
    return NextResponse.json({
      success: true,
      message: 'User found and password checked',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordValid: isValid
    })
    
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
