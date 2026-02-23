import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mongo } from '@/lib/mongo'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ orderid: string }>}
) {
    try {
        const { orderid } = await params;
        const orderId = parseInt(orderid);
    } catch(error) {

    }
}