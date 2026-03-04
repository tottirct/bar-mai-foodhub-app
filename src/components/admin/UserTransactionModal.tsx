"use client";

import { X, Loader2, AlertCircle } from "lucide-react";

interface UserData {
    id: number;
    email: string | null;
    name: string | null;
    username: string | null;
    role: string;
    balance: number | null;
}

interface TransactionData {
    wallet_history?: any[];
    // profile_history is removed as requested
}

interface TransactionModalProps {
    user: UserData | null;
    transactions: TransactionData | null;
    loading: boolean;
    onClose: () => void;
}

export default function UserTransactionModal({ user, transactions, loading, onClose }: TransactionModalProps) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Transactions</h2>
                        <p className="text-gray-400 text-sm font-bold mt-1">History for <span className="text-green-500">{user.name || user.username}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                        </div>
                    ) : transactions ? (
                        <div className="space-y-8">
                            {Object.entries(transactions).map(([key, list]) => {
                                if (!list || list.length === 0) return null;
                                // Double check if key is wallet_history and ignore profile_history if it somehow exists
                                if (key !== 'wallet_history') return null;

                                return (
                                    <div key={key} className="space-y-4">
                                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] border-l-4 border-green-500 pl-3">Wallet History</h3>
                                        <div className="space-y-3">
                                            {list.map((log: any) => (
                                                <div key={log.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-700 leading-tight">{log.description}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                            {new Date(log.createdAt).toLocaleString('th-TH')} • {log.action}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        {(log.metadata?.amount || log.metadata?.totalPrice) && (
                                                            <span className={`text-sm font-black ${log.action === 'WALLET_TOPUP' || log.action === 'REFUND_SUCCESS' ? 'text-green-600' : 'text-red-500'}`}>
                                                                {log.action === 'WALLET_TOPUP' || log.action === 'REFUND_SUCCESS' ? '+' : '-'}฿{(log.metadata.amount || log.metadata.totalPrice).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {!transactions.wallet_history || transactions.wallet_history.length === 0 ? (
                                <div className="py-12 text-center text-gray-300 font-bold uppercase tracking-widest text-sm">
                                    No transaction history found
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <AlertCircle className="w-12 h-12 text-red-200 mx-auto" />
                            <p className="text-gray-400 font-bold mt-4">Error loading data</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
