'use client';

import { use, useEffect, useState } from "react";
import { put } from '@vercel/blob';
import { Button } from '@/components/owner/Button';
import MenuCard from '@/components/owner/MenuCard';

interface Menu {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
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
      <div className="min-h-full flex flex-col items-start px-6">
        <div className="flex items-center my-4"> 
          <h1>รายการเมนูอาหาร</h1>
          <Button text = "เพิ่มรายการอาหาร" />
        </div>
        
        {/* Table Section */}
        <div className="flex flex-col w-full overflow-hidden">
            {menus.map((menu) => (
              <MenuCard key={menu.id} id={menu.id} name={menu.name} price={menu.price} status={menu.isAvailable} shopId={shopId} onSaveSuccess={refreshMenus} />
            ))}
        </div>
      </div>
  );
}