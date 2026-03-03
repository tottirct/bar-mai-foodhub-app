'use client';

import { useState } from 'react';
import { put } from '@vercel/blob';
import { Button } from '@/components/owner/Button';

export default function OwnerMenusPage() {
  return (
      <div className="min-h-full flex items-center justify-center px-4">
       
        <div className="flex items-center justify-between mb-4"> 
        {/* Header Section */}
          <h1>รายการเมนูอาหาร</h1>

        {/* Button Section */} 
          <Button text = "เพิ่มรายการเมนูอาหาร" />

        </div>
        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        </div>
      </div>
  );
}