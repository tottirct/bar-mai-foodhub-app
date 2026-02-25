import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ shopid: string, orderid: string }>}
) {
    try {
        const { shopid, orderid } = await params;
        const shopId = parseInt(shopid);
        const orderId = parseInt(orderid);

        const { status } = await request.json();

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });
        if(!order || order.shopId !== shopId) {
            return NextResponse.json({
                success:false,message:"ไม่พบออเดอร์หวะ"},{status: 404});
        }

        if(status === "CANCELLED") {
            if(order.status === "CANCELLED") {
                return NextResponse.json({ success: false , message: "ยกเลิกไปแล้วนิ"}, { status: 400});
            }

            await prisma.user.update({
                where: { id: order.userId },
                data: { wallet: { increment: order.totalPrice }}
            });

            await mongo.activityLog.create({
                data: {
                    userId: order.userId,
                    userRole: "ระบบออโต้หวะ",
                    action: "REFUND_SUCCESS",
                    description: `คืนเงินจำนวน ${order.totalPrice} บาท ยกเลิกออเดอร์ #${orderId}`,
                    metadata: { orderId: orderId, shopId: shopId }
                }
            });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: status }
        });

        await mongo.activityLog.create({
            data: {
                userId: shopId,
                userRole: "OWNER",
                action: `ORDER_${status}`,
                description: `ร้านค้าเปลี่ยนสถานะออเดอร์ #${orderId} เป็น ${status}`,
                metadata: { orderId: orderId, newStatus: status }
            }
        });

        return NextResponse.json({
            success: true,
            message: `อัปเดตสถานะออเดอร์ #${orderId} เป็น ${status} เรียบร้อยแล้ว`,
            data: {
                orderId: updatedOrder.id,
                newStatus: updatedOrder.status
            }
        });

    } catch(error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"},{ status: 500 });
    }
}