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

        // API Route Protection
        if (pathname.startsWith('/api/')) {
            
            // --- Admin Routes ---
            if(pathname.startsWith('/api/admins/')) {
                if(role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // --- Menu Routes ---
            if (pathname.match(/^\/api\/menus\/\d+$/)) {
                // GET /api/menus/{menuId} Everyone
            }
            if (pathname.match(/^\/api\/menus\/\d+\/options/)) {
                if (method === 'POST' && role !== 'OWNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                if (method === 'DELETE' && role !== 'OWNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // --- Shop & Order Routes ---
            if (pathname === '/api/my-shop' && method === 'GET') {
                if (role !== 'OWNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            if (pathname === '/api/orders') {
                if (method === 'POST' && role !== 'CUSTOMER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                if (method === 'GET' && role !== 'CUSTOMER' && role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); // Assuming User=Customer
            }

            if (pathname === '/api/shops' && method === 'GET') {
                // Everyone
            }

            if (pathname.match(/^\/api\/shops\/\d+\/transactions/) && method === 'GET') {
                if (role !== 'OWNER' && role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            if (pathname.match(/^\/api\/shops\/\d+\/update-info/)) {
                if(method === 'GET') {
                    if (role !== 'OWNER' && role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
                if(method === 'PATCH') {
                    if (role !== 'OWNER') return NextResponse.json({error: 'Forbidden'},{status:403});
                }
            }

            if (pathname.match(/^\/api\/shops\/\d+\/wallet/) && method === 'POST') {
                if (role !== 'OWNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            if (pathname.match(/^\/api\/shops\/\d+\/menus/)) {
                if (method === 'GET') {
                    // Everyone
                } else if (method === 'POST' || method === 'DELETE' || method === 'PATCH') {
                    if (role !== 'OWNER'){
                        console.log("eiei")
                         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                    }
                }
            }

            if (pathname.match(/^\/api\/shops\/\d+\/menus\/d+/)) {
                if (method === 'PATCH') {
                    if (role !== 'OWNER'){
                        console.log("eiei2")
                         return NextResponse.json({ error: 'Forbidden'},{status:403});
                    }
                }
            }

            if (pathname.match(/^\/api\/shops\/\d+\/orders/)) {
                if (method === 'GET') {
                    if (role !== 'OWNER' && role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                } else if (method === 'PATCH') {
                    if (role !== 'OWNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }

            // --- User Routes ---
            if (pathname === '/api/users/wallet') {
                if ((method === 'GET' || method === 'POST') && role !== 'CUSTOMER') {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }

            if (pathname.match(/^\/api\/users\/\d+\/update-info/)) {
                if(method === 'GET') {
                    if(role !== 'CUSTOMER' && role !== 'ADMIN') {
                        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                    }
                }
                if(method === 'PATCH') {
                    if(role !== 'CUSTOMER') {
                        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                    }
                }
            }

            if (pathname.match(/^\/api\/users\/\d+\/wallet/)) {
                if(method === 'GET') {
                    if(role !== 'CUSTOMER' && role !== 'ADMIN') {
                        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                    }
                }
                if(method === 'POST') {
                    if(role !== 'CUSTOMER') {
                        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                    }
                }
            }
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