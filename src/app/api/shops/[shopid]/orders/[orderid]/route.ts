import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ shopid: string, orderid: string }>}
) {
    try {
        const { shopid, orderid } = await params;
        const shopId =  parseInt(shopid);
        const orderId = parseInt(orderid);

        const { status } = await request.json();

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { shop: true }
        });

        if(!order || order.shopId !== shopId) {
            return NextResponse.json({ success: false, message: "ไม่พบออเดอร์ || ร้านไม่ตรงใน order"}, {status: 404});
        }

        if(status === "CANCELLED" && order.status === "CANCELLED") {
            return NextResponse.json({ success: false, message: "ยกเลิกไปแล้ว"},{status:400});
        }

        const updatedOrder = await prisma.$transaction(async(tx) => {
            const newOrder = await tx.order.update({
                where: {id : orderId},
                data: {status: status}
            })

            if(status === "CANCELLED") {
                await tx.user.update({
                    where: {id: order.userId},
                    data: {
                        wallet : {
                            increment: order.totalPrice
                        }
                    }
                });
            } else if (status === "COMPLETED") {
                await tx.shop.update({
                    where: {id: shopId},
                    data: {
                        wallet: {
                            increment: order.totalPrice
                        }
                    }
                });
            }
            return newOrder;
        });

        try {
            if( status === "CANCELLED") {
                await mongo.activityLog.create({
                    data: {
                        userId: order.userId,
                        shopId: shopId,
                        userRole: "AUTO",
                        action: "REFUND_SUCCESS",
                        description: `คืนตังให้ลูกค้า ${order.totalPrice} บาท`,
                        metadata: {orderId: orderId,shopId: shopId,amount: order.totalPrice}      
                    }
                });
            }

            let amountVal;
            if(status === "COMPLETED") {
                amountVal = order.totalPrice;
            }
            else {
                amountVal = undefined;
            }

            await mongo.activityLog.create({
                data: {
                    userId: order.shop.ownerId,
                    shopId: shopId,
                    userRole: "OWNER",
                    action: `${status}`,
                    description: `เปลี่ยนสถานะออเดอร์ ${orderId} เป็น ${status}`,
                    metadata: {
                        orderId: orderId,
                        newStatus: status,
                        amount: amountVal
                    }
                }
            });
        } catch(mongoError) {
            console.error("บันทึก log ไม่สำเร็จ");
        }

        return NextResponse.json({
            success: true,
            message: `เปลี่ยนสถานะ order ${orderId} เป็น ${status}`,
            data: {
                orderId: updatedOrder.id,
                newStatus: updatedOrder.status
            }
        })

    } catch(error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"},{ status: 500 });
    }
}