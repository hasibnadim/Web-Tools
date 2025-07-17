import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/sea',
]

// Define public routes that don't need authentication (for future use)
// const publicRoutes = [
//   '/',
//   '/auth/login',
//   '/auth/register',
// ]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('baw_user_token')

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the route is public (for future use)
  // const isPublicRoute = publicRoutes.some(route => 
  //   pathname === route
  // )

  // If accessing a protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login/register with valid token, redirect to profile
  if ((pathname === '/auth/login' || pathname === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://accounts.google.com",
    "frame-src https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 