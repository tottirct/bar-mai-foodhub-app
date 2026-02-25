import { NextResponse, NextRequest } from 'next/server';
import { mongo } from '@/lib/mongo';

export async function GET(
    request: NextRequest,
    { params }: { params : Promise<{ shopid : string }>}
) {
    try {
        const { shopid } = await params;
        const shopId = parseInt(shopid);
        
    } catch(error) {

    }
}