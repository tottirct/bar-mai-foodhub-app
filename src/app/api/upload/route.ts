import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "ไม่ได้ไฟล์รูปมา" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: 'photoMenuShop',
        });

        return NextResponse.json({ 
            success: true, 
            message: "อัปโหลดรูปสำเร็จ",
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }, { status: 200 });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ success: false, message: "อัปโหลดรูปไม่สำเร็จ" }, { status: 500 });
    }
}