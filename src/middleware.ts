import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow access to admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Check for auth token presence
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return new NextResponse(null, { status: 404 })
    }
    
    // Let client-side handle detailed validation
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/resources/:path*', '/api/categories/:path*', '/api/subjects/:path*']
}
