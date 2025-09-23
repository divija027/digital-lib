import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByEmail, setVerificationToken } from '@/lib/auth-tokens'
import { sendVerificationEmail } from '@/lib/email'

// Request validation schema
const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
})

/**
 * POST /api/auth/resend-verification
 * Resends email verification link to user
 * 
 * @param request - Next.js request object containing user email
 * @returns JSON response (always success to prevent email enumeration)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendSchema.parse(body)

    console.log(`Verification email resend requested for: ${email}`)

    // Find user by email
    const user = await findUserByEmail(email)

    // Standard response message to prevent email enumeration
    const successMessage = 'If an account with that email exists and is not verified, we have sent a verification email.'

    if (!user) {
      console.log(`Resend verification requested for non-existent email: ${email}`)
      return NextResponse.json({ 
        message: successMessage,
        success: true 
      })
    }

    // Check if email is already verified
    if (user.emailVerified) {
      console.log(`Resend verification requested for already verified email: ${email}`)
      return NextResponse.json({
        message: 'Email is already verified',
        success: true
      })
    }

    // Generate new verification token
    const tokenData = await setVerificationToken(user.id)

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email, 
      user.name || 'User', 
      tokenData.token
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    console.log(`Verification email resent successfully to: ${user.email}`)

    return NextResponse.json({ 
      message: successMessage,
      success: true 
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    )
  }
}