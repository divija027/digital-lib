import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByEmail, setPasswordResetToken } from '@/lib/auth-tokens'
import { sendPasswordResetEmail } from '@/lib/email'

// Request validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

/**
 * POST /api/auth/forgot-password
 * Initiates password reset process by sending reset email
 * 
 * @param request - Next.js request object containing user email
 * @returns JSON response (always success to prevent email enumeration)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    console.log(`Password reset requested for email: ${email}`)

    // Find user by email (select only necessary fields)
    const user = await findUserByEmail(email)

    // Always return success message to prevent email enumeration attacks
    const successMessage = 'If an account with this email exists and is verified, you will receive password reset instructions.'

    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`)
      return NextResponse.json({ 
        message: successMessage,
        success: true 
      })
    }

    // Check if email is verified (exempt admin and superadmin emails)
    const exemptEmails = ['admin@gmail.com', 'superadmin@gmail.com']
    if (!user.emailVerified && !exemptEmails.includes(email.toLowerCase())) {
      console.log(`Password reset denied - email not verified: ${email}`)
      return NextResponse.json({ 
        message: successMessage,
        success: true 
      })
    }

    // Generate and save password reset token
    const tokenData = await setPasswordResetToken(user.id)

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email, 
      user.name || 'User', 
      tokenData.token
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    console.log(`Password reset email sent successfully to: ${user.email}`)
    
    return NextResponse.json({
      message: successMessage,
      success: true 
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
