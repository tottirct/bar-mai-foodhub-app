"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    userId: number;
    action: string;
    description: string;
    metadata: {
        amount?: number;
        totalPrice?: number;
    };

    createdAt: string;
}

interface WalletData {
    wallet: number;
    transactions: Transaction[];
}

export default function CreditPage() {
    const router = useRouter();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [topupLoading, setTopupLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { data: session, status } = useSession();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;


    const fetchWalletData = async () => {
        try {
            const response = await fetch(`/api/users/${userId}/wallet`);
            const result = await response.json();
            if (result.success) {
                setWalletData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && userId) {
            fetchWalletData();
        } else if (status === "unauthenticated") {
            setLoading(false);
            setMessage({ type: "error", text: "กรุณาเข้าสู่ระบบเพื่อดูข้อมูลเครดิต" });
        }
    }, [status, userId]);


    const handleTopup = async (amount: number) => {
        setTopupLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/users/${userId}/wallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            const result = await response.json();
            if (result.success) {
                setMessage({ type: "success", text: "เติมเงินสำเร็จ เจ๋งจัดอ้ะ! 🚀" });
                fetchWalletData(); // Refresh data
            } else {
                setMessage({ type: "error", text: result.message || "เติมเงินไม่สำเร็จ ลองใหม่นะ" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
        } finally {
            setTopupLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-4xl">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">เครดิตของฉัน 💰</h1>
                <p className="text-gray-500 font-medium">จัดการยอดเงินและดูประวัติการใช้งานของคุณ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Balance & Top-up */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-orange-100 font-bold uppercase tracking-wider text-sm mb-1">ยอดคงเหลือในบัญชี</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{walletData?.wallet.toLocaleString() || 0}</span>
                                <span className="text-xl font-bold opacity-80">บาท</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6 opacity-20 text-6xl">💳</div>
                    </div>

                    {/* Top-up Selection */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            เติมเงินเครดิต ⚡
                        </h2>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                <span>{message.type === 'success' ? '✅' : '❌'}</span>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            {[100, 300, 500, 1000, 3000, 5000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleTopup(amount)}
                                    disabled={topupLoading}
                                    className="p-4 rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="text-lg font-black text-gray-800 group-hover:text-orange-600">
                                        ฿{amount}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold group-hover:text-orange-400">
                                        เติมเงิน
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 text-xs font-medium">
                                * การเติมเงินเป็นการจำลองระบบ ไม่มีการหักเงินจริง
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-fit lg:max-h-[700px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">ประวัติการทำรายการ</h2>
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full font-black">LATEST</span>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {walletData?.transactions && walletData.transactions.length > 0 ? (
                            walletData.transactions.slice().map((tx) => (

                                <div key={tx.id} className="p-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${tx.action === 'WALLET_TOPUP' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {tx.action === 'WALLET_TOPUP' ? '➕' : '🛒'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-800 truncate text-wrap">{tx.description}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            {new Date(tx.createdAt).toLocaleDateString('th-TH', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className={`text-sm font-black whitespace-nowrap ${tx.action === 'WALLET_TOPUP' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {tx.action === 'WALLET_TOPUP' ? '+' : '-'}{tx.metadata?.amount || tx.metadata?.totalPrice || 0}

                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center px-4">
                                <div className="text-4xl mb-4 opacity-20">📜</div>
                                <p className="text-gray-400 font-bold text-sm">ไม่มีประวัติการทำรายการ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
