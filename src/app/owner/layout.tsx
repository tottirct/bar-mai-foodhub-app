import Sidebar from "@/components/Sidebar";
import { Banknote, BookOpenText, ScrollText } from "lucide-react";

export default function OwnerLayout({children,}: {children: React.ReactNode;}) {

    const menuItems = [
    { label: "ออเดอร์", href: "/owner", icon: "ScrollText" },
    { label: "ธุรกรรม", href: "/owner/transactions", icon: "Banknote" },
    { label: "เมนู", href: "owner/menus", icon: "BookOpenText" },
    ];

    return (
        <div className="flex h-full bg-gray-50">
            <Sidebar items={menuItems} />
            <div className="flex-1 h-full overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
