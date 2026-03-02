// src/app/customer/layout.tsx
import Sidebar from "@/components/customer/Sidebar";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full bg-gray-50">

            <Sidebar />
            <div className="flex-1 h-full overflow-y-auto">
                {children}
            </div>
        </div>
    );
}