//ไว้ดึงขึ้อมูบ user คร่าวๆ ทุกคน

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: Request,
) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminId = session.user.id;

        const checkAdmin = await prisma.user.findFirst({
            where: {
                id: adminId,
                deletedAt: null
            }
        });

        if(!checkAdmin) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status:404});
        }
        if(checkAdmin.role !== "ADMIN") {
            return NextResponse.json({success: false,message:"ไม่ใช่ admin หนิ"},{status:403});
        }

        const users = await prisma.user.findMany({
            where: {
                deletedAt: null
            },
            take: limit,
            skip: skip,
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                role: true,
                wallets: {
                    select: {
                        balance: true
                    }
                }
            },
            orderBy: {id: 'desc'}
        });

        const formattedUserData = users.map((user) => {
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role,
                balance: user.wallets?.balance || null
            }
        });

        return NextResponse.json({
            success: true,
            data: formattedUserData
        },{status: 200})
    } catch(error) {
        console.log(error)
        return NextResponse.json({success: false,message:"ดึงข้อมูลพลาด"},{status: 500});
    }
}