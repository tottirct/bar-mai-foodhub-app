"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Banknote,
    TrendingUp,
    TrendingDown,
    History,
    Loader2,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Undo2,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import WithdrawModal from "@/components/owner/WithdrawModal";

interface Transaction {
    id: string;
    action: string;
    description: string;
    amount: number;
    createdAt: string;
    orderId: number | null;
}

interface Summary {
    income: number;
    withdraw: number;
    refund: number;
    net: number;
}

export default function OwnerTransactionsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [shopBalance, setShopBalance] = useState<number>(0);
    const [shopId, setShopId] = useState<string | null>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchData = async () => {
        if (!session?.user?.id) return;
        try {
            // 1. Get Shop ID and Balance
            const shopRes = await fetch("/api/shops");
            const shopData = await shopRes.json();
            if (!shopData.success) throw new Error("Failed to fetch shops");

            const myShop = shopData.data.find((s: any) => s.ownerId === session.user?.id);
            if (!myShop) {
                setError("No shop linked to this account");
                setLoading(false);
                return;
            }
            setShopId(myShop.id);
            setShopBalance(myShop.wallet || 0);

            // 2. Get Transactions
            const transRes = await fetch(`/api/shops/${myShop.id}/transactions`);
            const transData = await transRes.json();
            if (transData.success) {
                setTransactions(transData.transactions);
            } else {
                setError(transData.message || "Failed to fetch transactions");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    const handleWithdraw = async (amount: number) => {
        if (!shopId) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/shops/${shopId}/wallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (data.success) {
                await fetchData(); // Refresh data
                setIsWithdrawModalOpen(false);
            } else {
                alert(data.message || "การถอนเงินล้มเหลว");
            }
        } catch (error) {
            console.error("Withdrawal error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Financial Records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-[3rem] gap-6">
                <div className="p-8 bg-red-50 rounded-full">
                    <AlertCircle className="w-16 h-16 text-red-300" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter italic">Oops! Something went wrong</h3>
                    <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
                        Shop Wallet
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Transactions <Banknote className="w-10 h-10 text-green-500" />
                    </h1>
                    <p className="text-gray-500 font-medium">ติดตามรายได้และประวัติทางการเงินของร้านค้า</p>
                </div>
            </div>

            {/* Summary Grid - Simplified to only show Shop Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Net Balance Card */}
                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-green-200 relative overflow-hidden group col-span-1 md:col-span-2">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
                        <div>
                            <p className="text-green-100 font-bold uppercase tracking-wider text-[10px] mb-2">Total Wallet Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black tracking-tighter">฿{shopBalance.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-green-100 text-xs font-bold bg-white/20 w-fit px-3 py-1.5 rounded-full">
                                <CheckCircle2 className="w-4 h-4" /> Available Balance
                            </div>
                        </div>

                        <button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="bg-white text-green-600 px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all group/btn"
                        >
                            <Banknote className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            Withdraw Money
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Recent Activity <History className="w-6 h-6 text-green-500" />
                    </h2>
                    <span className="bg-gray-100 text-gray-500 text-[10px] px-4 py-2 rounded-full font-black tracking-widest uppercase">History</span>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[400px]">
                    <div className="p-2">
                        {transactions.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="p-6 hover:bg-gray-50/50 transition-all flex items-center gap-6 group first:rounded-t-[2rem] last:rounded-b-[2rem]">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform ${tx.action === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                            tx.action === 'WITHDRAW' ? 'bg-red-50 text-red-500' :
                                                'bg-orange-50 text-orange-500'
                                            }`}>
                                            {tx.action === 'COMPLETED' ? <ArrowUpRight className="w-7 h-7" /> :
                                                tx.action === 'WITHDRAW' ? <Banknote className="w-7 h-7" /> :
                                                    <Undo2 className="w-7 h-7" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-gray-900 leading-none group-hover:text-green-600 transition-colors uppercase tracking-tight truncate">
                                                    {tx.description}
                                                </p>
                                                {tx.orderId && (
                                                    <span className="bg-gray-100 text-gray-400 text-[9px] font-black px-1.5 py-0.5 rounded">#{tx.orderId}</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <span>{new Date(tx.createdAt).toLocaleDateString('th-TH', {
                                                    day: '2-digit', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                <span className={tx.action === 'COMPLETED' ? 'text-green-500' : tx.action === 'WITHDRAW' ? 'text-red-500' : 'text-orange-500'}>
                                                    {tx.action}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className={`text-2xl font-black tracking-tighter ${tx.action === 'COMPLETED' ? 'text-green-600' :
                                                tx.action === 'WITHDRAW' || tx.action === 'REFUND_SUCCESS' ? 'text-red-500' :
                                                    'text-gray-900'
                                                }`}>
                                                {tx.action === 'COMPLETED' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 flex flex-col items-center gap-4">
                                <Banknote className="w-16 h-16 text-gray-100" />
                                <div className="text-center space-y-1">
                                    <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">No transactions yet</p>
                                    <p className="text-gray-300 font-bold text-xs uppercase tracking-widest">Financial activities will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={handleWithdraw}
                balance={shopBalance}
                isProcessing={isProcessing}
            />
        </div>
    );
}
