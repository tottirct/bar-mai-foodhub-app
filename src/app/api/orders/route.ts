import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, shopId, items, note } = body;

        const menuIds = items.map((i: any) => i.menuId);
        const dbMenus = await prisma.menu.findMany({
            where: { id: { in: menuIds } },
            include: { options: true }
        });

        let calculatedTotalPrice = 0;

        const processedItems = items.map((item: any) => {
            const menu = dbMenus.find(m => m.id === item.menuId);
            if (!menu) throw new Error(`ไม่พบเมนูรหัส ${item.menuId} ในระบบ`);

            let itemPrice = menu.price;

            const selectedOptions = (item.selectedOptions || []).map((opt: any) => {
                const dbOption = menu.options.find(o => o.id === opt.optionId);
                if (!dbOption) throw new Error(`ตัวเลือกเสริม ${opt.optionId} ไม่มีในเมนู ${menu.name}`);
                
                itemPrice += dbOption.price;
                return {
                    optionId: dbOption.id,
                    name: dbOption.name,
                    price: dbOption.price
                };
            });

            const subTotal = itemPrice * item.quantity;
            calculatedTotalPrice += subTotal;

            return {
                menuId: menu.id,
                menuName: menu.name,
                price: menu.price,
                quantity: item.quantity,
                specialNote: item.specialNote || null,
                selectedOptions: selectedOptions
            };
        });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ success: false, message: "ไม่พบผู้ใช้งาน" }, { status: 404 });
        }
        if (user.wallet < calculatedTotalPrice) {
            return NextResponse.json({ success: false, message: `ตังไม่พอจ้า ขาดอีก ${calculatedTotalPrice - user.wallet} บาท` }, { status: 400 });
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                shopId,
                totalPrice: calculatedTotalPrice, 
                status: "PENDING"
            }
        });

        await mongo.orderDetail.create({
            data: {
                mysqlOrderId: newOrder.id,
                items: processedItems,
                note: note || null
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: { decrement: calculatedTotalPrice }
            }
        });

        await mongo.activityLog.create({
            data: {
                userId,
                shopId,
                userRole: user.role,
                action: "ORDER_PLACED",
                description: `สั่งอาหารร้าน ID:${shopId} ยอดรวม ${calculatedTotalPrice} บาท (หักเงินแล้ว)`,
                metadata: { orderId: newOrder.id, totalPrice: calculatedTotalPrice ,shopId: shopId}
            }
        });

        return NextResponse.json({
            success: true,
            message: "สั่งซื้อสำเร็จ!",
            totalPaid: calculatedTotalPrice,
            orderId: newOrder.id
        });

    } catch (error: any) {
        console.error("Order Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "เกิดข้อผิดพลาดในการสั่งซื้อ" 
        }, { status: 500 });
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
        const orderHistory = formattedOrders.filter(order => order.status === "COMPLETED" || order.status === "CANCELLED");
        const inProgress =  formattedOrders.filter(order => order.status === "PREPARING" || order.status === "READY");
        return NextResponse.json({
            success: true,
            data: {
                cart: currentCart,
                inProgress: inProgress,
                history: orderHistory
            }
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}