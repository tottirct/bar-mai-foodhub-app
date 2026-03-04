import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function POST(request: NextRequest) {
    try {
        let calTotalPrice = 0;
        const body = await request.json();
        const { userId, shopId, items, note } = body;

        const menuIds = items.map((i: any) => i.menuId);
        const dbMenus = await prisma.menu.findMany({
            where: { 
                id: { in: menuIds },
                deletedAt: null
            },
            include: {
                options: true,
            }
        });

        const userRoleCheck = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null
            }
        });

        if(!userRoleCheck) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status: 404});
        }

        if(userRoleCheck.role !== "CUSTOMER") {
            return NextResponse.json({success: false,message:"มึงไม่ใช่ customer ไม่ต้องสั่งข้าวเห้ย"},{status: 403});
        }

        const processedItems = items.map((item: any) => {
            const menu = dbMenus.find(m => m.id === item.menuId);
            if (!menu) throw new Error(`ไม่พบmenu ${item.menuId}`);

            let itemPrice = menu.price;

            const selectedOptions = (item.selectedOptions || []).map((opt: any) => {
                const dbOption = menu.options.find(o => o.id === opt.optionId);
                if (!dbOption) throw new Error(`option ${opt.optionId} ไม่มีใน menu ${menu.name}`);

                itemPrice += dbOption.price;
                return {
                    optionId: dbOption.id,
                    name: dbOption.name,
                    price: dbOption.price
                };
            });

            const subTotal = itemPrice * item.quantity;
            calTotalPrice += subTotal;

            return {
                menuId: menu.id,
                menuName: menu.name,
                price: menu.price,
                quantity: item.quantity,
                specialNote: item.specialNote || null,
                selectedOptions: selectedOptions
            };
        });

        const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                    deletedAt: null
                },
                include: { wallets: true } 
            });

        if (!user) {
            return NextResponse.json({ success: false, message: "หาผู้ใช้ไม่เจอ" }, { status: 404 });
        }
        if (!user.wallets || user.wallets.balance < calTotalPrice) {
            return NextResponse.json({ success: false, message: "ตังไม่พอ" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    userId,
                    shopId,
                    totalPrice: calTotalPrice,
                    status: "PENDING"
                }
            });

            await tx.wallet.update({
                where: {
                    userId: userId,
                },
                data: {
                    balance: {
                        decrement: calTotalPrice
                    }
                }
            });
            return createdOrder;
        });

        const newOrderId = result.id;

        try {
            await mongo.orderDetail.create({
                data: {
                    mysqlOrderId: newOrderId,
                    items: processedItems,
                    note: note || null
                }
            });

            await mongo.activityLog.create({
                data: {
                    userId,
                    shopId,
                    userRole: user.role,
                    action: "ORDER_PLACED",
                    description: `สั่งข้าวร้าน ${shopId} รวม ${calTotalPrice}`,
                    metadata: { orderId: newOrderId, totalPrice: calTotalPrice, shopId: shopId }
                }
            });


        } catch (mongoError) {
            console.error("บันทึกลง mongo พลาด", mongoError);
        }

        return NextResponse.json({ success: true, message: "สั่งสำเร็จ", totalPrice: calTotalPrice, orderId: newOrderId });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ผิดพลาด" }, { status: 500 });
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
            where: {
                userId: userId,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                shop: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (allOrders.length === 0) {
            return NextResponse.json({
                success: true,
                data: { cart: [], history: [] }
            });
        }

        const orderIds = allOrders.map(order => order.id);
        const allDetails = await mongo.orderDetail.findMany({
            where: { mysqlOrderId: { in: orderIds } }
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
        const inProgress = formattedOrders.filter(order => order.status === "PREPARING" || order.status === "READY");
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