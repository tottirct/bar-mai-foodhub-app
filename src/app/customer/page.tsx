"use client";

// src/app/customer/page.tsx
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { mockShops } from "../../lib/mockData";

export default function CustomerMainPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter shops based on search query (name or category)
    const filteredShops = mockShops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="main-container">

            {/* Page header & Search Bar */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="tracking-tight mb-0">
                        Welcome to Bar Mai FoodHub 🍽️
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Choose Your Restaurant</p>
                </div>

                {/* Search Input Container */}
                <div className="search-container">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <span className="text-lg">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search restaurants or food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Shop cards grid */}
            {filteredShops.length > 0 ? (
                <div className="restaurant-grid">
                    {filteredShops.map((shop) => (
                        <Link
                            key={shop.id}
                            // Only navigate to menu page if the shop is open
                            href={shop.isOpen ? `/customer/${shop.id}` : "#"}
                            className={`restaurant-card ${!shop.isOpen ? "opacity-60 cursor-not-allowed grayscale-[30%]" : ""}`}
                        >
                            {/* Shop image */}
                            <div className="card-img-container">
                                <Image
                                    src={shop.imageUrl}
                                    alt={shop.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                                {/* Open/Closed badge */}
                                <div className={`badge-base ${shop.isOpen ? "badge-open" : "badge-closed"}`}>
                                    {shop.isOpen ? "เปิด" : "ปิด"}
                                </div>
                            </div>

                            {/* Shop details */}
                            <div className="card-content">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                        {shop.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                        <p className="text-sm font-medium text-gray-500">{shop.category}</p>
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
                        className="btn-clear"
                    >
                        Clear search
                    </button>
                </div>
            )}

        </main>
    );
}
