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
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ownerId = parseInt(session.user.id);

        const { shopid } = await params;
        const shopId = parseInt(shopid);

        const shop = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            },
        });

        const isAdmin = await prisma.user.findFirst({
            where: {
                id: ownerId,
                deletedAt: null
            }
        });

        if(!isAdmin) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status:404});
        }

        if ((ownerId !== shop?.ownerId) && (isAdmin.role !== "ADMIN")) {
            return NextResponse.json({ success: false, message: "ไม่ใช่เจ้าของร้านนี้และไม่ใช่ admin" }, { status: 403 });
        }

        if (!shop) {
            return NextResponse.json({ success: false, message: "หาร้านไม่เจอ" }, { status: 404 });
        }

        const transaction = await mongo.activityLog.findMany({
            where: {
                shopId: shopId,
                action: {
                    in: ['COMPLETED', 'WITHDRAW', 'REFUND_SUCCESS']
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        let income = 0;
        let withdraw = 0;
        let refund = 0;

        const formattedTransaction = transaction.map(log => {
            const meta = log.metadata as { amount?: number, orderId?: number } | null;
            const amount = meta?.amount || 0;

            if (log.action === 'COMPLETED') {
                income += amount;
            }
            else if (log.action === 'WITHDRAW') {
                withdraw += amount;
            }
            else if (log.action === "REFUND_SUCCESS") {
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

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงไม่ไหวจริง" }, { status: 500 });
    }
}