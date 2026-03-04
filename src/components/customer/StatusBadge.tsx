import React from 'react';
import { CreditCard, Timer, CookingPot, CheckCircle, PartyPopper, XCircle } from 'lucide-react';

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    UNPAID: { label: "รอชำระเงิน", color: "bg-green-100 text-green-700 border-green-200", icon: CreditCard },
    PENDING: { label: "เตรียมทำ", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Timer },
    PREPARING: { label: "กำลังทำ", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CookingPot },
    READY: { label: "พร้อมเสิร์ฟ", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    COMPLETED: { label: "เสร็จแล้ว", color: "bg-gray-100 text-gray-600 border-gray-200", icon: PartyPopper },
    CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const Icon = cfg.icon;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-1.5 ${cfg.color}`}>
            <Icon size={14} />
            {cfg.label}
        </span>
    );
}
