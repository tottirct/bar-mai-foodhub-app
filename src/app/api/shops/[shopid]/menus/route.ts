import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {
        const { shopid } = await params;
        const shopID = parseInt(shopid);
        const menus = await prisma.menu.findMany({
            where: {
                shopId: shopID,
                deletedAt: null,
                shop: {
                    deletedAt: null
                }
            },
            include: {
                isAvailable: true
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
        const { shopId, menuName, price, options, userId } = body;

        if(!menuName || price === undefined || !userId || price < 0) {
            return NextResponse.json({sucess: false, message: "เอาดีๆ"},{status: 400});
        }
        if (options && !Array.isArray(options)) {
            return NextResponse.json({ success: false, message: "รูปแบบ options ไม่ถูกต้อง" }, { status: 400 });
        }

        const targetShop = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        });

        if(!targetShop) {
            return NextResponse.json({ success: false, message: "ร้านค้าปิดไปแล้วหรือหาไม่เจอ" }, { status: 404 });
        }

        const result = await prisma.menu.create({
            data: {
                name: menuName,
                price: price,
                shopId: shopId,
                options: {
                    create: options.map((opt:any) => ({
                        name: opt.name,
                        price: opt.price
                    }))
                }
            },
            include: {
                options: true
                
            }
        });

        await mongo.activityLog.create({
            data: {
                userId: userId,
                shopId: shopId,
                userRole: "OWNER",
                action: "ADD_MENU",
                description: `ร้าน ${shopId} เพิ่มเมนูใหม่ ${menuName}`,
                metadata: {
                    menuId: result.id,
                    price: (await result).price,
                    optinsCount: options.lenght
                }
            }
        });

        return NextResponse.json({success: true,message:"สร้างเมนูแล้ว",data:result},{status:201})
    } catch(error) {
        console.log(error);
        return NextResponse.json({success: false , message:"ดึงข้อมูลผลาดหวะ"},{status:500});
    }
}