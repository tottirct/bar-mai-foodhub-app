import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { mongo } from '@/lib/mongo'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, name, password, role, shopName, shopDescription } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if there is an active session
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user?.role === "ADMIN";

        // Admin creating an Owner + Shop
        if (isAdmin && role === "OWNER") {
            if (!shopName) {
                return NextResponse.json({ message: "กรุณาระบุชื่อร้านสำหรับเจ้าของร้านใหม่" }, { status: 400 });
            }

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    name,
                    password: hashedPassword,
                    role: "OWNER",
                    wallets: {
                        create: {}
                    },
                    shops: {
                        create: {
                            name: shopName,
                            description: shopDescription || null,
                            isOpen: false,
                        }
                    }
                },
                include: {
                    wallets: true,
                    shops: true
                }
            });

            return NextResponse.json({ message: "ลงทะเบียนเจ้าของร้านและร้านค้าใหม่สำเร็จ", user: newUser }, { status: 201 });
        }

        // Standard User (Customer) Registration
        // Ignore any role provided if not admin, default to CUSTOMER
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                name,
                password: hashedPassword,
                role: "CUSTOMER", // default explicitly just in case
                wallets: {
                    create: {}
                }
            },
            include: {
                wallets: true
            }
        });

        try {
            await mongo.activityLog.create({
                data: {
                    userId: newUser.id,
                    userRole: newUser.role,
                    action: "USER_REGISTER",
                    description: `ลงทะเบียนผู้ใช้ใหม่ ${newUser.name}`,
                    metadata: { userId: newUser.id, userRole: newUser.role }
                }
            });


        } catch (mongoError) {
            console.error("บันทึกลง mongo พลาด", mongoError);
        }

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้ใหม่สำเร็จ", user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะลงทะเบียนผู้ใช้ใหม่" }, { status: 500 });
    }
}
