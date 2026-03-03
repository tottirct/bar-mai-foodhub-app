// ไว้ดึง transaction user ไม่ส่งไปหมดทีเดียวเดี๋ยว lag
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mongo } from '@/lib/mongo'

export async function PATCH(
    request: Request,
    { params }: { params : Promise<{ userid : String }>}
) {
    try {

    } catch(error) {
        
    }
}