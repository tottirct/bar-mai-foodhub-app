import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {
        const { shopid } = await params;
        const shopId = parseInt(shopid);
        const body = await request.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: "จะถอนมั้ยเนี่ย" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const shop = await tx.shop.findFirst({
                where: { id: shopId, deletedAt: null }
            });

            if (!shop || shop.wallet < amount) {
                throw new Error("เงินไม่เพียงพอ/ไม่พบร้านค้า");
            }

            const updatedShop = await tx.shop.update({
                where: { id: shopId },
                data: {
                    wallet: { decrement: amount }
                }
            });

            return updatedShop;
        });

        let log = null;
        try {
            log = await mongo.activityLog.create({
                data: {
                    userId: result.ownerId,
                    shopId: shopId,
                    userRole: "OWNER",
                    action: "WITHDRAW",
                    description: `ถอนเงิน ${amount} บาท`,
                    metadata: { 
                        amount: amount,
                        remaining: result.wallet
                    }
                }
            });
        } catch (mongoError) {
           console.error(mongoError);
        }

        return NextResponse.json({
            success: true,
            message: `ถอนเงิน ${amount} บาท`,
            data: { 
                wallet: result.wallet,
                log: log 
            }
        });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: error.message || "เกิดข้อผิดพลาดในการทำรายการ" },
            { status: error.message === "ยอดเงินไม่เพียงพอ หรือไม่พบร้านค้า" ? 400 : 500 }
        );
    }
}