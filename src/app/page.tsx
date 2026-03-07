import Link from 'next/link';
import { ArrowRight, Utensils, Store, Smartphone, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-20 md:py-32 px-6 text-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl -ml-24 -mb-24 opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-green-100 shadow-sm">
            <Utensils size={14} /> BAR MAI FOODHUB
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            ศูนย์รวมร้านอาหาร <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">โรงอาหารบาร์ใหม่</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto md:leading-relaxed">
            สั่งอาหารออนไลน์ ดูคิวแบบเรียลไทม์ และชำระเงินได้ทันทีผ่านระบบ
            ไม่ต้องรอคิวนาน ลดการสัมผัส เพื่อประสบการณ์ที่ดีกว่า
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/customer"
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              สั่งอาหารเลย <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}