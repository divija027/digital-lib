import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Temporarily disable all middleware protection for debugging
  console.log('Middleware bypassed for debugging')
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/resources/:path*', '/api/categories/:path*', '/api/subjects/:path*']
}
