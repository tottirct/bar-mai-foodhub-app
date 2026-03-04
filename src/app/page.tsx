import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-full bg-gray-50">

      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">โรงอาหารบาร์ใหม่</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">สั่งอาหารได้ทันที ไม่ต้องโหลดแอป</p>
        <div className="flex gap-4">
          <Link href="/auth/signin" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            เริ่มใช้งานฟรี
          </Link>
          <Link href="/features" className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition">
            ดูฟีเจอร์
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="จัดการเมนูง่ายๆ" 
            desc="อัปเดตราคาและสถานะเมนูได้ทันทีผ่านระบบหลังบ้าน" 
          />
          <FeatureCard 
            title="รองรับทุกอุปกรณ์" 
            desc="ลูกค้าสั่งอาหารได้ผ่านมือถือ ไม่ต้องโหลดแอป" 
          />
          <FeatureCard 
            title="ระบบวิเคราะห์ยอดขาย" 
            desc="ดูสรุปรายได้แบบเรียลไทม์ที่คุณต้องการ" 
          />
        </div>
      </section>
    </main>
  );
}

// Sub-component for clean code
function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
    