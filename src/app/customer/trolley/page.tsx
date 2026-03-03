"use client";

// src/app/customer/trolley/page.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


type Tab = "cart" | "inProgress" | "history";

interface SelectedOption {
    optionId: number;
    name: string;
    price: number;
}

interface OrderItem {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialNote?: string | null;
}

interface Order {
    id: number;
    userId: number;
    shopId: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    shop: { name: string };
    items: OrderItem[];
    note?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    UNPAID: { label: "รอชำระเงิน", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "💳" },
    PENDING: { label: "เตรียมทำ", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "⏳" },
    PREPARING: { label: "กำลังทำ", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "👨‍🍳" },
    READY: { label: "พร้อมเสิร์ฟ", color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
    COMPLETED: { label: "เสร็จแล้ว", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "🎉" },
    CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-600 border-red-200", icon: "❌" },
};

const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "cart", label: "รอชำระเงิน", icon: "💳" },
    { key: "inProgress", label: "กำลังทำ", icon: "🔥" },
    { key: "history", label: "ประวัติ", icon: "📋" },
];

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

/* ─── Order Card ─── */
function OrderCard({
    order,
    onRemove
}: {
    order: Order;
    onRemove?: (id: number) => void;
}) {
    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-dashed border-gray-100" />

            {/* Items list */}
            <div className="px-5 py-3 space-y-2 flex-grow">
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

/* ─── Empty State ─── */
function EmptyState({ tab }: { tab: Tab }) {
    const msg: Record<Tab, { icon: string; title: string; desc: string }> = {
        cart: { icon: "💳", title: "ไม่มีรายการค้างจ่าย", desc: "เลือกเมนูที่ชอบแล้วมากดจ่ายเงินที่นี่" },
        inProgress: { icon: "🍳", title: "ไม่มีออร์เดอร์กำลังทำ", desc: "ออร์เดอร์ที่จ่ายเงินแล้วจะแสดงที่นี่" },
        history: { icon: "📋", title: "ยังไม่มีประวัติ", desc: "ออร์เดอร์ที่เสร็จแล้วหรือถูกยกเลิกจะแสดงที่นี่" },
    };
    const s = msg[tab];
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
            <p className="text-gray-500 mt-2">{s.desc}</p>
        </div>
    );
}

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
