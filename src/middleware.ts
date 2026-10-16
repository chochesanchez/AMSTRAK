import { NextResponse, type NextRequest } from 'next/server'

// "/es/..." is served as-is; "/en/..." redirects to the unprefixed URL; everything else is English.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/es' || pathname.startsWith('/es/')) return NextResponse.next()
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }
  const url = req.nextUrl.clone()
  url.pathname = `/en${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next|images|.*\\..*).*)'],
}
