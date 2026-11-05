import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Supabase Session Management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Admin Route Protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If user is not logged in and tries to access an admin route other than login, redirect to login
    if (!user && request.nextUrl.pathname !== '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    // If user is logged in and visits /admin/login, redirect to /admin
    if (user && request.nextUrl.pathname === '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    return response
  }

  // 3. i18n Routing (for non-admin, non-api, non-static routes)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isNextAuthOrStatic = request.nextUrl.pathname.match(/\.(.*)$/) || request.nextUrl.pathname.startsWith('/_next')

  if (!isApiRoute && !isNextAuthOrStatic) {
    const intlResponse = handleI18nRouting(request)
    
    // Copy supabase cookies over to intl response to preserve session refreshes
    if (intlResponse) {
      const responseCookies = response.cookies.getAll()
      responseCookies.forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value)
      })
      return intlResponse
    }
  }

  return response
}

export const config = {
  // Match everything except api, _next, and static files with extensions
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
