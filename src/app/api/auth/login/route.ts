import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { isAdminAllowed } from '@/lib/admin-rbac'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[SECURITY] Login attempt for:', body.email)
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('[SECURITY] User found:', user ? 'Yes' : 'No')
    if (!user) {
      console.log(`[SECURITY] Login failed - user not found: ${email}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if email is verified (exempt admin and superadmin emails)
    const exemptEmails = ['admin@gmail.com', 'superadmin@gmail.com']
    if (!user.emailVerified && !exemptEmails.includes(email.toLowerCase())) {
      console.log(`[SECURITY] Login failed - email not verified: ${email}`)
      return NextResponse.json(
        { 
          error: 'Email not verified. Please check your email and click the verification link before logging in.',
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('[SECURITY] Password valid:', isValidPassword)
    if (!isValidPassword) {
      console.log(`[SECURITY] Login failed - invalid password: ${email}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // STRICT RBAC: Check if this is an admin login attempt
    const isAdminRoute = request.headers.get('referer')?.includes('/admin/login')
    
    if (isAdminRoute) {
      // For admin routes, enforce STRICT RBAC
      if (!isAdminAllowed(user.email, user.role)) {
        console.log(`[SECURITY] Admin login BLOCKED - not in whitelist: ${user.email}/${user.role}`)
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
      console.log(`[SECURITY] Admin login APPROVED: ${user.email}/${user.role}`)
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    console.log('[SECURITY] Token generated, user role:', user.role)

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })

    // Set HTTP-only cookie with strict security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // More strict for admin security
      maxAge: 60 * 60 * 24 * 1, // Shorter session for admins: 1 day
      path: '/'
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[SECURITY] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
