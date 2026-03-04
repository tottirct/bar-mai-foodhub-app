"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  CreditCard,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock
} from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  userId: number;
  shopId?: number; // Added shopId
  userRole: string;
  metadata?: any;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admins/logs", window.location.origin);
      if (category) url.searchParams.append("category", category);
      url.searchParams.append("page", page.toString());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [category, page]);

  const categories = [
    { id: null, label: "All Logs", icon: Activity, color: "text-gray-500", bg: "bg-gray-100" },
    { id: "finance", label: "Finance", icon: CreditCard, color: "text-green-600", bg: "bg-green-100" },
    { id: "account", label: "Accounts", icon: Shield, color: "text-blue-600", bg: "bg-blue-100" },
    { id: "menu", label: "Menu & Shop", icon: Settings, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('WALLET') || action.includes('ORDER') || action.includes('WITHDRAW')) return <CreditCard className="w-4 h-4 text-green-500" />;
    if (action.includes('DELETE') || action.includes('USER')) return <Shield className="w-4 h-4 text-blue-500" />;
    if (action.includes('MENU') || action.includes('OPTION')) return <Settings className="w-4 h-4 text-orange-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
            System Monitoring
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Activity Logs <Activity className="w-10 h-10 text-green-500" />
          </h1>
          <p className="text-gray-500 font-medium">บันทึกเหตุการณ์และความเคลื่อนไหวทั้งหมดในระบบ</p>
        </div>

      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id || "all"}
            onClick={() => { setCategory(cat.id); setPage(1); }}
            className={`px-5 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${category === cat.id
              ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200'
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'
              }`}
          >
            <cat.icon className={`w-4 h-4 ${category === cat.id ? 'text-green-400' : cat.color}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Timestamp & Action</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Detail</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Performer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-8 py-6"><div className="h-12 bg-gray-50 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-green-50/20 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gray-50 border border-gray-100/50 group-hover:scale-110 transition-transform`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-gray-900 group-hover:text-green-600 transition-colors uppercase tracking-tight text-sm">{log.action}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString('th-TH')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-gray-600 leading-relaxed max-w-md">{log.description}</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.userRole === 'ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          log.userRole === 'OWNER' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                          {log.userRole}
                        </div>
                        <span className="text-xs font-black text-gray-400">
                          {log.userId ? `ID: ${log.userId}` : log.shopId ? `Shop ID: ${log.shopId}` : 'ID: N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Database className="w-16 h-16 text-gray-100" />
                      <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">Log history is empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
