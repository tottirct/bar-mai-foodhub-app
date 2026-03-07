"use client";

import { useState } from "react";
import { Banknote, Loader2, X, Wallet, AlertCircle } from "lucide-react";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => Promise<void>;
    balance: number;
    isProcessing: boolean;
}

export default function WithdrawModal({
    isOpen,
    onClose,
    onConfirm,
    balance,
    isProcessing
}: WithdrawModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("กรุณาระบุจำนวนเงินที่ถูกต้อง");
            return;
        }
        if (numAmount > balance) {
            setError("ยอดเงินในวอลเลทไม่เพียงพอ");
            return;
        }
        setError(null);
        await onConfirm(numAmount);
        setAmount("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-50 rounded-4xl flex items-center justify-center mx-auto text-green-500 shadow-xl shadow-green-100">
                        <Banknote className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">ถอนเงิน</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">Withdrawal from Shop Wallet</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                            <span>Available Balance</span>
                            <span className="text-green-600">฿{balance.toLocaleString()}</span>
                        </div>

                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xl italic">฿</div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-12 pr-6 py-5 bg-white border-2 border-transparent rounded-2xl focus:border-green-500 outline-none transition-all font-black text-3xl tracking-tighter text-gray-900 placeholder:text-gray-200"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest justify-center">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing || !amount}
                            className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Withdrawal"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
