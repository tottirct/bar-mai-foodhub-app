import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { del } from '@vercel/blob';

export async function GET(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const { id } = await params;
        const menuId = parseInt(id);

        const menu = await prisma.menu.findFirst({
            where: { 
                id: menuId,
                deletedAt: null,
                shop: {
                    deletedAt: null
                },
            },
            include: {
                options: {
                    where: {
                        deletedAt: null
                    }
                },
                shop: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(!menu) {
            return NextResponse.json({ success: false, message: "หาเมนูไม่เจอหวะ "}, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: menu
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
        const menuId = parseInt(id);
        const { name, price } = await request.json();

        const menu = await prisma.menu.findFirst({
            where: { id: menuId, deletedAt: null },
            include: { shop: true }
        });

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ownerId = parseInt(session.user.id);

        const checkOwner = await prisma.user.findFirst({
            where: {
                id: ownerId,
                deletedAt: null
            }
        });

        if(!checkOwner) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status:404});
        }
        if(checkOwner.id !== menu?.shop.ownerId) {
            return NextResponse.json({success: false,message:"ไม่ใช่เจ้าของร้านนี้หนิ"},{status:403});
        }

        if (!menu) {
            return NextResponse.json({ success: false, message: "ไม่พบเมนู" }, { status: 404 });
        }

        const newOption = await prisma.menuOption.create({
            data: {
                name,
                price,
                menuId
            }
        });

        await mongo.activityLog.create({
            data: {
                shopId: menu.shopId,
                userRole: "OWNER",
                action: "ADD_OPTION",
                description: `เพิ่ม ${name} ในเมนู ${menu.name}`,
                metadata: { menuId, optionId: newOption.id, price }
            }
        });

        return NextResponse.json({ success: true, data: newOption });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        
        const { id } = await params;
        const menuId = parseInt(id);
        
        const { searchParams } = new URL(request.url);
        const optionId = searchParams.get('optionId');

        const checkMenu = await prisma.menu.findFirst({
            where: {
                id: menuId,
                deletedAt: null
            },
            include: {
                shop: true
            }
        })

        if(!checkMenu) {
            return NextResponse.json({ success: false, message: "เมนูหาไม่เจอ"},{status:404});
        }

        if (!optionId) {
            return NextResponse.json({ success: false, message: "หาoptionไม่เจอ" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ownerId = parseInt(session.user.id);

        const checkOwner = await prisma.user.findFirst({
            where: {
                id: ownerId,
                deletedAt: null
            }
        });

        if(!checkOwner) {
            return NextResponse.json({success: false,message:"หา user ไม่เจอ"},{status:404});
        }
        if(checkOwner.id !== checkMenu?.shop.ownerId) {
            return  NextResponse.json({success: false,message:"ไม่ใช่เจ้าของร้าน"},{status:403});
        }

        const optId = parseInt(optionId);
        const now = new Date();

        const targetOption = await prisma.menuOption.findFirst({
            where: { id: optId, menuId: menuId, deletedAt: null },
            include: { menu: { include: { shop: true } } }
        });

        if (!targetOption) {
            return NextResponse.json({ success: false, message: "ไม่พบตัวเลือกที่ต้องการลบ" }, { status: 404 });
        }

        const result = await prisma.menuOption.update({
            where: { id: optId },
            data: { deletedAt: now }
        });

        await mongo.activityLog.create({
            data: {
                userId: targetOption.menu.shop.ownerId,
                shopId: targetOption.menu.shopId,
                userRole: "OWNER",
                action: "DELETE_OPTION",
                description: `ลบ ${result.name} ออกจากเมนู ${targetOption.menu.name}`,
                metadata: { 
                    menuId: menuId, 
                    optionId: optId 
                }
            }
        });

        return NextResponse.json({ success: true, message: "ลบตัวเลือกเรียบร้อย" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "พลาดในการลบตัวเลือก" }, { status: 500 });
    }
}