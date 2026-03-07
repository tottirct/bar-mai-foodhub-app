"use client";

import { useState, useEffect } from "react";
import { Wallet, CreditCard, Zap, CheckCircle, XCircle, PlusCircle, Undo2, ShoppingCart, ScrollText } from "lucide-react";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Transaction, WalletData } from "@/types/customer";



export default function CreditPage() {
    const router = useRouter();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [topupLoading, setTopupLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const { data: session, status } = useSession();
    const userId = session?.user?.id || null;


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
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-6xl">
            {/* Header Section */}
            <div className="mb-10 space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black tracking-[0.2em] uppercase">
                    Credit Balance
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        เครดิตของฉัน <Wallet className="text-green-500 w-10 h-10" />
                    </h1>
                    <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
                        จัดการยอดเงินและดูประวัติการใช้งานของคุณ
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Column: Balance & Top-up */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-lg shadow-green-200 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-green-100 font-bold uppercase tracking-wider text-sm mb-1">ยอดคงเหลือในบัญชี</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{walletData?.wallet.toLocaleString() || 0}</span>
                                <span className="text-xl font-bold opacity-80">บาท</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6 opacity-20 text-white">
                            <CreditCard size={60} />
                        </div>
                    </div>

                    {/* Top-up Selection */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            เติมเงินเครดิต <Zap size={24} className="text-green-500 fill-green-500" />
                        </h2>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            {[100, 300, 500, 1000, 3000, 5000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleTopup(amount)}
                                    disabled={topupLoading}
                                    className="p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="text-lg font-black text-gray-800 group-hover:text-green-600">
                                        ฿{amount}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold group-hover:text-green-400">
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
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[700px]">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">ประวัติการทำรายการ</h2>
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full font-black tracking-widest leading-none">LATEST</span>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 space-y-2">

                        {walletData?.transactions && walletData.transactions.length > 0 ? (
                            walletData.transactions.slice().map((tx) => (

                                <div key={tx.id} className="p-4 rounded-2xl hover:bg-surface-100 transition-colors flex items-center gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.action === 'WALLET_TOPUP' || tx.action === 'REFUND_SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-brand-secondary text-brand-primary'}`}>
                                        {tx.action === 'WALLET_TOPUP' ? <PlusCircle size={24} /> : tx.action === 'REFUND_SUCCESS' ? <Undo2 size={24} /> : <ShoppingCart size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors leading-tight">
                                            {tx.description}{tx.action === 'ORDER_PLACED' ? ' บาท' : ''}
                                        </p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={`font-black text-lg ${tx.action === 'WALLET_TOPUP' || tx.action === 'REFUND_SUCCESS' ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.action === 'WALLET_TOPUP' || tx.action === 'REFUND_SUCCESS' ? '+' : '-'}฿{(tx.metadata.amount || tx.metadata.totalPrice || 0).toFixed(0)}
                                        </p>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center px-4 flex flex-col items-center">
                                <ScrollText size={48} className="mb-4 text-gray-200" />
                                <p className="text-gray-400 font-bold text-sm">ไม่มีประวัติการทำรายการ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
