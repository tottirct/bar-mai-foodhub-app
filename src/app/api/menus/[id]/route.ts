import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const { id } = await params;
        const menuId = parseInt(id);

        const menu = await prisma.menu.findUnique({
            where: { id: menuId },
            include: {
                options: true,
                shop: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(!menu) {
            return NextResponse.json({ success: false, message: "หาเมนูไม่เจอหวะ "}, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: menu
        });
    } catch(error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"}, {status: 500})
    }
}
