"use client";

// src/app/customer/page.tsx
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Shop {
    id: number;
    name: string;
    description: string | null;
    isOpen: boolean;
    queueCount: number;
    // Fields not currently in DB, using defaults
    category?: string;
    imageUrl?: string;
}

export default function CustomerMainPage() {

    const { data: session } = useSession();
    console.log(session);

    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch("/api/shops");
                const result = await response.json();
                if (result.success) {
                    setShops(result.data);
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

        fetchShops();
    }, []);

    // Filter shops based on search query (name or description)
    const filteredShops = shops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="tracking-tight mb-0">
                        Welcome to Bar Mai FoodHub 🍽️
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Choose Your Restaurant</p>
                </div>

                {/* Search Input Container */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <span className="text-lg">🔍</span>
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
            {filteredShops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredShops.map((shop) => (
                        <Link
                            key={shop.id}
                            // Only navigate to menu page if the shop is open
                            href={shop.isOpen ? `/customer/${shop.id}` : "#"}
                            className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${!shop.isOpen ? "opacity-60 cursor-not-allowed grayscale-[30%]" : ""}`}
                        >
                            {/* Shop image */}
                            <div className="relative h-48 w-full bg-gray-100">
                                <Image
                                    src={shop.imageUrl || "/images/default-menu.jpg"}
                                    alt={shop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                                {/* Open/Closed badge */}
                                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-md ${shop.isOpen ? "bg-green-500/90" : "bg-red-500/90"}`}>
                                    {shop.isOpen ? "เปิด" : "ปิด"}
                                </div>
                                {shop.isOpen && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">
                                        คิว: {shop.queueCount}
                                    </div>
                                )}
                            </div>

                            {/* Shop details */}
                            <div className="p-5 flex flex-col grow justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                        {shop.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                        <p className="text-sm font-medium text-gray-500">{shop.description || "General"}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4">
                        🍽️
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