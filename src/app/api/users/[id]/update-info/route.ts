import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const checkUserId = parseInt(session.user.id);

        const isAdmin = await prisma.user.findFirst({
            where: {
                id: checkUserId,
                deletedAt: null
            }
        });

        if(!isAdmin) {
            return NextResponse.json({success:false,message:"หา user ไม่เจอ"},{status:404});
        }

        if((userId !== checkUserId) && (isAdmin.role !== "ADMIN")) {
            return NextResponse.json({success:false,message:"ไม่ใช่ข้อมูลของคุณและคุณไม่ใช่ admin"},{status:403});
        }

        const userInfo = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null 
            },
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

        const userCheck = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null
            }
        });

        if(!userCheck) {
            return NextResponse.json({success: false,message: "ไม่พบผู้ใช้"},{status:404});
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const checkUserId = parseInt(session.user.id);

        if(checkUserId !== userId) {
            return NextResponse.json({success: false,message:"ไม่ใช่ id ของคุณหนิ"},{status:403});
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
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
