"use client";

import {
    Clock,
    ChefHat,
    PackageCheck,
    Loader2,
    User,
    AlertCircle,
    Timer,
    ChevronRight,
    XCircle
} from "lucide-react";

interface OrderItem {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
    selectedOptions: {
        optionId: number;
        name: string;
        price: number;
    }[];
    specialNote?: string;
}

interface Order {
    orderId: number;
    customerName: string;
    totalPrice: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    note: string;
    items: OrderItem[];
}

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: number, status: string) => Promise<void>;
    isUpdating: boolean;
}

export default function OrderCard({ order, onUpdateStatus, isUpdating }: OrderCardProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING': return { icon: Clock, color: "text-orange-500", bg: "bg-orange-50", label: "รอยืนยัน" };
            case 'PREPARING': return { icon: ChefHat, color: "text-blue-500", bg: "bg-blue-50", label: "กำลังทำ" };
            case 'READY': return { icon: PackageCheck, color: "text-green-500", bg: "bg-green-50", label: "รอรับอาหาร" };
            default: return { icon: AlertCircle, color: "text-gray-400", bg: "bg-gray-50", label: status };
        }
    };

    const getNextStatus = (current: string) => {
        if (current === 'PENDING') return { label: 'เริ่มทำอาหาร', value: 'PREPARING', color: 'bg-blue-600' };
        if (current === 'PREPARING') return { label: 'อาหารเสร็จแล้ว', value: 'READY', color: 'bg-green-600' };
        if (current === 'READY') return { label: 'ส่งมอบสำเร็จ', value: 'COMPLETED', color: 'bg-gray-900' };
        return null;
    };

    const calculateTimeElapsed = (isoString: string) => {
        const created = new Date(isoString).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - created) / 60000);
        return Math.max(0, diff);
    };

    const config = getStatusConfig(order.status);
    const next = getNextStatus(order.status);
    const timeDiff = calculateTimeElapsed(order.createdAt);
    const isUrgent = timeDiff > 15;

    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col hover:border-green-200 transition-all group">
            {/* Mini Top Bar */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${config.bg}`}>
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Order</span>
                        <span className="text-sm font-black text-gray-900">#{order.orderId}</span>
                    </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400'}`}>
                    <Timer className={`w-3.5 h-3.5 ${isUrgent ? 'animate-pulse' : ''}`} />
                    {timeDiff} min
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1">
                {/* Performer */}
                <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs font-black text-gray-600 truncate">{order.customerName}</span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-sm">
                            <div className="flex-1">
                                <span className="font-bold text-gray-900 line-clamp-1">{item.menuName}</span>
                                {item.selectedOptions.length > 0 && (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                        {item.selectedOptions.map(o => o.name).join(", ")}
                                    </p>
                                )}
                                {item.specialNote && (
                                    <div className="mt-1 flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md w-fit">
                                        <AlertCircle className="w-3 h-3" />
                                        <span className="text-[9px] font-bold">Note: {item.specialNote}</span>
                                    </div>
                                )}
                            </div>
                            <span className="ml-4 font-black text-gray-400 h-6 flex items-center">x{item.quantity}</span>
                        </div>
                    ))}
                </div>

                {order.note && (
                    <div className="p-3 bg-yellow-50/50 rounded-xl border border-yellow-100/50">
                        <p className="text-[9px] font-black text-yellow-700 uppercase tracking-wider mb-0.5">Message</p>
                        <p className="text-[11px] font-bold text-yellow-900 leading-tight">{order.note}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 mt-auto">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Total</p>
                        <span className="text-xl font-black text-green-600 tracking-tighter">
                            ฿{order.totalPrice.toLocaleString()}
                        </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${config.color} border border-current opacity-40`}>
                        {config.label}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdateStatus(order.orderId, 'CANCELLED')}
                        disabled={isUpdating}
                        className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all active:scale-90 border border-red-50 disabled:opacity-50"
                        title="Cancel"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>

                    {next && (
                        <button
                            onClick={() => onUpdateStatus(order.orderId, next.value)}
                            disabled={isUpdating}
                            className={`flex-1 py-3 ${next.color} hover:brightness-110 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50`}
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{next.label} <ChevronRight className="w-3.5 h-3.5" /></>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
