// 📍 ไฟล์: lib/prisma.ts (หรือ utils/prisma.ts)
import { PrismaClient } from '../../prisma/generated/mysql'; // ชี้ไปที่ output ของ mysql ที่เราตั้งไว้

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ถ้ามี prisma อยู่ใน global แล้วให้ใช้ตัวเดิม ถ้าไม่มีให้สร้างใหม่
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;