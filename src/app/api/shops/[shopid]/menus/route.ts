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

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const { shopId, menuName, price, options } = body;

        if(!menuName || !price || price < 0) {
            return NextResponse.json({sucess: false, message: "เอาดีๆ"},{status: 400});
        }
        if (options && !Array.isArray(options)) {
            return NextResponse.json({ success: false, message: "รูปแบบ options ไม่ถูกต้อง" }, { status: 400 });
        }
    } catch(error) {
        
    }
}