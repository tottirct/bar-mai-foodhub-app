"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Store,
    Plus,
    ArrowRight,
    Wallet,
    LayoutGrid,
    History,
    Ban,
    Database,
    Loader2,
    AlertCircle,
    Clock,
    Info
} from "lucide-react";
import ShopTransactionModal from "@/components/admin/ShopTransactionModal";
import AddShopModal from "@/components/admin/AddShopModal";
import BanShopModal from "@/components/admin/BanShopModal";

interface ShopData {
    id: string;
    name: string;
    description: string | null;
    isOpen: boolean;
    queueCount: number;
    wallet: number;
    ownerId: string;
}

interface TransactionData {
    summary: {
        income: number;
        withdraw: number;
        refund: number;
        net: number;
    };
    transactions: any[];
}

export default function AdminShopsPage() {
    const { data: session } = useSession();
    const [shops, setShops] = useState<ShopData[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals State
    const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
    const [transactions, setTransactions] = useState<TransactionData | null>(null);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const [isAddingShop, setIsAddingShop] = useState(false);

    const [banningShop, setBanningShop] = useState<ShopData | null>(null);
    const [banReason, setBanReason] = useState("");
    const [isBanning, setIsBanning] = useState(false);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/shops");
            const data = await res.json();
            if (data.success) {
                setShops(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch shops:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async (shop: ShopData) => {
        setSelectedShop(shop);
        setLoadingTransactions(true);
        try {
            // Using Admin User Transactions API instead of Shop Transactions API
            const res = await fetch(`/api/admins/users/${shop.ownerId}/transactions`);
            const data = await res.json();

            if (data.success && data.data.shop_wallet_history) {
                const history = data.data.shop_wallet_history;

                // Calculate summary from history
                let income = 0;
                let withdraw = 0;
                let refund = 0;

                const formattedTransactions = history.map((log: any) => {
                    const meta = log.metadata || {};
                    const amount = meta.amount || 0;

                    if (log.action === 'COMPLETED') income += amount;
                    else if (log.action === 'WITHDRAW') withdraw += amount;
                    else if (log.action === 'REFUND_SUCCESS') refund += amount;

                    return {
                        id: log.id,
                        action: log.action,
                        description: log.description,
                        amount: amount,
                        createdAt: log.createdAt
                    };
                });

                setTransactions({
                    summary: {
                        income,
                        withdraw,
                        refund,
                        net: income - withdraw - refund
                    },
                    transactions: formattedTransactions
                });
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    const handleBan = async () => {
        if (!banningShop || !banReason.trim() || !session?.user) return;

        setIsBanning(true);
        try {
            const res = await fetch(`/api/admins/users/${banningShop.ownerId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminId: (session.user as any).id,
                    reason: banReason
                })
            });
            const data = await res.json();
            if (data.success) {
                await fetchShops();
                setBanningShop(null);
                setBanReason("");
            } else {
                alert(data.message || "Failed to ban shop");
            }
        } catch (error) {
            console.error("Failed to ban shop:", error);
        } finally {
            setIsBanning(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);



    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
                        Shop Management
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Shops <Store className="w-10 h-10 text-green-500" />
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการและตรวจสอบข้อมูร้านค้าทั้งหมดในระบบ</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsAddingShop(true)}
                        className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-gray-200 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5 text-green-400" /> Add Shop
                    </button>
                </div>
            </div>

            {/* Shops Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Shop Info</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Wallet</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Queue</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6"><div className="h-16 bg-gray-50 rounded-3xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : shops.length > 0 ? (
                                shops.map((shop) => (
                                    <tr key={shop.id} className="group hover:bg-green-50/20 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-300 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                                                    <Store className="w-8 h-8 opacity-40" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 leading-none group-hover:text-green-600 transition-colors uppercase tracking-tight">{shop.name}</h3>
                                                    <div className="flex items-center gap-2 mt-2 opacity-60">
                                                        <Info className="w-3 h-3 text-green-500" />
                                                        <span className="text-[11px] font-bold tracking-wide truncate max-w-[200px]">{shop.description || "No description"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${shop.isOpen ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                                {shop.isOpen ? 'Open' : 'Closed'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-green-100/50 rounded-xl"><Wallet className="w-4 h-4 text-green-600" /></div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-xl tracking-tighter">฿{(shop.wallet || 0).toLocaleString()}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-orange-100/50 rounded-xl"><Clock className="w-4 h-4 text-orange-600" /></div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-xl text-gray-900 tracking-tighter">{shop.queueCount}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Orders</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => fetchTransactions(shop)}
                                                    className="p-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-all text-green-400 hover:text-green-600 active:scale-90 border border-green-50"
                                                    title="View Transactions"
                                                >
                                                    <History className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setBanningShop(shop)}
                                                    className="p-3 bg-red-50 hover:bg-red-100 rounded-2xl transition-all text-red-300 hover:text-red-500 active:scale-90 border border-red-50"
                                                    title="Ban Shop"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Database className="w-16 h-16 text-gray-100" />
                                            <div className="space-y-1">
                                                <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">No Shops Found</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ShopTransactionModal
                shop={selectedShop}
                data={transactions}
                loading={loadingTransactions}
                onClose={() => { setSelectedShop(null); setTransactions(null); }}
            />

            <AddShopModal
                isOpen={isAddingShop}
                onClose={() => setIsAddingShop(false)}
                onSuccess={fetchShops}
            />

            <BanShopModal
                shop={banningShop}
                reason={banReason}
                setReason={setBanReason}
                isBanning={isBanning}
                onConfirm={handleBan}
                onCancel={() => { setBanningShop(null); setBanReason(""); }}
            />
        </div>
    );
}
