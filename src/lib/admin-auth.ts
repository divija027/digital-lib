import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { isAdminAllowed } from '@/lib/admin-rbac'

interface JWTPayload {
  userId: string
  email: string
  role: string
}

/**
 * Verify admin token and check permissions
 * @param request - Next.js request object
 * @returns User object if valid admin, null otherwise
 */
export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      return null
    }
    
    // Check admin permissions
    if (!isAdminAllowed(user.email, user.role)) {
      return null
    }

    return user
  } catch (error) {
    console.error('Admin token verification failed:', error)
    return null
  }
}

export function createAdminResponse(message: string, status: number = 404) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}
