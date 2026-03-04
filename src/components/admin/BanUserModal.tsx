"use client";

import { Ban, Loader2 } from "lucide-react";

interface UserData {
    id: number;
    email: string | null;
    name: string | null;
    username: string | null;
    role: string;
}

interface BanUserModalProps {
    user: UserData | null;
    reason: string;
    setReason: (reason: string) => void;
    isBanning: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function BanUserModal({
    user,
    reason,
    setReason,
    isBanning,
    onConfirm,
    onCancel
}: BanUserModalProps) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-red-50 rounded-4xl flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-100">
                        <Ban className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Ban Customer?</h2>
                        <p className="text-gray-400 font-medium">Ban <span className="text-gray-900 font-black">{user.name || user.username}</span>?</p>
                    </div>

                    <div className="text-left mt-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Reason</label>
                        <textarea
                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-semibold text-gray-700 resize-none h-24"
                            placeholder="Enter reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isBanning || !reason.trim()}
                            className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isBanning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Ban"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
