"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


interface UserInfo {
    name: string;
    username: string;
    email?: string;
}

export default function InformationPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserInfo>({ name: "", username: "", email: "" });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { data: session, status } = useSession();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;


    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`/api/users/${userId}/update-info`);
            const result = await response.json();
            if (result.success) {
                setUserInfo(result.data);
                setFormData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && userId) {
            fetchUserInfo();
        } else if (status === "unauthenticated") {
            setLoading(false);
            setMessage({ type: "error", text: "กรุณาเข้าสู่ระบบเพื่อดูข้อมูลส่วนตัว" });
        }
    }, [status, userId]);


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/users/${userId}/update-info`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                setUserInfo(result.data);
                setIsEditing(false);
                setMessage({ type: "success", text: "อัปเดตข้อมูลสำเร็จแล้ว! ✨" });
            } else {
                setMessage({ type: "error", text: result.message || "อัปเดตไม่สำเร็จ ลองใหม่อีกครั้ง" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-2xl">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">ข้อมูลส่วนตัว 👤</h1>
                <p className="text-gray-500 font-medium">จัดการข้อมูลและโปรไฟล์ของคุณ</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <span>{message.type === 'success' ? '✅' : '❌'}</span>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8">
                    {!isEditing ? (
                        /* View Mode */
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">โปรไฟล์ของคุณ</h2>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm hover:bg-orange-100 transition-colors"
                                >
                                    แก้ไขข้อมูล
                                </button>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ-นามสกุล</span>
                                    <p className="text-lg font-bold text-gray-800">{userInfo?.name || "ไม่ระบุ"}</p>
                                </div>
                                <div className="flex flex-col gap-1 py-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อผู้ใช้</span>
                                    <p className="text-lg font-bold text-gray-800">@{userInfo?.username || "ไม่ระบุ"}</p>
                                </div>
                                <div className="flex flex-col gap-1 py-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">อีเมล</span>
                                    <p className="text-lg font-bold text-gray-800">{userInfo?.email || "ไม่ระบุ"}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode */
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลส่วนตัว</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        ชื่อ-นามสกุล
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-gray-800 transition-all"
                                        placeholder="ระบุชื่อของคุณ"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        ชื่อผู้ใช้
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-gray-800 transition-all"
                                        placeholder="ระบุชื่อผู้ใช้"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        อีเมล
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-gray-800 transition-all"
                                        placeholder="ระบุอีเมล"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(userInfo || { name: "", username: "", email: "" });
                                    }}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Account Settings / Meta */}
            <div className="mt-8 px-4">
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    <p className="text-xs font-medium">ข้อมูลของคุณจะถูกเก็บเป็นความลับตามนโยบายความเป็นส่วนตัว</p>
                </div>
            </div>
        </main>
    );
}
