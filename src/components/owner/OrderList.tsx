"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ScrollText, Database } from "lucide-react";
import OrderCard from "./OrderCard";

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

interface OrderListProps {
    shopId: number;
}

export default function OrderList({ shopId }: OrderListProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`/api/shops/${shopId}/orders`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }, [shopId]);

    useEffect(() => {
        fetchOrders();
        // Set up polling every 10 seconds for new orders
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleUpdateStatus = async (orderId: number, status: string) => {
        setUpdatingOrderId(orderId);
        try {
            const res = await fetch(`/api/shops/${shopId}/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh list
                await fetchOrders();
            } else {
                alert(data.message || "Failed to update order");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Error connecting to server");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Loading Orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-[3rem] gap-6">
                <div className="p-8 bg-gray-50 rounded-full">
                    <Database className="w-16 h-16 text-gray-200" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter italic">No Active Orders</h3>
                    <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">When customers order, they will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
                <OrderCard
                    key={order.orderId}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    isUpdating={updatingOrderId === order.orderId}
                />
            ))}
        </div>
    );
}
