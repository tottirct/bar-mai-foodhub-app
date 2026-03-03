import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shop } from '@/types/customer';

interface ShopCardProps {
    shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
    return (
        <Link
            href={shop.isOpen ? `/customer/${shop.id}` : "#"}
            className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${!shop.isOpen ? "opacity-60 cursor-not-allowed grayscale-30" : ""}`}
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
    );
}
