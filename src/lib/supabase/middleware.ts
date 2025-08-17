import { createMiddlewareClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    // Create a response object to pass to the middleware client
    const { supabase, response } = createMiddlewareClient(request)

    // Refresh the user's session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error refreshing session:', error.message)
      return response
    }

    // Get the current path
    const url = request.nextUrl.clone()
    const pathname = url.pathname

    // Define protected routes that require authentication
    const protectedRoutes = [
      '/dashboard',
      '/onboarding',
      '/auth/logout'
    ]

    // Define auth routes that should redirect if already authenticated
    const authRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/reset-password'
    ]

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )

    // If accessing a protected route without a session, redirect to login
    if (isProtectedRoute && !session) {
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    // If accessing an auth route with a session, redirect to dashboard
    if (isAuthRoute && session) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Special handling for root path
    if (pathname === '/' && session) {
      // Check if user has completed onboarding
      const { data: userProfile } = await supabase
        .from('sg_users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userProfile) {
        // Check if user has any projects
        const { data: projects } = await supabase
          .from('sg_projects')
          .select('id')
          .eq('org_id', userProfile.org_id)
          .limit(1)

        if (projects && projects.length > 0) {
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        } else {
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}