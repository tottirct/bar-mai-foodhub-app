import Sidebar from "@/components/Sidebar";
import { Banknote, BookOpenText, ScrollText } from "lucide-react";

export default function OwnerLayout({ children, }: { children: React.ReactNode; }) {

    const menuItems = [
        { label: "ออเดอร์", href: "/owner", icon: "ScrollText" },
        { label: "ธุรกรรม", href: "/owner/transactions", icon: "Banknote" },
        { label: "เมนู", href: "/owner/menus", icon: "BookOpenText" },
        { label: "ข้อมูลร้านค้า", href: "/owner/information", icon: "Store" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar items={menuItems} />
            <div className="flex-1 h-full overflow-y-auto">
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
