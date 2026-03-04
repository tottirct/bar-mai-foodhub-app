import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';

export async function PATCH(
    request: Request,
    { params }: {params: Promise<{ shopid: string, menuid: string}>}
) {
    try {
        const { shopid, menuid } = await params;
        const shopId = parseInt(shopid);
        const menuId = parseInt(menuid);

        const body = await request.json();
        const { isAvailable } = body;

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

        const updatedMenu = await prisma.menu.update({
            where: {
                id: menuId
            },
            data: {
                isAvailable: isAvailable
            }
        });

        try {
            await mongo.activityLog.create({
                data: {
                    userId: checkShop.ownerId,
                    shopId: shopId,
                    userRole: "OWNER",
                    action: "CHANGE_MENU_STATUS",
                    description: `เจ้าของร้านปรับเมนู ${updatedMenu.name} เป็น ${isAvailable ? 'พร้อม' : 'ไม่พร้อม'}`,
                    metadata: { menuId: (await updatedMenu).id, status: isAvailable }

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