"use client";

import { useState } from "react";
import { X, Store, User, Mail, Lock, Plus, Loader2, Info } from "lucide-react";

interface AddShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddShopModal({ isOpen, onClose, onSuccess }: AddShopModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shopName: "",
        description: "",
        ownerName: "",
        username: "",
        email: "",
        password: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.ownerName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: "OWNER",
                    shopName: formData.shopName,
                    shopDescription: formData.description
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Reset form
                setFormData({
                    shopName: "",
                    description: "",
                    ownerName: "",
                    username: "",
                    email: "",
                    password: ""
                });
                onClose();
                onSuccess();
            } else {
                alert(data.message || "Failed to create shop");
            }
        } catch (error) {
            console.error("Failed to add shop:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-green-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-200">
                            <Store className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">เพิ่มร้านค้าใหม่</h2>
                            <p className="text-sm font-bold text-gray-500">สร้างบัญชีเจ้าของร้านและข้อมูลร้านค้า</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-2xl text-gray-400 transition-all border border-gray-100 shadow-sm"><X className="w-6 h-6" /></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <form id="add-shop-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Owner Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <User className="w-5 h-5 text-green-500" />
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">ข้อมูลเจ้าของร้าน</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อ-นามสกุล</label>
                                    <input
                                        type="text" required
                                        value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                        placeholder="เช่น ป้าหยี ขยันขาย"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อผู้ใช้ (Username)</label>
                                    <input
                                        type="text" required
                                        value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                        placeholder="เช่น pa_yhee67"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">อีเมล</label>
                                    <input
                                        type="email" required
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                        placeholder="เช่น pa_yhee@gmail.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">รหัสผ่าน</label>
                                    <input
                                        type="password" required minLength={6}
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shop Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Store className="w-5 h-5 text-green-500" />
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">ข้อมูลร้านค้า</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">ชื่อร้านค้า</label>
                                    <input
                                        type="text" required
                                        value={formData.shopName} onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                        placeholder="ชื่อร้านของคุณ"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">รายละเอียดร้าน</label>
                                    <textarea
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="บอกให้ลูกค้ารู้ว่าร้านคุณขายอะไร..."
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex items-center justify-end gap-3 rounded-b-[2.5rem]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all uppercase tracking-widest"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        form="add-shop-form"
                        disabled={loading}
                        className="px-8 py-3.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-green-200 flex items-center justify-center min-w-[160px]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5" /> <span>บันทึกข้อมูล</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
