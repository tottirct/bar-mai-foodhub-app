import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {
        const { shopid } = await params;
        const shopID = parseInt(shopid);
        const menus = await prisma.menu.findMany({
            where: {
                shopId: shopID
            }
        });

        return NextResponse.json({
            success: true,
            data: menus
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 })
    }
}