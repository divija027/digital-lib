import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { findUserByResetToken, clearPasswordResetToken } from '@/lib/auth-tokens'

// Request validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

/**
 * POST /api/auth/reset-password
 * Resets user password using a valid reset token
 * 
 * @param request - Next.js request object containing token and new password
 * @returns JSON response with success/error status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    console.log('Password reset attempt with token:', token.substring(0, 8) + '...')

    // Find user with valid reset token
    const user = await findUserByResetToken(token)

    if (!user) {
      console.log('Password reset failed: Invalid or expired token')
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await clearPasswordResetToken(user.id, hashedPassword)

    console.log(`Password reset successful for user: ${user.email}`)

    return NextResponse.json({
      message: 'Password has been reset successfully',
      success: true
    })

  } catch (error) {
    console.error('Reset password error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}