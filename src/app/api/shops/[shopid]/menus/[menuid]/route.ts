import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
    request: Request,
    { params }: {params: Promise<{ shopid: string, menuid: string}>}
) {
    try {
        const { shopid, menuid } = await params;
        const shopId = parseInt(shopid);
        const menuId = parseInt(menuid);

        const body = await request.json();
        const { name,price,isAvailable } = body;

        const checkShop = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        });

        const checkMenu = await prisma.menu.findFirst({
            where: {
                id: menuId,
                shopId: shopId,
                deletedAt: null
            }
        });

        if(!checkShop) {
            return NextResponse.json({success: false, message:"หาร้านไม่เจอ"},{status:404});
        }

        if(!checkMenu) {
            return NextResponse.json({success: false,message:"หาเมนูไม่เจอ"},{status:404})
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ownerId = parseInt(session.user.id);

        if(checkShop.ownerId !== ownerId) {
            return NextResponse.json({success: false, message:"คุณไม่ใช่เจ้าของร้านนี้"},{status:403});
        }

        const updatedMenu = await prisma.menu.update({
            where: {
                id: menuId
            },
            data: {
                ...(name !== undefined && {name}),
                ...(price !== undefined && {price}),
                ...(isAvailable !== undefined && {isAvailable})
            },
            select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true
            }
        });

        try {
            await mongo.activityLog.create({
                data: {
                    userId: checkShop.ownerId,
                    shopId: shopId,
                    userRole: "OWNER",
                    action: "UPDATE_MENU",
                    description: `เจ้าของร้านปรับเมนู ${updatedMenu.name}`,
                    metadata: { 
                        menuId: (await updatedMenu).id,
                        name: name,
                        price: price,
                        status: isAvailable
                    }

                    }
            });
        } catch(mongoError) {
            console.log(mongoError);
            return NextResponse.json({success: false, message:"จด log ไม่สำเร็จ"},{status:500});
        }

        return NextResponse.json({success:true,message:"ปรับสถานะอาหารสำเร็จ",data: updatedMenu});

    } catch(error) {
        console.log(error);
        return NextResponse.json({success:false,message:"ผิดพลาด"},{status:500});
    }
}