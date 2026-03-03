import React from 'react';
import StatusBadge from './StatusBadge';
import { Order } from '@/types/customer';

interface OrderCardProps {
    order: Order;
    onRemove?: (id: number) => void;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderCard({ order, onRemove }: OrderCardProps) {
    const isLocal = order.status === "UNPAID";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg shrink-0">
                        🏪
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{order.shop.name}</h3>
                        <p className="text-xs text-gray-400 font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isLocal && onRemove && (
                        <button
                            onClick={() => onRemove(order.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                            title="ลบรายการ"
                        >
                            🗑️
                        </button>
                    )}
                    <StatusBadge status={order.status} />
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-dashed border-gray-100" />

            {/* Items list */}
            <div className="px-5 py-3 space-y-2 grow">
                {order.items.map((item, idx) => (

                    <div key={idx} className="space-y-1">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-700 text-sm truncate">
                                    {item.menuName}
                                    <span className="text-gray-400 font-medium ml-1">×{item.quantity}</span>
                                </p>
                            </div>
                            <span className="text-sm font-bold text-gray-600 shrink-0">
                                ฿{(item.price * item.quantity).toFixed(0)}
                            </span>
                        </div>

                        {item.selectedOptions.map((o, optIdx) => (
                            <div key={optIdx} className="flex items-center justify-between gap-4 text-xs text-gray-400">
                                <span className="truncate flex-1 pl-3">+ {o.name}</span>
                                <span className="shrink-0 font-medium text-gray-400">+฿{(o.price * item.quantity).toFixed(0)}</span>
                            </div>
                        ))}

                        {item.specialNote && (
                            <p className="text-xs text-orange-500 mt-0.5 truncate pl-3">📝 {item.specialNote}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Note */}
            {order.note && (
                <div className="mx-5 px-3 py-2 bg-orange-50/60 rounded-xl mb-3">
                    <p className="text-xs text-orange-600 font-medium">💬 {order.note}</p>
                </div>
            )}

            {/* Footer — Total */}
            <div className="px-5 py-4 bg-gray-50/80 flex items-center justify-between border-t border-gray-100 mt-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">รวมทั้งหมด</span>
                <span className="text-lg font-bold text-orange-600">฿{order.totalPrice.toFixed(0)}</span>
            </div>
        </div>
    );
}
