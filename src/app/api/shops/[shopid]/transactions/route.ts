import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo';

export async function GET(
    request: NextRequest,
    { params }: { params : Promise<{ shopid : string }>}
) {
    try {
        const { shopid } = await params;
        const shopId = parseInt(shopid);
        
        const shop = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            },
        });

        if(!shop) {
            return NextResponse.json({ success: false, message: "หาร้านไม่เจอ" }, {status: 404});
        }

        const transaction = await mongo.activityLog.findMany({
            where:{
                shopId: shopId,
                action: {
                    in: ['COMPLETED', 'WITHDRAW', 'REFUND_SUCCESS']
                }
            },
            orderBy: {createdAt: 'desc'}
        });

        let income = 0;
        let withdraw = 0;
        let refund = 0;

        const formattedTransaction = transaction.map(log => {
            const meta = log.metadata as { amount?: number, orderId?: number } | null;
            const amount = meta?.amount || 0;

            if(log.action === 'ORDER_COMPLETED') {
                income += amount;
            }
            else if(log.action === 'WITHDRAW') {
                withdraw += amount;
            }
            else if(log.action === "REFUND_SUCCESS") {
                refund += amount;
            }

            return {
                id: log.id,
                action: log.action,
                description: log.description,
                amount: amount,
                createdAt: log.createdAt,
                orderId: meta?.orderId || null
            };
        });
        const net = income - withdraw - refund;

        return NextResponse.json({
            success: true,
            summary: {
                income: income,
                withdraw: withdraw,
                refund: refund,
                net: net
            },
            transactions: formattedTransaction
        });

    } catch(error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงไม่ไหวจริง"}, {status: 500});
    }
}