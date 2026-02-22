"use client";

// src/app/customer/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";

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
    imageUrl?: string; // Not in DB yet, using default
}

export default function ShopMenuPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [shop, setShop] = useState<Shop | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ALL shops and menus in parallel
                // Note: We avoid api/shops/[id] as requested
                const [shopsRes, menuRes] = await Promise.all([
                    fetch(`/api/shops`),
                    fetch(`/api/shops/${id}/menus`)
                ]);

                const shopsData = await shopsRes.json();
                const menuData = await menuRes.json();

                if (shopsData.success && menuData.success) {
                    // Find the specific shop from the list
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

    const filteredMenus = menus.filter(menu =>
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
                    <Link href="/customer" className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold">
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
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-0 leading-tight">
                                {shop.name}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${shop.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {shop.isOpen ? "OPEN" : "CLOSED"}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium max-w-2xl">
                            {shop.description || "No description available for this shop."}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-orange-500 font-bold">⏱️</span>
                                <span className="text-sm font-semibold text-gray-700">คิวปัจจุบัน: {shop.queueCount}</span>
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
                                >
                                    <span className="group-hover/btn:scale-110 transition-transform">🛒</span>
                                    {shop.isOpen ? "Add to Cart" : "Shop Closed"}
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
        </main>
    );
}
