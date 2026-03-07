import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';
import { now } from 'next-auth/client/_utils';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
<<<<<<< HEAD
        const { shopId, menuName, price, isAvailable } = body;

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
=======
        const { shopId, menuName, price, imageUrl, options, userId } = body;
>>>>>>> 7e9360518c699ac7231de8422becb76795a3b6aa

        const checkRole = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        })

        if(!checkRole) {
            return NextResponse.json({success: false,message:"หาร้านไม่เจอ"},{status:404});
        }
        if(checkRole.ownerId !== userId) {
            return NextResponse.json({success: false,message:"ไม่ใช่เจ้าของร้านนิ"},{status:403});
        }

        if(!menuName || price === undefined || !userId || price < 0) {
            return NextResponse.json({sucess: false, message: "เอาดีๆ"},{status: 400});
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
                imageUrl: imageUrl,
                options: {

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
                    optinsCount: 0
                }
            }
        });

        return NextResponse.json({success: true,message:"สร้างเมนูแล้ว",data:result},{status:201})
    } catch(error) {
        console.log(error);
        return NextResponse.json({success: false , message:"ดึงข้อมูลผลาดหวะ"},{status:500});
    }
}

export async function DELETE(
    request: Request,
) {
    try {
        const body = await request.json();
        const { shopId, menuId, userId} = body;

        const checkRole = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        })

        if(!checkRole) {
            return NextResponse.json({success: false,message:"หาร้านไม่เจอ"},{status:404});
        }
        if(checkRole.ownerId !== userId) {
            return NextResponse.json({success: false,message:"ไม่ใช่เจ้าของร้านนิ"},{status:403});
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
        const now = new Date();
        const result = await prisma.$transaction(async (tx) => {
            await tx.menuOption.updateMany({
                where: { menuId: menuId },
                data: { deletedAt: now }
            });

            return await tx.menu.update({
                where: { id: menuId },
                data: { deletedAt: now }
            });
        });

        await mongo.activityLog.create({
            data: {
                userId: targetShop.ownerId,
                shopId: shopId,
                userRole: "OWNER",
                action: "DELETE_MENU",
                description: `ร้าน ${shopId} ลบเมนู ${result.name} และ addon`,
                metadata: {
                    menuId: result.id
                }
            }
        });

        return NextResponse.json({success: true,message:"ลบเมนูแล้ว",data:result},{status:201})
    } catch(error) {
        console.error(error);
        return NextResponse.json({success: false , message:"ดึงข้อมูลผลาดหวะ"},{status:500});
    }
}