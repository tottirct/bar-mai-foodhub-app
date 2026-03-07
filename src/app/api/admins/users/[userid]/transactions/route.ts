// ไว้ดึง transaction user ไม่ส่งไปหมดทีเดียวเดี๋ยว lag
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: Request,
    { params }: { params : Promise<{ userid : string }>}
) {
    try {
        const { userid } = await params;
        const userId = userid; 

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
            return NextResponse.json({success: false,message:"หาผู้ใช้ไม่เจอ"},{status:404});
        }
        if(checkAdmin.role !== "ADMIN") {
            return NextResponse.json({success: false,message:"ไม่ใช่ admin หนิ"},{status:403});
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;
        const userCheck = await prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null
            }
        });

        if(!userCheck) {
            return NextResponse.json({success: false,message: "หาผู้ใช้ไม่เจอ"},{status:404});
        }

        let result : any = {};

        if(userCheck.role === "CUSTOMER") {
            result.wallet_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in: ['WALLET_TOPUP','ORDER_PLACED','REFUND_SUCCESS']
                    }
                },
                orderBy: { createdAt: 'desc'},
                take: limit,
                skip: skip
            });

            result.profile_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in : ['PROFILE_UPDATED']
                    }
                },
                orderBy: { createdAt: 'desc'},
                take: 10
            });

            result.login_register_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in: ['USER_REGISTER', 'USER_LOGIN']
                    }
                },
                orderBy: { createdAt: 'desc'},
                take: limit,
                skip: skip
            });

        }

        else if(userCheck.role === "OWNER") {

            const shop = await prisma.shop.findFirst({
                where: {
                    ownerId: userId
                }
            });

            if (!shop) {
                return NextResponse.json({ 
                    success: false, 
                    message: "หาข้อมูลร้านไม่เจอ" 
                }, { status: 404 });
            }

            result.shop_wallet_history = await mongo.activityLog.findMany({
                where: {
                    shopId: shop.id,
                    action: {
                        in : ['COMPLETED','REFUND_SUCCESS','WITHDRAW']
                    }
                },
                orderBy: {createdAt: 'desc'},
                take: limit,
                skip: skip
            });

            result.update_history = await mongo.activityLog.findMany({
                where: {
                    shopId: shop.id,
                    action: {
                        in: ['ADD_MENU','DELETE_MENU','ADD_OPTION','SHOP_UPDATED']
                    }
                },
                orderBy: {createdAt: 'desc'},
                take: limit
            });

            result.login_register_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in: ['USER_REGISTER', 'USER_LOGIN']
                    }
                },
                orderBy: { createdAt: 'desc'},
                take: limit,
                skip: skip
            });

        }

        else if(userCheck.role === 'ADMIN') {
            result.update_user_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in: ['DELETE_USER','CREATE_OWNER']
                    }
                },
                orderBy: {createdAt: 'desc'},
                take: limit,
                skip: skip
            });

            result.login_register_history = await mongo.activityLog.findMany({
                where: {
                    userId: userId,
                    action: {
                        in: ['USER_REGISTER', 'USER_LOGIN']
                    }
                },
                orderBy: { createdAt: 'desc'},
                take: limit,
                skip: skip
            });
            
        }

        return NextResponse.json({
            success: true,
            role: userCheck.role,
            pagination: { page, limit },
            data: result
        });

    } catch(error) {
        console.log(error);
        return NextResponse.json({success: false,message: "ดึง transaction พลาด"},{status:500});
    }
}