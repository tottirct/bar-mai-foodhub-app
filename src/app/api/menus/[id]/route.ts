import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

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
                }
            },
            include: {
                options: true,
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
        const { name, price, userId } = await request.json();

        const menu = await prisma.menu.findFirst({
            where: { id: menuId, deletedAt: null },
            include: { shop: true }
        });

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
                userId,
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
            }
        })

        if(!checkMenu) {
            return NextResponse.json({ success: false, message: "เมนูหาไม่เจอ"},{status:404})
        }

        if (!optionId) {
            return NextResponse.json({ success: false, message: "หาoptionไม่เจอ" }, { status: 404 });
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