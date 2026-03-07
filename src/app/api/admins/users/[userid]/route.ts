import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ userid: string }> }
) {
    try {
        const { userid } = await params;
        const userId = parseInt(userid);
        const { adminId, reason } = await request.json();

        const adminCheck = await prisma.user.findFirst({
             where: {
                id: adminId,
                deletedAt: null
            } 
        });

        if (!adminCheck) {
            return NextResponse.json({ success: false, message: "หา user ไม่เจอ" }, { status: 404 });
        }
        if(adminCheck.role !== "ADMIN") {
            return NextResponse.json({success: false,message:"ไม่ใช่ admin หนิ"},{status:403});
        }

        const now = new Date();

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { deletedAt: now }
            });

            if (user.role === 'OWNER') {
                const shop = await tx.shop.findFirst({
                    where: { ownerId: userId, deletedAt: null }
                });

                if (shop) {
                    await tx.shop.update({
                        where: { id: shop.id },
                        data: { deletedAt: now }
                    });

                    const menus = await tx.menu.findMany({
                        where: { shopId: shop.id },
                        select: { id: true }
                    });
                    const menuIds = menus.map(m => m.id);

                    if (menuIds.length > 0) {
                        await tx.menu.updateMany({
                            where: { id: { in: menuIds } },
                            data: { deletedAt: now }
                        });

                        await tx.menuOption.updateMany({
                            where: { menuId: { in: menuIds } },
                            data: { deletedAt: now }
                        });
                    }
                }
            }
            return user;
        });

        const isOwner = result.role === 'OWNER';

        await mongo.activityLog.create({
            data: {
                userId: adminId,
                userRole: "ADMIN",
                action: isOwner ? "DELETE_OWNER_CASCADE" : "DELETE_CUSTOMER",
                description: isOwner 
                    ? `Admin ลบ owner ${result.email} + ปิดร้านค้า,มนูทั้งหมด`
                    : `Admin ลบ customer ${result.email}`,
                metadata: { 
                    targetUserId: userId, 
                    targetRole: result.role,
                    reason: reason || "N/A" 
                }
            }
        });

        return NextResponse.json({ success: true, message: "ลบเรียบร้อย" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการลบ" }, { status: 500 });
    }
}