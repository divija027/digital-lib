import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Admin routes are now public - no authentication required
  console.log('Admin authentication disabled - allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/resources/:path*', '/api/categories/:path*', '/api/subjects/:path*']
}
