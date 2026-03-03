"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

const iconMap: { [key: string]: any } = Icons;

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col p-4">
      <h1 className="pb-4" >บาร์ใหม่</h1>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const DynamicIcon = iconMap[item.icon];
          const isActive = pathname === item.href;

          return(

          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-green-100 text-green-600"
                  : "text-gray-500 hover:bg-green-100 hover:text-green-600"
              }`}
          >
          {DynamicIcon && <DynamicIcon className="w-5 h-5" />}
          {item.label}
          </Link>

          );

        })}
      </nav>
    </aside>
  );
}