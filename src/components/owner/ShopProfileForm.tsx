import { useRef, useState } from "react";
import Image from "next/image";
import { Store, Image as ImageIcon, Camera, Loader2 } from "lucide-react";
import { ShopInfo } from "./types";

interface Props {
    data: ShopInfo;
    onChange: (data: ShopInfo) => void;
    onError: (msg: string) => void;
}

export function ShopProfileForm({ data, onChange, onError }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            onError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
            return;
        }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const uploadData = await res.json();

            if (uploadData.success) {
                onChange({ ...data, imageUrl: uploadData.imageUrl });
            } else {
                onError(uploadData.message || "อัปโหลดรูปล้มเหลว");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            onError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-8 border-t border-gray-100">
            {/* Left Column: Image */}
            <div className="xl:col-span-1 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">อัปโหลดรูปภาพร้านค้า</h3>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative group w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all hover:border-green-400 cursor-pointer">
                        {data.imageUrl ? (
                            <>
                                <Image
                                    src={data.imageUrl}
                                    alt="Shop"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                    <Camera className="w-8 h-8 text-white" />
                                    <span className="text-white font-bold text-sm">คลิกเพื่อเปลี่ยนรูปภาพ</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-400 p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-sm">ยังไม่มีรูปภาพ</span>
                                <span className="text-xs">คลิกเพื่ออัปโหลด</span>
                            </div>
                        )}

                        {/* Overlay during upload */}
                        {uploadingImage && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 transition-all pointer-events-none">
                                <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-2" />
                                <span className="text-sm font-bold text-green-600">กำลังอัปโหลด...</span>
                            </div>
                        )}

                        {/* Invisible File Input trigger */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-50"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                        แนะนำ: รูปภาพสี่เหลี่ยมจตุรัส ขนาดไม่เกิน 5MB
                    </p>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="xl:col-span-2 space-y-8">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Store className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">แก้ไขข้อมูลรายละเอียดร้านค้า</h3>
                </div>

                <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อร้านค้า <span className="text-red-500">*</span></label>
                        <input
                            type="text" required
                            value={data.name} onChange={e => onChange({ ...data, name: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 text-gray-900"
                            placeholder="ใส่ชื่อร้านค้าของคุณ"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">รายละเอียดร้าน (ไม่บังคับ)</label>
                        <textarea
                            value={data.description} onChange={e => onChange({ ...data, description: e.target.value })}
                            rows={4}
                            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 text-gray-900 resize-none"
                            placeholder="แนะนำร้านของคุณให้ลูกค้ารู้จัก..."
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200 hover:border-green-200 transition-colors cursor-pointer" onClick={() => onChange({ ...data, isOpen: !data.isOpen })}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${data.isOpen ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">สถานะเปิด-ปิดร้าน</h4>
                                    <p className="text-xs text-gray-500 mt-1">กำหนดว่าลูกค้าจะสามารถสั่งอาหารได้หรือไม่</p>
                                </div>
                            </div>

                            {/* Custom Toggle Switch */}
                            <div className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${data.isOpen ? "bg-green-500" : "bg-gray-300"}`}>
                                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${data.isOpen ? "translate-x-6" : "translate-x-0"}`}></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
