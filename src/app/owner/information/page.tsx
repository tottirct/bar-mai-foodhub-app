"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Store,
    Save,
    Loader2,
    CheckCircle,
    XCircle,
    X
} from "lucide-react";
import { OwnerInfo, ShopInfo } from "@/components/owner/types";
import { OwnerProfileView } from "@/components/owner/OwnerProfileView";
import { ShopProfileView } from "@/components/owner/ShopProfileView";
import { OwnerProfileForm } from "@/components/owner/OwnerProfileForm";
import { ShopProfileForm } from "@/components/owner/ShopProfileForm";

export default function OwnerInformationPage() {
    const { data: session } = useSession();

    const [shopId, setShopId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form and UI States
    const [ownerData, setOwnerData] = useState<OwnerInfo>({
        name: "",
        username: "",
        email: ""
    });
    const [originalOwnerData, setOriginalOwnerData] = useState<OwnerInfo | null>(null);

    const [shopData, setShopData] = useState<ShopInfo>({
        name: "",
        description: "",
        isOpen: false,
        imageUrl: ""
    });
    const [originalShopData, setOriginalShopData] = useState<ShopInfo | null>(null);

    const hasOwnerChanges = () => {
        if (!originalOwnerData) return false;
        return (
            ownerData.name !== originalOwnerData.name ||
            ownerData.username !== originalOwnerData.username ||
            ownerData.email !== originalOwnerData.email
        );
    };

    const hasShopChanges = () => {
        if (!originalShopData) return false;
        return (
            shopData.name !== originalShopData.name ||
            shopData.description !== originalShopData.description ||
            shopData.isOpen !== originalShopData.isOpen ||
            shopData.imageUrl !== originalShopData.imageUrl
        );
    };

    const hasAnyChanges = () => hasOwnerChanges() || hasShopChanges();

    const fetchData = async () => {
        if (!session?.user?.id) return;

        setLoading(true);
        const currentUserId = parseInt((session.user as any).id);
        setUserId(currentUserId);

        try {
            // Fetch User Data
            const userRes = await fetch(`/api/users/${currentUserId}/update-info`);
            const userData = await userRes.json();

            if (userData.success) {
                const fetchedOwnerData = {
                    name: userData.data.name || "",
                    username: userData.data.username || "",
                    email: userData.data.email || ""
                };
                setOwnerData(fetchedOwnerData);
                setOriginalOwnerData(fetchedOwnerData);
            }

            // Fetch Shop Data
            const myShopRes = await fetch("/api/users/my-shop");
            const myShopData = await myShopRes.json();

            if (myShopData.success && myShopData.shopId) {
                setShopId(myShopData.shopId);

                const infoRes = await fetch(`/api/shops/${myShopData.shopId}/update-info`);
                const infoData = await infoRes.json();

                if (infoData.success) {
                    const fetchedShopData = {
                        name: infoData.data.name || "",
                        description: infoData.data.description || "",
                        isOpen: infoData.data.isOpen || false,
                        imageUrl: infoData.data.imageUrl || ""
                    };
                    setShopData(fetchedShopData);
                    setOriginalShopData(fetchedShopData);
                }
            }
        } catch (error) {
            console.error("Failed to fetch info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchData();
        }
    }, [session]);

    const handleCancel = () => {
        if (originalOwnerData && originalShopData) {
            setOwnerData(originalOwnerData);
            setShopData(originalShopData);
        }
        setIsEditing(false);
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!shopId || !userId) return;

        setSaving(true);
        try {
            let userSuccess = true;
            let shopSuccess = true;
            let errorMessage = "";

            // 1. Update Owner Info if changed
            if (hasOwnerChanges()) {
                const ownerPayload = {
                    name: ownerData.name,
                    username: ownerData.username,
                    email: ownerData.email
                };

                const ownerRes = await fetch(`/api/users/${userId}/update-info`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ownerPayload)
                });
                const ownerResult = await ownerRes.json();

                if (!ownerResult.success) {
                    userSuccess = false;
                    errorMessage = ownerResult.message || "อัปเดตข้อมูลส่วนตัวล้มเหลว";
                }
            }

            // 2. Update Shop Info if changed
            if (hasShopChanges()) {
                const shopPayload = {
                    name: shopData.name,
                    description: shopData.description,
                    isOpen: shopData.isOpen,
                    imageUrl: shopData.imageUrl
                };

                const shopRes = await fetch(`/api/shops/${shopId}/update-info`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(shopPayload)
                });
                const shopResult = await shopRes.json();

                if (!shopResult.success) {
                    shopSuccess = false;
                    errorMessage = errorMessage ? `${errorMessage} และ ${shopResult.message}` : (shopResult.message || "อัปเดตข้อมูลร้านค้าล้มเหลว");
                }
            }

            if (userSuccess && shopSuccess) {
                setOriginalOwnerData(ownerData);
                setOriginalShopData(shopData);
                setMessage({ type: "success", text: "อัปเดตข้อมูลสำเร็จแล้ว!" });
                setIsEditing(false);
                // Scroll to top to see success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setMessage({ type: "error", text: errorMessage });
            }
        } catch (error) {
            console.error("Failed to update info:", error);
            setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                <p className="text-gray-500 font-bold tracking-widest uppercase">กำลังโหลดข้อมูลร้านค้า...</p>
            </div>
        );
    }

    if (!shopId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Store className="w-16 h-16 text-gray-300" />
                <p className="text-gray-500 font-bold text-xl uppercase">ไม่พบข้อมูลร้านค้าของคุณ</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
                        Shop Information
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        ข้อมูลร้านค้า <Store className="w-10 h-10 text-green-500" />
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการรายละเอียดและสถานะร้านค้าของคุณ</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-2xl border font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors ${shopData.isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${shopData.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        {shopData.isOpen ? 'เปิดร้านอยู่' : 'ปิดร้าน'}
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {message.text}
                </div>
            )}

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-8 md:p-12 md:px-16 flex items-center justify-between border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-2xl font-black text-gray-900 drop-shadow-sm flex items-center gap-3">
                        รายละเอียดร้านค้าและผู้ใช้
                    </h2>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(true);
                                setMessage(null);
                            }}
                            className="px-6 py-2.5 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                        >
                            แก้ไขข้อมูล
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="p-8 md:p-12 md:px-16 space-y-12 animate-in fade-in">
                        <OwnerProfileView data={ownerData} />
                        <ShopProfileView data={shopData} />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-8 md:p-12 pl-12 pr-12 space-y-12">
                            <OwnerProfileForm data={ownerData} onChange={setOwnerData} />
                            <ShopProfileForm
                                data={shopData}
                                onChange={setShopData}
                                onError={(msg) => setMessage({ type: "error", text: msg })}
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 md:px-12 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                {hasAnyChanges() && (
                                    <span className="text-sm font-bold text-orange-500 animate-pulse flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500"></div> การเปลี่ยนแปลงยังไม่ถูกบันทึก
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-4 rounded-[1.25rem] font-bold text-sm text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" /> ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={!hasAnyChanges() || saving}
                                    className={`px-8 py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center min-w-[180px] gap-2
                                        ${!hasAnyChanges()
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-200/50 active:scale-95"
                                        }
                                    `}
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" /> <span>บันทึกการเปลี่ยนแปลง</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
