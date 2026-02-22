import { NextResponse    } from "next/server";

export async function POST(request: Request) {
    try{
        const { username, email, name, password } = await request.json();

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้ใหม่สำเร็จ" }, { status: 201 });
    }catch(error){
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะลงทะเบียนผู้ใช้ใหม่" }, { status: 500 });
    }
}