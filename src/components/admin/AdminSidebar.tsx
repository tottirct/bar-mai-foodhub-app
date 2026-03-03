// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/admin" ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 min-h-screen p-5 hidden md:flex flex-col shadow-sm">
            {/* Logo */}
            <div className="mb-10 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200 text-lg">
                        🛡️
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin</h2>
                        <p className="text-xs text-gray-400 font-medium tracking-wide text-nowrap">Control Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col space-y-1 flex-1">
                <Link
                    href="/admin"
                    className={`nav-item ${isActive("/admin") ? "nav-item-active" : "nav-item-inactive"}`}
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                    Log
                    {isActive("/admin") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </Link>
                <Link
                    href="/admin/shops"
                    className={`nav-item ${isActive("/admin/shops") ? "nav-item-active" : "nav-item-inactive"}`}
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">🏪</span>
                    Shops
                    {isActive("/admin/shops") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </Link>
                <Link
                    href="/admin/users"
                    className={`nav-item ${isActive("/admin/users") ? "nav-item-active" : "nav-item-inactive"}`}
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">👥</span>
                    Users
                    {isActive("/admin/users") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </Link>
            </nav>

            {/* Divider + branding */}
            <div className="mt-auto pt-4 border-t border-gray-100 px-2">
                <p className="text-[11px] text-gray-300 font-medium text-center tracking-wider">
                    © 2026 Admin Panel
                </p>
            </div>
        </aside>
    );
}
