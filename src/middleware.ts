import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isPublicRoute = 
        pathname.startsWith('/auth/login') || 
        pathname.startsWith('/auth/register') ||
        pathname === '/';

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  
    const role = (token as any)?.role;

    console.log(`User Accessing: ${pathname}, Role: ${role}`);

    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/user') && role !== 'owner') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/customer') && role !== 'customer') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*', '/customer/:path*'],
};