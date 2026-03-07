import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = session.user.id;
    if (!ownerId) {
      return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
    }

    const shop = await prisma.shop.findFirst({
      where: { ownerId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, shopId: shop.id });

  } catch (error) {
    console.error("API Error in /api/user/my-shop:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
