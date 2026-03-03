import { NextResponse, NextRequest } from 'next/server';
import { mongo } from '@/lib/mongo';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;
        const skip = (page - 1) * limit;

        let actionFilter: any = {};

        if (category === 'finance') {
            actionFilter = { in: ['WALLET_TOPUP', 'WITHDRAW','REFUND_SUCCESS','ORDER_PLACED','COMPLETED'] };
        } else if (category === 'account') { // user_register / user_loging ยังไม่มี รอต็อดจด mongo
            actionFilter = { in: ['USER_REGISTER', 'USER_LOGIN', 'DELETE_CUSTOMER', 'DELETE_OWNER_CASCADE','PROFILE_UPDATED'] };
        } else if (category === 'menu') {
            actionFilter = { in: ['ADD_MENU', 'DELETE_MENU', 'ADD_OPTION', 'DELETE_OPTION'] };
        }

        const whereClause = category ? { action: actionFilter } : {};

        const [logs, total] = await Promise.all([
            mongo.activityLog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: skip,
            }),
            mongo.activityLog.count({
                where: whereClause
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total
            }
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            success: false, 
            message: "ดึงข้อมูล log พลาด" 
        }, { status: 500 });
    }
}