//ไว้ดึงขึ้อมูบ user คร่าวๆ ทุกคน

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                role: true,
                isBanned: true,
                wallets: {
                    select: {
                        balance: true
                    }
                }
            }
        });

        const formattedUserData = users.map((user) => {
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role,
                isBanned: user.isBanned,
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