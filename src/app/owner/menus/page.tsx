'use client';

import { useSession } from "next-auth/react";
import { useState } from 'react';
import { put } from '@vercel/blob';
import { Button } from '@/components/owner/Button';
import MenuCard from '@/components/owner/MenuCard';

export default function OwnerMenusPage() {

  const { data: session, status } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  console.log(userId);

  return (
      <div className="min-h-full flex flex-col items-center justify-top px-6">
        <div className="flex items-center justify-between mb-4"> 
        {/* Header Section */}
          <h1>รายการเมนูอาหาร</h1>

        {/* Button Section */} 
          <Button text = "เพิ่มรายการอาหาร" />

        </div>
        
        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full overflow-hidden">
          <MenuCard name="ชื่อเมนูอาหาร" price={123} status="available" />
        </div>
      </div>
  );
}