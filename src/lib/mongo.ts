// 📍 ไฟล์: lib/mongodb.ts (หรือ utils/mongodb.ts)
import { PrismaClient } from '../../prisma/generated/mongo'; // ชี้ไปที่ output ของ mongo ที่เราตั้งไว้

const globalForMongo = globalThis as unknown as {
  mongoPrisma: PrismaClient | undefined;
};

// ถ้ามี mongoPrisma อยู่ใน global แล้วให้ใช้ตัวเดิม ถ้าไม่มีให้สร้างใหม่
export const mongo = globalForMongo.mongoPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForMongo.mongoPrisma = mongo;