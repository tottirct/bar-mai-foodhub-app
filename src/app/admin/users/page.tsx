"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    User as UserIcon,
    Wallet,
    Mail,
    UserCircle,
    History,
    Ban,
    Database
} from "lucide-react";
import UserTransactionModal from "@/components/admin/UserTransactionModal";
import BanUserModal from "@/components/admin/BanUserModal";

interface UserData {
    id: number;
    email: string | null;
    name: string | null;
    username: string | null;
    role: string;
    balance: number | null;
}

interface TransactionData {
    wallet_history?: any[];
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    // Transaction Modal State
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [transactions, setTransactions] = useState<TransactionData | null>(null);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Ban Modal State
    const [banningUser, setBanningUser] = useState<UserData | null>(null);
    const [banReason, setBanReason] = useState("");
    const [isBanning, setIsBanning] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admins/users");
            const data = await res.json();
            if (data.success) {
                // Filter for ONLY customers as requested
                const customersOnly = data.data.filter((u: UserData) => u.role === "CUSTOMER");
                setUsers(customersOnly);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async (user: UserData) => {
        setSelectedUser(user);
        setLoadingTransactions(true);
        try {
            const res = await fetch(`/api/admins/users/${user.id}/transactions`);
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    const handleBan = async () => {
        if (!banningUser || !session?.user) return;

        setIsBanning(true);
        try {
            const res = await fetch(`/api/admins/users/${banningUser.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminId: (session.user as any).id,
                    reason: banReason
                })
            });
            const data = await res.json();
            if (data.success) {
                setUsers(users.filter(u => u.id !== banningUser.id));
                setBanningUser(null);
                setBanReason("");
            } else {
                alert(data.message || "ลบไม่สำเร็จ");
            }
        } catch (error) {
            console.error("Failed to ban user:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setIsBanning(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);



    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
                        Customer Management
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Customers <Users className="w-10 h-10 text-green-500" />
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการและตรวจสอบข้อมูลลูกค้าทั้งหมดในระบบ</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Customer Info</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Wallet</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={3} className="px-8 py-6"><div className="h-16 bg-gray-50 rounded-3xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-green-50/20 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-300 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                                                    <UserCircle className="w-9 h-9 opacity-40" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 leading-none group-hover:text-green-600 transition-colors tracking-tight">{user.name || "Anonymous"}</h3>
                                                    <div className="flex items-center gap-2 mt-2 opacity-60">
                                                        <Mail className="w-3 h-3 text-green-500" />
                                                        <span className="text-[11px] font-bold tracking-wide">{user.email || "No email"}</span>
                                                    </div>
                                                    {user.username && (
                                                        <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">@{user.username}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-green-100/50 rounded-xl"><Wallet className="w-4 h-4 text-green-600" /></div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-xl text-gray-900 tracking-tighter">฿{user.balance?.toLocaleString() || "0"}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => fetchTransactions(user)}
                                                    className="p-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-all text-green-400 hover:text-green-600 active:scale-90 border border-green-50"
                                                    title="View Transactions"
                                                >
                                                    <History className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setBanningUser(user)}
                                                    className="p-3 bg-red-50 hover:bg-red-100 rounded-2xl transition-all text-red-300 hover:text-red-500 active:scale-90 border border-red-50"
                                                    title="Ban User"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Database className="w-16 h-16 text-gray-100" />
                                            <div className="space-y-1">
                                                <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">No Customers Found</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserTransactionModal
                user={selectedUser}
                transactions={transactions}
                loading={loadingTransactions}
                onClose={() => { setSelectedUser(null); setTransactions(null); }}
            />

            <BanUserModal
                user={banningUser}
                reason={banReason}
                setReason={setBanReason}
                isBanning={isBanning}
                onConfirm={handleBan}
                onCancel={() => { setBanningUser(null); setBanReason(""); }}
            />
        </div>
    );
}
