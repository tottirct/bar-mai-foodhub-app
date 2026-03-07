"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Store, Loader2, ScrollText } from "lucide-react";
import OrderList from "@/components/owner/OrderList";

export default function OwnerDashboard() {
  const { data: session } = useSession();
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/shops");
        const data = await res.json();
        if (data.success) {
          // Find the shop owned by the current user
          const myShop = data.data.find((s: any) => s.ownerId === session.user?.id);
          if (myShop) setShopId(myShop.id);
        }
      } catch (error) {
        console.error("Failed to fetch shop:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchShop();
  }, [session]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Checking Shop Access...</p>
      </div>
    );
  }

  if (!shopId) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-[3rem] gap-6">
        <div className="p-8 bg-gray-50 rounded-full">
          <Store className="w-16 h-16 text-gray-200" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter">No Shop Linked</h3>
          <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">Please contact admin to link your shop</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
            Order Management
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Orders <ScrollText className="w-10 h-10 text-green-500" />
          </h1>
          <p className="text-gray-500 font-medium">จัดการออเดอร์และติดตามสถานะการทำอาหาร</p>
        </div>
      </div>

      <OrderList shopId={shopId} />
    </div>
  );
}
