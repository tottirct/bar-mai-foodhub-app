"use client";

import { useState, useEffect } from "react";
import { Shop } from "@/types/customer";
import ShopCard from "@/components/customer/ShopCard";
import { Utensils, Search } from "lucide-react";

export default function CustomerMainPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const url = searchQuery
                    ? `/api/shops?keyword=${encodeURIComponent(searchQuery)}`
                    : "/api/shops";
                const response = await fetch(url);
                const result = await response.json();
                if (result.success) {
                    setShops(result.data);
                    setError(null);
                } else {
                    setError(result.message || "Failed to fetch shops");
                }
            } catch (err) {
                setError("An error occurred while fetching shops");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchShops();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    if (loading) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading restaurants...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">

            {/* Page header & Search Bar */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black tracking-[0.2em] uppercase">
                        FoodHub
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            ยินดีต้อนรับสู่บาร์ใหม่ <Utensils className="text-green-500 w-10 h-10" />
                        </h1>
                        <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
                            เลือกเมนูอาหารของคุณ
                        </p>
                    </div>
                </div>

                {/* Search Input Container */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search restaurants or food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            {/* Shop cards grid */}
            {shops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {shops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>
            ) : (

                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <Utensils size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No restaurants found</h3>
                    <p className="text-gray-500 mt-2">Try searching with a different keyword</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-6 text-orange-600 font-bold hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

        </main>
    );
}