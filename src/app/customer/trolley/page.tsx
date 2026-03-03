"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { Order } from "@/types/customer";
import OrderCard from "@/components/customer/OrderCard";
import EmptyState from "@/components/customer/EmptyState";

type Tab = "cart" | "inProgress" | "history";



const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "cart", label: "รอชำระเงิน", icon: "💳" },
    { key: "inProgress", label: "กำลังทำ", icon: "🔥" },
    { key: "history", label: "ประวัติ", icon: "📋" },
];

/* ─── Main Page ─── */
export default function TrolleyPage() {
    const [activeTab, setActiveTab] = useState<Tab>("cart");
    const [localOrders, setLocalOrders] = useState<Order[]>([]);
    const [inProgress, setInProgress] = useState<Order[]>([]);
    const [history, setHistory] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;


    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders?userId=${userId}`);
            const result = await res.json();
            if (result.success) {
                // ย้าย PENDING (จ่ายแล้ว) ไปอยู่รวมกับ In Progress
                const dbCart = result.data.cart || [];
                const dbInProgress = result.data.inProgress || [];
                setInProgress([...dbCart, ...dbInProgress]);
                setHistory(result.data.history || []);
            } else {
                setError(result.message || "ไม่สามารถโหลดข้อมูลออร์เดอร์ได้");
            }
        } catch (err) {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    useEffect(() => {
        // Load localStorage orders
        const localOrdersStr = localStorage.getItem("barmai_local_orders") || "[]";
        try {
            const rawLocal = JSON.parse(localOrdersStr);
            // แปลงโครงสร้างให้เข้ากับ interface Order
            const formattedLocal: Order[] = rawLocal.map((lo: any) => ({
                ...lo,
                status: "UNPAID",
                shop: { name: lo.shopName || "ร้านค้า" }
            }));
            setLocalOrders(formattedLocal);
        } catch (e) {
            console.error("Error parsing local orders", e);
        }

        if (status === "authenticated" && userId) {
            const init = async () => {
                setLoading(true);
                await fetchOrders();
                setLoading(false);
            };
            init();
        } else if (status === "unauthenticated") {
            setLoading(false);
            setError("กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า");
        }
    }, [status, userId]);


    const removeLocalOrder = (id: number) => {
        const next = localOrders.filter(o => o.id !== id);
        setLocalOrders(next);
        const toSave = next.map(({ status, shop, ...rest }) => rest);
        localStorage.setItem("barmai_local_orders", JSON.stringify(toSave));
    };

    const handlePayAll = async () => {
        if (localOrders.length === 0) return;
        setPaying(true);
        setError(null);

        try {
            for (const order of localOrders) {
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userId,
                        shopId: order.shopId,

                        items: order.items,
                        note: order.note
                    })
                });
                const data = await res.json();
                if (!data.success) {
                    throw new Error(data.message || `จ่ายเงินร้าน ${order.shop.name} ไม่สำเร็จ`);
                }
            }

            localStorage.setItem("barmai_local_orders", "[]");
            setLocalOrders([]);
            alert("ชำระเงินสำเร็จแล้ว! รายการของคุณย้ายไปที่แถบ 'กำลังทำ' ครับ");

            await fetchOrders();
            setActiveTab("inProgress");
        } catch (err: any) {
            setError(err.message || "เกิดข้อผิดพลาดในการชำระเงิน");
        } finally {
            setPaying(false);
        }
    };

    const ordersMap: Record<Tab, Order[]> = { cart: localOrders, inProgress, history };
    const currentOrders = ordersMap[activeTab];
    const totalToPay = localOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    if (loading) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">กำลังโหลดออร์เดอร์...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold"
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Trolley 🛒</h1>
                <p className="text-gray-500 font-medium">จัดการออร์เดอร์และดูประวัติการสั่งของคุณ</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
                {TABS.map((tab) => {
                    const count = ordersMap[tab.key].length;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${isActive
                                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold px-1.5 ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Order Cards */}
            {activeTab === "cart" && localOrders.length > 0 && (
                <div className="mb-6 p-6 bg-orange-500 rounded-3xl shadow-lg shadow-orange-200 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                            💰
                        </div>
                        <div>
                            <p className="text-orange-100 text-sm font-bold uppercase tracking-wider">ยอดรวมที่ต้องชำระ</p>
                            <h2 className="text-3xl font-bold">฿{totalToPay.toFixed(0)}</h2>
                        </div>
                    </div>
                    <button
                        onClick={handlePayAll}
                        disabled={paying}
                        className="w-full md:w-auto px-10 py-4 bg-white text-orange-600 font-extrabold rounded-2xl shadow-sm hover:scale-105 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {paying ? (
                            <>
                                <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                กำลังจ่าย...
                            </>
                        ) : (
                            <>
                                <span>💳</span> จ่ายเงินทั้งหมด
                            </>
                        )}
                    </button>
                </div>
            )}

            {currentOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {currentOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onRemove={activeTab === "cart" ? removeLocalOrder : undefined}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState tab={activeTab} />
            )}
        </main>
    );
}
