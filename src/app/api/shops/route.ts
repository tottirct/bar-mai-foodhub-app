import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const shops = await prisma.shop.findMany({
            select: {
                id: true,
                name: true,
                description: true,

                _count: {
                    select: {
                        orders: {
                            where: { status: 'PENDING' }
                        }
                    }
                }
            }
        });

        const formattedShops = shops.map((shop) => {
            return {
                id: shop.id,
                name: shop.name,
                description: shop.description,
                queueCount: shop._count.orders
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedShops
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Server Error"
        },{
            status: 500
        });
    }
}