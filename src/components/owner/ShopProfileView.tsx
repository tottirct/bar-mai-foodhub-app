import Image from "next/image";
import { Store, Image as ImageIcon } from "lucide-react";
import { ShopInfo } from "./types";

interface Props {
    data: ShopInfo;
}

export function ShopProfileView({ data }: Props) {
    return (
        <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Store className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">ข้อมูลรายละเอียดร้านค้า</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-gray-800">
                {/* Shop Image View */}
                <div className="lg:col-span-1 space-y-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">รูปภาพร้านค้า</span>
                    <div className="relative w-full aspect-square max-w-[280px] rounded-3xl overflow-hidden bg-gray-50 border border-gray-200">
                        {data.imageUrl ? (
                            <Image
                                src={data.imageUrl}
                                alt="Shop"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-300">
                                <ImageIcon className="w-12 h-12" />
                                <span className="font-bold text-sm">ยังไม่มีรูปภาพ</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shop Details View */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อร้านค้า</span>
                        <p className="text-2xl font-black text-green-600">{data.name || "ไม่ระบุ"}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียดร้าน</span>
                        <p className="text-base font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {data.description || "ยังไม่มีคำอธิบายร้านค้า"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">สถานะการเปิดรับออเดอร์</span>
                        <div className="pt-1">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${data.isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${data.isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                {data.isOpen ? 'เปิดร้านอยู่' : 'ปิดร้าน'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
