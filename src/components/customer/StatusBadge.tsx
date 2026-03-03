import React from 'react';

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    UNPAID: { label: "รอชำระเงิน", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "💳" },
    PENDING: { label: "เตรียมทำ", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "⏳" },
    PREPARING: { label: "กำลังทำ", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "👨‍🍳" },
    READY: { label: "พร้อมเสิร์ฟ", color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
    COMPLETED: { label: "เสร็จแล้ว", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "🎉" },
    CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-600 border-red-200", icon: "❌" },
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${cfg.color}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}
