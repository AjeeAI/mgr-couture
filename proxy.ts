import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // 1. Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Initialize the Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Check the user's active session
  // This securely pings the Supabase server using the cookies we just parsed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/admin/login')
  const isAdminRoute = pathname.startsWith('/admin')

  // 4. Protection Logic
  // If they are trying to access ANY /admin route (except login) and are NOT logged in
  if (isAdminRoute && !isAuthRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If they are ALREADY logged in and try to go to the login page
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // 5. Return the response (either proceeding to the page or updating cookies)
  return supabaseResponse
}

// 6. Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}