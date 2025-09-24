import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { setVerificationToken } from '@/lib/auth-tokens'

// Request validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  collegeName: z.string().min(2, 'College name must be at least 2 characters'),
})

/**
 * POST /api/auth/register
 * Registers a new user and sends email verification
 * 
 * @param request - Next.js request object containing user registration data
 * @returns JSON response with user data and email status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, collegeName } = registerSchema.parse(body)

    console.log(`Registration attempt for email: ${email}`)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`Registration failed: User already exists for email: ${email}`)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        collegeName,
        role: 'STUDENT',
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        collegeName: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    })

    console.log(`User created successfully: ${user.email}`)

    // Generate and set verification token
    const tokenData = await setVerificationToken(user.id)

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email, 
      user.name || 'User', 
      tokenData.token
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // User is created but email failed - they can still request verification later
    }

    console.log(`Registration completed for: ${user.email}, Email sent: ${emailResult.success}`)

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.',
        user,
        emailSent: emailResult.success
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
