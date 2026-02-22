import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();
        const { userId, shopId, items, totalPrice, note  } = body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if(!user || user.wallet < totalPrice) {
            return NextResponse.json({ success: false, message: "ตังไม่พอเนาะ" }, { status: 400 });
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                shopId,
                totalPrice,
                status: "PENDING"
            }
        });

        const orderDetail = await mongo.orderDetail.create({
            data: {
                mysqlOrderId: newOrder.id,
                items: items,
                note: note
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet:{
                    decrement: totalPrice
                }
            }
        });

        await mongo.activityLog.create({
            data: {
                userId,
                userRole: user.role,
                action: "ORDER_PLACED",
                description: `สั่งร้าน ID: ${shopId} รวม ${totalPrice} บาท`,
                metadata: { orderId: newOrder.id }
            }
        });

        return NextResponse.json({
            success: true,
            message: "สั่งเสร็จแล้วจ้า รอรับได้เลย",
            orderId: newOrder.id
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userIdParam = searchParams.get('userId');

        if (!userIdParam) {
            return NextResponse.json({ success: false, message: "ลืมส่ง userId มาเห้ยไอบูม" }, { status: 400 });
        }

        const userId = parseInt(userIdParam);

        const allOrders = await prisma.order.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                shop: {
                    select:{
                        name: true
                    }
                }
            }
        });

        if(allOrders.length === 0){
            return NextResponse.json({
                success: true,
                data: { cart: [], history: []}
            });
        }

        const orderIds = allOrders.map(order => order.id);
        const allDetails = await mongo.orderDetail.findMany({
            where: { mysqlOrderId: { in: orderIds }}
        });
        
        const formattedOrders = allOrders.map(order => {
            const detail = allDetails.find(d => d.mysqlOrderId === order.id);
            return {
                ...order,
                items: detail?.items || [],       
                note: detail?.note || null
            };
        });

        const currentCart = formattedOrders.filter(order => order.status === "PENDING");
        const orderHistory = formattedOrders.filter(order => order.status !== "PENDING");

        return NextResponse.json({
            success: true,
            data: {
                cart: currentCart,
                history: orderHistory
            }
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}