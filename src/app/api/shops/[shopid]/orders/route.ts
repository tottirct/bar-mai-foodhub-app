import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try{

        const { shopid } = await params;
        const shopId = parseInt(shopid);

        const shopsOrder = await prisma.order.findMany({
            where: {
                shopId: shopId,
                shop:{
                    deletedAt: null
                },
                status: {
                    in: ['PENDING','PREPARING','READY']
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(shopsOrder.length === 0){
            return NextResponse.json({ success: true,orders: []});
        }

        const orderId = shopsOrder.map(order => order.id);
        const orderDetail = await mongo.orderDetail.findMany({
            where: { mysqlOrderId: { in: orderId } }
        });

        const formattedOrder = shopsOrder.map(order => {
            const detail = orderDetail.find(d => d.mysqlOrderId === order.id);
            return {
                orderId: orderId,
                customerName: order.user.name,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                note: detail?.note || "",
                items: detail?.items || []
            };
        });

        return NextResponse.json({
            success: true,
            orders: formattedOrder
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"}, {status: 500});
    }
}