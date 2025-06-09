import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function parseJwt(token: string | undefined) {
  if (!token) return null
  try {
    const base64Payload = token.split('.')[1]
    const jsonPayload = Buffer.from(base64Payload, 'base64').toString('utf-8')
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const decoded = parseJwt(token)
  const role = decoded?.role?.toLowerCase()

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isDashboardPage = pathname.startsWith('/dashboard')

  if (!token) {
    // If unauthenticated, allow only public pages
    if (!isPublicPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // If token exists but role is invalid
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and visiting a public page, redirect to dashboard
  if (isPublicPage) {
    const redirectPath =
      role === 'analyst'
        ? '/dashboard/analyst'
        : role === 'investor'
        ? '/dashboard/investor'
        : '/dashboard'

    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Otherwise (valid token + accessing protected page), allow
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*'],
}
