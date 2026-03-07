'use client';

import { use, useEffect, useState } from "react";
import { MenuButton } from '@/components/owner/MenuButton';
import MenuCard from '@/components/owner/MenuCard';

interface Menu {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string | null;
}

export default function OwnerMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [shopId, setShopId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await fetch('/api/users/my-shop');
        const shopData = await shopRes.json();

        if (!shopData.shopId) return;

        const menuRes = await fetch(`/api/shops/${shopData.shopId}/menus`);
        const result = await menuRes.json();

        console.log(result);

        setMenus(result.data);
        setShopId(shopData.shopId);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshMenus = async () => {
    console.log("กำลังดึงข้อมูลเมนูใหม่...");
    const res = await fetch(`/api/shops/${shopId}/menus?t=${Date.now()}`, {
      cache: 'no-store'
    });
    const result = await res.json();
    console.log("ข้อมูลใหม่ที่ได้รับ:", result.data);
    setMenus(result.data);
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="min-h-full flex flex-col w-full px-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 rounded-full text-green-600 text-xs font-bold tracking-widest uppercase">
            Menu Management
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">เมนูอาหาร</h1>
          <p className="text-gray-500 font-medium">จัดการเมนูอาหาร</p>
        </div>

        <div className="flex items-center gap-3">
          <MenuButton shopId={shopId} onSaveSuccess={refreshMenus} text="เพิ่มรายการอาหาร" />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col w-full overflow-hidden pt-8">
        {menus.map((menu) => (
          <MenuCard key={menu.id} id={menu.id} name={menu.name} price={menu.price} status={menu.isAvailable} imageUrl={menu.imageUrl} shopId={shopId} onSaveSuccess={refreshMenus} />
        ))}
      </div>
    </div>
  );
}