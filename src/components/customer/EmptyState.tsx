import React from 'react';

type EmptyStateTab = "cart" | "inProgress" | "history";

interface EmptyStateProps {
    tab: EmptyStateTab;
}

const EMPTY_STATES: Record<EmptyStateTab, { icon: string; title: string; desc: string }> = {
    cart: { icon: "💳", title: "ไม่มีรายการค้างจ่าย", desc: "เลือกเมนูที่ชอบแล้วมากดจ่ายเงินที่นี่" },
    inProgress: { icon: "🍳", title: "ไม่มีออร์เดอร์กำลังทำ", desc: "ออร์เดอร์ที่จ่ายเงินแล้วจะแสดงที่นี่" },
    history: { icon: "📋", title: "ยังไม่มีประวัติ", desc: "ออร์เดอร์ที่เสร็จแล้วหรือถูกยกเลิกจะแสดงที่นี่" },
};

export default function EmptyState({ tab }: EmptyStateProps) {
    const s = EMPTY_STATES[tab];
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
            <p className="text-gray-500 mt-2">{s.desc}</p>
        </div>
    );
}
