// src/components/customer/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
    // Controls the map modal visibility
    const [isMapOpen, setIsMapOpen] = useState(false);
    const pathname = usePathname();

    // Check if a nav link is active (exact match for /customer, prefix match for sub-routes)
    const isActive = (href: string) =>
        href === "/customer" ? pathname === href : pathname.startsWith(href);

    return (
        <>
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 min-h-screen p-5 hidden md:flex flex-col shadow-sm">
                {/* Logo */}
                <div className="mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200 text-lg">
                            🍽️
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">BarMai</h2>
                            <p className="text-xs text-gray-400 font-medium tracking-wide">FoodHub</p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col space-y-1 flex-1">
                    <Link
                        href="/customer"
                        className={`nav-item ${isActive("/customer") ? "nav-item-active" : "nav-item-inactive"}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🏠</span>
                        Main
                        {isActive("/customer") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </Link>
                    <Link
                        href="/customer/credit"
                        className={`nav-item ${isActive("/customer/credit") ? "nav-item-active" : "nav-item-inactive"}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">💰</span>
                        Credit
                        {isActive("/customer/credit") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </Link>
                    <Link
                        href="/customer/information"
                        className={`nav-item ${isActive("/customer/information") ? "nav-item-active" : "nav-item-inactive"}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">ℹ️</span>
                        Information
                        {isActive("/customer/information") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </Link>
                    <Link
                        href="/customer/trolley"
                        className={`nav-item ${isActive("/customer/trolley") ? "nav-item-active" : "nav-item-inactive"}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🛒</span>
                        Trolley
                        {isActive("/customer/trolley") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </Link>
                    <Link
                        href="/customer/waitlist"
                        className={`nav-item ${isActive("/customer/waitlist") ? "nav-item-active" : "nav-item-inactive"}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🕒</span>
                        Wait List
                        {isActive("/customer/waitlist") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                    </Link>

                    {/* Map button — opens modal instead of navigating */}
                    <button
                        onClick={() => setIsMapOpen(true)}
                        className="nav-item nav-item-inactive text-left group"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🗺️</span>
                        Map
                    </button>
                </nav>

                {/* Divider + branding */}
                <div className="mt-auto pt-4 border-t border-gray-100 px-2">
                    <p className="text-[11px] text-gray-300 font-medium text-center tracking-wider">
                        © 2026 BarMai FoodHub
                    </p>
                </div>
            </aside>

            {/* Map modal overlay */}
            {isMapOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMapOpen(false)}
                >
                    {/* Modal content */}
                    <div
                        className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-3xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Close button */}
                        <button
                            onClick={() => setIsMapOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors text-sm"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold mb-4 text-gray-800">แผนที่บาร์ใหม่</h3>

                        {/* Map image placeholder — swap with actual <img> when ready */}
                        <div className="bg-gray-100 rounded-xl w-full h-80 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 font-medium text-lg">
                                📍 Map
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}