import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {

        const { shopid } = await params;
        const shopId = shopid;

        const findShop = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        })

        const shopsOrder = await prisma.order.findMany({
            where: {
                shopId: shopId,
                shop: {
                    deletedAt: null
                },
                status: {
                    in: ['PENDING', 'PREPARING', 'READY']
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

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const isAdmin = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null
            }
        })

        if(!isAdmin) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status: 404});
        }

        if((findShop?.ownerId !== userId) && (isAdmin.role !== "ADMIN")) {
            return NextResponse.json({success: false,message:"ไม่ใช่เจ้าของร้านและไม่ใช่ admin"},{status:403});
        }

        if (shopsOrder.length === 0) {
            return NextResponse.json({ success: true, orders: [] });
        }

        const orderId = shopsOrder.map(order => order.id);
        const orderDetail = await mongo.orderDetail.findMany({
            where: { mysqlOrderId: { in: orderId } }
        });

        const formattedOrder = shopsOrder.map(order => {
            const detail = orderDetail.find(d => d.mysqlOrderId === order.id);
            return {
                orderId: order.id,
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
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}