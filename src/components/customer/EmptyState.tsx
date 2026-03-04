import { CreditCard, CookingPot, ClipboardList } from "lucide-react";

type EmptyStateTab = "cart" | "inProgress" | "history";

interface EmptyStateProps {
    tab: EmptyStateTab;
}

const EMPTY_STATES: Record<EmptyStateTab, { icon: React.ElementType; title: string; desc: string }> = {
    cart: { icon: CreditCard, title: "ไม่มีรายการค้างจ่าย", desc: "เลือกเมนูที่ชอบแล้วมากดจ่ายเงินที่นี่" },
    inProgress: { icon: CookingPot, title: "ไม่มีออร์เดอร์กำลังทำ", desc: "ออร์เดอร์ที่จ่ายเงินแล้วจะแสดงที่นี่" },
    history: { icon: ClipboardList, title: "ยังไม่มีประวัติ", desc: "ออร์เดอร์ที่เสร็จแล้วหรือถูกยกเลิกจะแสดงที่นี่" },
};

export default function EmptyState({ tab }: EmptyStateProps) {
    const s = EMPTY_STATES[tab];
    const Icon = s.icon;
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-orange-500">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
            <p className="text-gray-500 mt-2">{s.desc}</p>
        </div>
    );
}
