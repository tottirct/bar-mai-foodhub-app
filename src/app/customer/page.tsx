// src/app/customer/page.tsx
import Link from "next/link";
import Image from "next/image";
import { mockShops } from "../../lib/mockData";

export default function CustomerMainPage() {
    return (
        <main className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">

            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Welcome to Bar Mai FoodHub 🍽️
                </h1>
                <p className="text-gray-500 mt-2">Choose Your Restaurant</p>
            </div>

            {/* Shop cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockShops.map((shop) => (
                    <Link
                        key={shop.id}
                        // Only navigate to menu page if the shop is open
                        href={shop.isOpen ? `/customer/${shop.id}` : "#"}
                        className={`flex flex-col bg-white rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 
              ${!shop.isOpen && "opacity-60 cursor-not-allowed grayscale-[50%]"}`}
                    >
                        {/* Shop image */}
                        <div className="relative h-48 w-full bg-gray-200">
                            <Image
                                src={shop.imageUrl}
                                alt={shop.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />
                            {/* Open/Closed badge */}
                            <div
                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm
                ${shop.isOpen ? "bg-green-500" : "bg-red-500"}`}
                            >
                                {shop.isOpen ? "เปิด" : "ปิด"}
                            </div>
                        </div>

                        {/* Shop details */}
                        <div className="p-4 flex flex-col flex-grow justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                    {shop.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{shop.category}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </main>
    );
}