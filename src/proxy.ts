import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(req: NextRequest) {
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
/*
    if (pathname.startsWith('/api/menus')) {
        if (role !== 'OWNER' && role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Owner role required' }, { status: 403 });
        }
    }
*/

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/owner') && role !== 'OWNER') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/customer') && role !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/owner/:path*', '/customer/:path*',  /*'/api/menus/:path*'*/],
};