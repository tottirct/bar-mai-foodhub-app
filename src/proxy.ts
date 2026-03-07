import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    const method = req.method;

    const isPublicRoute =
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/';

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (!token) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const role = (token as any)?.role;

    console.log(`User Accessing: ${pathname} [${method}], Role: ${role}`);

    // Frontend Route Protection
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
        matcher: [
            '/admin/:path*',
            '/owner/:path*',
            '/customer/:path*',
        ],
    };