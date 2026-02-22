import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        const userInfo = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                name: true,
                username: true
            }
        });

        return NextResponse.json({
            success: true,
            data: userInfo
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ"}, {status: 500})
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try{
        const { id } = await params;
        const userId = parseInt(id);

        const body = await request.json();
        const { name,username,email } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(username && { username }),
                ...(email && { email })
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedUser
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 });
    }
}
