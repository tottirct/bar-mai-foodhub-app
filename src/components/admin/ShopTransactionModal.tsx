"use client";

import { X, Loader2, AlertCircle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface ShopData {
    id: string;
    name: string;
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

interface ShopTransactionModalProps {
    shop: ShopData | null;
    data: TransactionData | null;
    loading: boolean;
    onClose: () => void;
}

export default function ShopTransactionModal({ shop, data, loading, onClose }: ShopTransactionModalProps) {
    if (!shop) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Shop Stats</h2>
                        <p className="text-gray-400 text-sm font-bold mt-1 tracking-tight">Financial overview for <span className="text-green-600 font-extrabold">{shop.name}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all active:scale-95"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto space-y-8 flex-1">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Syncing Data...</p>
                        </div>
                    ) : data ? (
                        <>
                            {/* Transaction List */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] border-l-4 border-green-500 pl-3">Recent Activities</h3>
                                <div className="space-y-3">
                                    {data.transactions.length > 0 ? (
                                        data.transactions.map((tx) => (
                                            <div key={tx.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between gap-4 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-gray-700 leading-tight">{tx.description}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                        {new Date(tx.createdAt).toLocaleString('th-TH')} • <span className="text-green-500">{tx.action}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-lg font-black tracking-tighter ${tx.action === 'WITHDRAW' || tx.action === 'REFUND_SUCCESS' ? 'text-red-500' : 'text-green-600'}`}>
                                                        {tx.action === 'WITHDRAW' || tx.action === 'REFUND_SUCCESS' ? '-' : '+'}฿{tx.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <AlertCircle className="w-16 h-16 text-red-200 mx-auto" />
                            <p className="text-gray-400 font-black uppercase tracking-tight">Failed to load shop data</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
