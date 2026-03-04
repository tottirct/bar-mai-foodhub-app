"use client";

import { useState } from "react";
import { X, Store, User, Mail, Lock, Plus, Loader2, Info } from "lucide-react";

interface AddShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddShopModal({ isOpen, onClose, onSuccess }: AddShopModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shopName: "",
        description: "",
        ownerName: "",
        username: "",
        email: "",
        password: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // UI Mockup: Simulate API call
        // Logic: In real app, this should POST to a new API endpoint
        setTimeout(() => {
            alert("Note: This feature requires backend API implementation. Please send the requirements to your backend team.");
            setLoading(false);
            onClose();
            onSuccess();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-green-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-200">
                            <Store className="w-7 h-7" />
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-2xl text-gray-400 transition-all border border-gray-100 shadow-sm"><X className="w-6 h-6" /></button>
                </div>

                {/* Content */}
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">ยังทำไม่ได้</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
