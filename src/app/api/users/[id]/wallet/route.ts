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
        
        const userWallet = await prisma.wallet.findFirst({
            where: {
                userId: userId,
                user: {
                    deletedAt: null
                }
            },
            select: { balance: true }
        });

        const history = await mongo.activityLog.findMany({
            where: { userId: userId ,
                action: {
                    in: ['WALLET_TOPUP','ORDER_PLACED','REFUND_SUCCESS']
                }
            },
            orderBy: { createdAt: 'desc'}
        });

        return NextResponse.json({
            success: true,
            data: {
                wallet: userWallet?.balance || 0,
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
        const {amount} = body;

        if(!amount || amount <= 0) {
            return NextResponse.json({success: false, message:"ไหวป่าววะ วรุปจะเติมมั้ย"},{status:400});
        }

        const userCheck = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null
            }
        });

        if(!userCheck) {
            return NextResponse.json({success: false,message: "ไม่พบผู้ใช้"},{status:404});
        }

        const updatedWallet = await prisma.wallet.upsert({
            where: {userId: userId},
            update: {
                balance: {
                    increment: amount
                }
            },
            create: {
                userId: userId,
                balance: amount
            }
        });

        let log = null;
        try {
            log = await mongo.activityLog.create({
                data:{
                    userId: userId,
                    userRole: "CUSTOMER",
                    action: "WALLET_TOPUP",
                    description: `เติมเงินควัฟ จำนวน ${amount} บาท`,
                    metadata: {amount: amount}
                }
            });
        } catch(mongoError) {
            console.error("จด log ไม่สำเร็จ");
        }

        return NextResponse.json({success: true, message:`เติมเงินแล้ว ${amount} บาท`,data: { wallet: updatedWallet.balance,log: log}});

    } catch (error) {
    console.log(error); 

    return NextResponse.json(
      { success: false, message: "ดึงข้อมูลพลาดหวะ" }, 
      { status: 500 }
    );
  }
}