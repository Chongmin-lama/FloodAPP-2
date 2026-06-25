import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const role = request.cookies.get('user_role')?.value;
    const path = request.nextUrl.pathname;

    if (path.startsWith('/admin') && role !== 'admin')
        return NextResponse.redirect(new URL('/login', request.url));

    if (path.startsWith('/authority') && role !== 'authority' && role !== 'admin')
        return NextResponse.redirect(new URL('/login', request.url));

    if (path.startsWith('/citizen') && !role)
        return NextResponse.redirect(new URL('/login', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/authority/:path*', '/citizen/:path*']
};