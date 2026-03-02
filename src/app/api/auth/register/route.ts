import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try{
        const { username, email, name, password } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                name,
                password: hashedPassword,
                wallets: {
                    create: {}
                }
            },
            include: {
                wallets: true
            }
        });

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้ใหม่สำเร็จ", user: newUser }, { status: 201 });
    }catch(error){
        console.log(error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะลงทะเบียนผู้ใช้ใหม่" }, { status: 500 });
    }
}