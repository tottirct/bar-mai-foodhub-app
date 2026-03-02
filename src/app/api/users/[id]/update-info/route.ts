import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const userInfo = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                username: true,
                email: true
            }
        });

        return NextResponse.json({
            success: true,
            data: userInfo
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const body = await request.json();
        const { name, username, email } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(username && { username }),
                ...(email && { email })
            },
            select: {
                name: true,
                username: true,
                email: true
            }
        });

        try {
            await mongo.activityLog.create({
                data: {
                    userId: userId,
                    userRole: "CUSTOMER",
                    action: "PROFILE_UPDATED",
                    description: `อัปเดตข้อมูลส่วนตัว`,
                    metadata: {
                        updatedFields: Object.keys(body)
                    }
                }
            });
        } catch(mongoError) {
            console.error("บันทึก log ไม่สำเร็จ");
        }

        return NextResponse.json({
            success: true,
            message: "อัปเดตเสร็จ",
            data: updatedUser
        })
    } catch (error:any) {
        console.error(error);
        if(error.code === 'P2002') {
            const target = error.meta?.target;
            return NextResponse.json({
                success: false,
                message: `ซ้ำ โปรดใช้ ${target || 'ข้อมูลอื่น'}`
            })
        }
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}
