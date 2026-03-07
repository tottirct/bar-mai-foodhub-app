import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {
        const { shopid } = await params;
        const shopId = parseInt(shopid);

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const checkOwnerId = parseInt(session.user.id);

        const isAdmin = await prisma.user.findFirst({
            where: {
                id: checkOwnerId,
                deletedAt: null
            }
        });

        const myShop = await prisma.shop.findFirst({
            where: {
                ownerId: checkOwnerId,
                deletedAt: null
            }
        })

        if(!isAdmin || !myShop) {
            return NextResponse.json({success:false,message:"หา user ไม่เจอ"},{status:404});
        }

        if((shopId !== myShop.id) && (isAdmin.role !== "ADMIN")) {
            return NextResponse.json({success:false,message:"ไม่ใช่ข้อมูลของคุณและคุณไม่ใช่ admin"},{status:403});
        }

        const shopInfo = await prisma.shop.findFirst({
            where: {
                id: myShop.id,
                deletedAt: null 
            },
            select: {
                name: true,
                description: true,
                isOpen: true,
                imageUrl: true,
            }
        });

        return NextResponse.json({
            success: true,
            data: shopInfo
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "ดึงข้อมูลพลาดหวะ" }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ shopid: string }> }
) {
    try {
        const { shopid } = await params;
        const shopId = parseInt(shopid);

        const body = await request.json();
        const { name, description,isOpen,imageUrl} = body;

        const ownerCheck = await prisma.shop.findFirst({
            where: {
                id: shopId,
                deletedAt: null
            }
        });

        if(!ownerCheck) {
            return NextResponse.json({success: false,message: "ไม่พบผู้ใช้"},{status:404});
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const checkOwnerId = parseInt(session.user.id);

        if(checkOwnerId !== ownerCheck.ownerId) {
            return NextResponse.json({success: false,message:"ไม่ใช่ id ของคุณหนิ"},{status:403});
        }

        const updatedShop = await prisma.shop.update({
            where: {
                id: shopId
            },
            data: {
                ...(name !==  undefined && { name }),
                ...(description !== undefined && { description }),
                ...(isOpen !== undefined && { isOpen }),
                ...(imageUrl !== undefined && { imageUrl })
            },
            select: {
                name: true,
                description: true,
                isOpen: true,
                imageUrl: true
            }
        });

        try {
            await mongo.activityLog.create({
                data: {
                    userId: ownerCheck.ownerId,
                    shopId: shopId,
                    userRole: "OWNER",
                    action: "SHOP_UPDATED",
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
            data: updatedShop
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