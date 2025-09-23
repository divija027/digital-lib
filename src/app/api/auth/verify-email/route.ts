import { NextRequest, NextResponse } from 'next/server'
import { findUserByVerificationToken, verifyUserEmail } from '@/lib/auth-tokens'

/**
 * GET /api/auth/verify-email
 * Verifies a user's email address using a verification token
 * 
 * @param request - Next.js request object containing token in search params
 * @returns Redirects to login page with success/error status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Validate token parameter
    if (!token) {
      console.log('Email verification failed: Missing token')
      return NextResponse.redirect(
        new URL('/login?error=missing-token', request.url)
      )
    }

    // Find user with valid verification token
    const user = await findUserByVerificationToken(token)

    if (!user) {
      console.log('Email verification failed: Invalid or expired token')
      return NextResponse.redirect(
        new URL('/login?error=invalid-token', request.url)
      )
    }

    // Mark email as verified and clear token
    await verifyUserEmail(user.id)

    console.log(`Email verified successfully for user: ${user.email}`)
    
    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?verified=true', request.url)
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(
      new URL('/login?error=verification-failed', request.url)
    )
  }
}

/**
 * POST /api/auth/verify-email
 * Alternative endpoint for email verification (for programmatic use)
 * 
 * @param request - Next.js request object containing token in body
 * @returns JSON response with success/error status
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    const user = await findUserByVerificationToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    await verifyUserEmail(user.id)

    console.log(`Email verified successfully for user: ${user.email}`)

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  }
}