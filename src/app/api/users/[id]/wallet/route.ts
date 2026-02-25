import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo';

export async function GET(
    request: Request,
    { params }: { params: Promise <{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        
        const userWallet = await prisma.user.findUnique({
            where: { id: userId },
            select: { wallet: true }
        });

        const history = await mongo.activityLog.findMany({
            where: { userId: userId }
        });

        return NextResponse.json({
            success: true,
            data: {
                wallet: userWallet?.wallet,
                transactions: history
            }
        });
    } catch(error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"}, {status: 500})
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const body = await request.json();
        const { amount } = body;

        if(!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: "ไหวป่าววะ สรุปจะเติมไหม"}, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: {
                    increment: amount
                }
            }
        });

        const log = await mongo.activityLog.create({
            data: {
                userId: userId,
                shopId: null,
                userRole: "CUSTOMER",
                action: "WALLET_TOPUP",
                description: "เติมเงินควัฟ",
                metadata: { amount: amount }
            }
        });

        return NextResponse.json({
            success: true,
            message: "เติมเงินสำเร็จ เจ๋งจัดอ้ะ",
            currentWallet: updatedUser.wallet,
            log: log
        })
    } catch (error) {
    console.log("สาเหตุที่พังคือ:", error); 

    return NextResponse.json(
      { success: false, message: "ดึงข้อมูลพลาดหวะ" }, 
      { status: 500 }
    );
  }
}