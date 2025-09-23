import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { isAdminAllowed } from '@/lib/admin-rbac'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    if (!isAdminAllowed(user.email, user.role)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    )
  }
}