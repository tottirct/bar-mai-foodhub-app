"use client";

// src/app/customer/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

interface Shop {
    id: number;
    name: string;
    description: string | null;
    isOpen: boolean;
    queueCount: number;
}

interface Menu {
    id: number;
    name: string;
    price: number;
    shopId: number;
    imageUrl?: string;
}

interface MenuOption {
    id: number;
    name: string;
    price: number;
    menuId: number;
}

interface MenuDetail extends Menu {
    options: MenuOption[];
    shop: { name: string };
}

/* ─── Add-to-Cart / Direct Order Modal ─── */
function AddToCartModal({
    menu,
    menuDetail,
    loadingDetail,
    shopId,
    shopName,
    userId,
    onClose,
}: {
    menu: Menu;
    menuDetail: MenuDetail | null;
    loadingDetail: boolean;
    shopId: number;
    shopName: string;
    userId: number | null;
    onClose: () => void;
}) {

    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptionIds, setSelectedOptionIds] = useState<Set<number>>(new Set());
    const [specialNote, setSpecialNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleOption = (id: number) => {
        setSelectedOptionIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const options = menuDetail?.options || [];
    const optionsTotal = options
        .filter((o) => selectedOptionIds.has(o.id))
        .reduce((sum, o) => sum + o.price, 0);
    const unitPrice = menu.price + optionsTotal;
    const totalPrice = unitPrice * quantity;

    const handleOrder = () => {
        setSubmitting(true);
        try {
            // ดึงข้อมูลตะกร้าปัจจุบันจาก localStorage
            const localCartStr = localStorage.getItem("barmai_local_orders") || "[]";
            const currentLocalOrders = JSON.parse(localCartStr);

            // สร้างออร์เดอร์ใหม่ (โครงสร้างตามที่ API ต้องการ)
            const newOrder = {
                id: Date.now(), // ใช้ timestamp เป็น id ชั่วคราวสำหรับการแสดงผลในตะกร้า
                userId: userId || 0,
                shopId,

                shopName, // เก็บชื่อร้านไว้แสดงผลในหน้า Trolley
                totalPrice,
                createdAt: new Date().toISOString(),
                items: [{
                    menuId: menu.id,
                    menuName: menu.name, // เก็บชื่อเมนูไว้แสดงผล
                    price: menu.price,
                    quantity,
                    selectedOptions: options
                        .filter((o) => selectedOptionIds.has(o.id))
                        .map((o) => ({
                            optionId: o.id,
                            name: o.name,
                            price: o.price
                        })),
                    specialNote: specialNote || null,
                }],
                note: null,
            };

            // บันทึกลง localStorage
            currentLocalOrders.push(newOrder);
            localStorage.setItem("barmai_local_orders", JSON.stringify(currentLocalOrders));

            // Redirect ไปที่หน้า Trolley
            router.push("/customer/trolley");
        } catch (err) {
            console.error("Error saving to localStorage:", err);
            setError("ไม่สามารถบันทึกรายการได้");
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header image */}
                <div className="relative h-48 w-full bg-gray-100">
                    <Image
                        src={menu.imageUrl || "/images/default-menu.jpg"}
                        alt={menu.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 448px"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-gray-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Error Display */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                            <span>❌</span> {error}
                        </div>
                    )}

                    {/* Menu name & base price */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{menu.name}</h2>
                        <p className="text-orange-600 font-bold mt-1">฿{menu.price}</p>
                    </div>

                    {/* Options */}
                    {loadingDetail ? (
                        <div className="flex items-center gap-3 py-4">
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-400 font-medium">กำลังโหลดตัวเลือกเสริม...</span>
                        </div>
                    ) : options.length > 0 ? (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                ตัวเลือกเสริม
                            </h3>
                            <div className="space-y-2">
                                {options.map((opt) => {
                                    const selected = selectedOptionIds.has(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => toggleOption(opt.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${selected
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selected
                                                        ? "bg-orange-500 border-orange-500"
                                                        : "border-gray-300 bg-white"
                                                        }`}
                                                >
                                                    {selected && (
                                                        <span className="text-white text-xs font-bold">✓</span>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">
                                                    {opt.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-orange-600">+฿{opt.price}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">ไม่มีตัวเลือกเสริมสำหรับเมนูนี้</p>
                    )}

                    {/* Special note */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            หมายเหตุพิเศษ
                        </h3>
                        <textarea
                            value={specialNote}
                            onChange={(e) => setSpecialNote(e.target.value)}
                            placeholder="เช่น ไม่ใส่ผักชี, เผ็ดน้อย..."
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium placeholder:text-gray-400 transition-all resize-none"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">จำนวน</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors text-lg"
                                disabled={submitting}
                            >
                                −
                            </button>
                            <span className="w-8 text-center font-bold text-gray-800 text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors text-lg"
                                disabled={submitting}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer — Order button */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleOrder}
                        disabled={submitting}
                        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2 text-base disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                กำลังส่งออร์เดอร์...
                            </>
                        ) : (
                            <>
                                <span>🛍️</span>
                                สั่งทันที — ฿{totalPrice.toFixed(0)}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function ShopMenuPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [shop, setShop] = useState<Shop | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [menuDetail, setMenuDetail] = useState<MenuDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const { data: session } = useSession();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shopsRes, menuRes] = await Promise.all([
                    fetch(`/api/shops`),
                    fetch(`/api/shops/${id}/menus`),
                ]);

                const shopsData = await shopsRes.json();
                const menuData = await menuRes.json();

                if (shopsData.success && menuData.success) {
                    const foundShop = shopsData.data.find((s: Shop) => s.id === parseInt(id));
                    if (foundShop) {
                        setShop(foundShop);
                    } else {
                        setError("Shop not found in our directory");
                    }
                    setMenus(menuData.data);
                } else {
                    setError(shopsData.message || menuData.message || "Failed to load data");
                }
            } catch (err) {
                console.error("Error fetching shop data:", err);
                setError("An error occurred while loading the shop menu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /* Open modal & fetch menu detail (options) */
    const openOrderModal = async (menu: Menu) => {
        setSelectedMenu(menu);
        setMenuDetail(null);
        setLoadingDetail(true);
        try {
            const res = await fetch(`/api/menus/${menu.id}`);
            const result = await res.json();
            if (result.success) {
                setMenuDetail(result.data);
            }
        } catch (err) {
            console.error("Error fetching menu detail:", err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const filteredMenus = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading menu...</p>
                </div>
            </main>
        );
    }

    if (error || !shop) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || "Shop not found"}</p>
                    <Link
                        href="/customer"
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold"
                    >
                        Go Back
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
            {/* Header / Navigation */}
            <div className="mb-6">
                <Link
                    href="/customer"
                    className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors gap-1 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Shops
                </Link>
            </div>

            {/* Shop Hero Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 mb-0 leading-tight">
                                {shop.name}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${shop.isOpen
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {shop.isOpen ? "OPEN" : "CLOSED"}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium max-w-2xl">
                            {shop.description || "No description available for this shop."}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-orange-500 font-bold">⏱️</span>
                                <span className="text-sm font-semibold text-gray-700">
                                    คิวปัจจุบัน: {shop.queueCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Search & Filter */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800 mb-0">Menu Items</h2>
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <span className="text-lg">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            {/* Menu Grid */}
            {filteredMenus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMenus.map((menu) => (
                        <div
                            key={menu.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            <div className="aspect-square relative flex items-center justify-center bg-gray-50 overflow-hidden">
                                <Image
                                    src={menu.imageUrl || "/images/default-menu.jpg"}
                                    alt={menu.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm text-orange-600 font-bold">
                                    ฿{menu.price}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col grow justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                                        {menu.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                                        อร่อย สด ใหม่ พร้อมเสิร์ฟถึงที่
                                    </p>
                                </div>
                                <button
                                    className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 group/btn"
                                    disabled={!shop.isOpen}
                                    onClick={() => shop.isOpen && openOrderModal(menu)}
                                >
                                    <span className="group-hover/btn:scale-110 transition-transform">🛍️</span>
                                    {shop.isOpen ? "Order Now" : "Shop Closed"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No menu items found.</p>
                </div>
            )}

            {/* Direct Order Modal */}
            {selectedMenu && (
                <AddToCartModal
                    menu={selectedMenu}
                    menuDetail={menuDetail}
                    loadingDetail={loadingDetail}
                    shopId={shop.id}
                    shopName={shop.name}
                    userId={parseInt(session?.user?.id || "0")}
                    onClose={() => {


                        setSelectedMenu(null);
                        setMenuDetail(null);
                    }}
                />
            )}
        </main>
    );
}
