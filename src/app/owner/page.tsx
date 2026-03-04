"use client";

import { ScrollText } from "lucide-react";

export default function OwnerDashboard() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-[3rem] gap-6">
      <div className="p-8 bg-gray-50 rounded-full">
        <ScrollText className="w-16 h-16 text-gray-200" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter italic">Owner Dashboard</h3>
        <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">รอแปป</p>
      </div>
    </div>
  );
}
