"use client";

// src/app/customer/layout.tsx
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMapOpen, setIsMapOpen] = useState(false);

    const sidebarItems = [
        { label: "หน้าแรก", href: "/customer", icon: "Home" },
        { label: "เครดิต", href: "/customer/credit", icon: "Wallet" },
        { label: "ข้อมูล", href: "/customer/information", icon: "Info" },
        { label: "รถเข็น", href: "/customer/trolley", icon: "ShoppingCart" },
        { label: "แผนที่", href: "#", icon: "Map", onClick: () => setIsMapOpen(true) },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar items={sidebarItems} />
            <div className="flex-1 h-full overflow-y-auto">
                {children}
            </div>

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

                        {/* Map image placeholder */}
                        <div className="bg-gray-100 rounded-xl w-full h-[500px] flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 font-medium text-lg">
                                📍 แผนที่
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}