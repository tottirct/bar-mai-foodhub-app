"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

const iconMap: { [key: string]: any } = Icons;

export default function Sidebar({ items }: SidebarProps) {

  const pathname = usePathname();
  const { data: session, status } = useSession();
  console.log(session);
  const name = session?.user?.name;

  if (status === 'loading') return null;

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col flex-start p-4">
      <div className='flex flex-start items-center py-2'>
        <div className='flex justify-center bg-green-200  w-12 h-12 rounded-full items-center '>
          <User className="flex justify-center w-8 h-8 items-center text-green-500" />
        </div>
        <div className='flex flex-col flex-start px-3'>
          <sub className="leading-none pt-1">ยินดีต้อนรับ</sub>
          <h2 className="leading-none pb-1 pt-1">{name}</h2>
        </div>
      </div>
      <nav className="flex flex-col gap-2 pt-2">
        {items.map((item) => {
          const DynamicIcon = iconMap[item.icon];
          const isActive = pathname === item.href;

          const baseClasses = `flex w-full items-center gap-3 p-3 rounded-lg transition-colors ${isActive
            ? "bg-green-100 text-green-600"
            : "text-gray-500 hover:bg-green-100 hover:text-green-600"
            }`;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={baseClasses}
              >
                {DynamicIcon && <DynamicIcon className="w-5 h-5" />}
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={baseClasses}
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