import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');

        if (!keyword) { // ไม่มี search หวะ
            const shops = await prisma.shop.findMany({
                where: {
                    deletedAt: null
                },
                select: {
                    id: true,
                    name: true,
                    isOpen: true,
                    description: true,
                    imageUrl: true,
                    wallet: true,
                    ownerId: true,

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
                    isOpen: shop.isOpen,
                    imageUrl: shop.imageUrl,
                    description: shop.description,
                    queueCount: shop._count.orders,
                    wallet: shop.wallet,
                    ownerId: shop.ownerId
                };
            });

            return NextResponse.json({
                success: true,
                data: formattedShops
            });

        } else { // มี search หวะ
            const shops = await prisma.shop.findMany({
                where: {
                    deletedAt: null,
                    menus: {
                        some: {
                            name: {
                                contains: keyword,
                            },
                            deletedAt: null
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    isOpen: true,
                    imageUrl: true,
                    description: true,
                    wallet: true,
                    ownerId: true,

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
                    isOpen: shop.isOpen,
                    imageUrl: shop.imageUrl,
                    description: shop.description,
                    queueCount: shop._count.orders,
                    wallet: shop.wallet,
                    ownerId: shop.ownerId
                };
            });

            return NextResponse.json({
                success: true,
                data: formattedShops
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Server Error"
        }, {
            status: 500
        });
    }
}