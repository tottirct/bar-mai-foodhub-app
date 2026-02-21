// ไฟล์นี้ปรับแต่งให้รองรับทั้ง MySQL และ MongoDB
import "dotenv/config";
import { defineConfig } from "prisma/config";

// ทริค: เช็คว่าคำสั่งใน Terminal ที่เรารัน มีคำว่า "mongo" อยู่ไหม
const isMongo = process.argv.join(" ").includes("mongo");

export default defineConfig({
  // 1. สลับไฟล์ Schema อัตโนมัติตามคำสั่งที่รัน
  schema: isMongo ? "prisma/schema.mongo.prisma" : "prisma/schema.mysql.prisma",
  
  migrations: {
    // 2. MongoDB ไม่ต้องใช้ระบบ Migration แบบ SQL เราเลยตั้งให้มันทำงานแค่ตอนเป็น MySQL
    path: isMongo ? undefined : "prisma/migrations",
  },
  
  datasource: {
    // 3. สลับ URL ดึงค่าจาก .env ให้ตรงกับ Database อัตโนมัติ
    url: isMongo ? process.env["MONGO_DATABASE_URL"] : process.env["MYSQL_DATABASE_URL"],
  },
});